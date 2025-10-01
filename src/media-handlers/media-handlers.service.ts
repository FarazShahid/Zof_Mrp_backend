import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as stream from 'stream';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Media } from 'src/media/_/media.entity';
import { MediaLink } from 'src/media-link/_/media-link.entity';

@Injectable()
export class MediaHandlersService {
  private readonly logger = new Logger(MediaHandlersService.name);
  private containerClient;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @InjectRepository(MediaLink)
    private readonly mediaLinkRepository: Repository<MediaLink>,
  ) {
    try {
      const sasUrl = this.configService.get<string>('AZURE_STORAGE_SAS_URL');
      const containerName = this.configService.get<string>(
        'AZURE_STORAGE_CONTAINER_NAME',
      );

      if (!sasUrl || !containerName) {
        throw new Error('Azure Storage configuration is missing');
      }

      if (!sasUrl.startsWith('https://') || !sasUrl.includes('?')) {
        throw new Error('Invalid Azure Storage SAS URL format');
      }

      const blobServiceClient = new BlobServiceClient(sasUrl);
      this.containerClient =
        blobServiceClient.getContainerClient(containerName);

      this.logger.log('Azure Storage connection initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Azure Storage connection:',
        error.message,
      );
      throw error;
    }
  }

  async uploadFileAndLink(
    file: Express.Multer.File,
    createdBy: string,
    referenceType: string,
    referenceId: number,
    tag?: string,
    typeId?: number
  ): Promise<any> {
    try {
      const extension = file.originalname.split('.').pop();
      const nameWithoutExtension = file.originalname.replace(/\.[^/.]+$/, '');
      const guid = uuidv4();
      const blobName = `${guid}-${file.originalname}`;

      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      await blockBlobClient.uploadStream(bufferStream, file.size, undefined, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      const FileTypesEnum = {
        DESIGN: { id: 1, name: "Design File" },
        MOCKUP: { id: 2, name: "Mockup File" },
        REQUIREMENT: { id: 3, name: "Product Requirement File" },
      };

      const isValidTypeId = Object.values(FileTypesEnum).some(type => type.id === typeId);

      if (typeId && !isValidTypeId) {
        throw new Error('Invalid typeId provided');
      }

      const document = this.mediaRepository.create({
        file_name: nameWithoutExtension,
        file_type: extension,
        file_url: blockBlobClient.url,
        typeId: typeId || null,
        uploaded_by: createdBy,
      });

      const savedMedia = await this.mediaRepository.save(document);

      const mediaLink = this.mediaLinkRepository.create({
        media_id: savedMedia.id,
        reference_type: referenceType,
        reference_id: referenceId,
        tag: tag || null,
        created_by: createdBy,
      });

      const savedLink = await this.mediaLinkRepository.save(mediaLink);

      return {
        message: 'File uploaded and linked successfully',
        media: savedMedia,
        link: savedLink,
      };
    } catch (error) {
      this.logger.error('Failed to upload and save document:', error.message);
      throw error;
    }
  }

  async getDocumentsByReference(
    referenceType: string,
    referenceId: number,
  ): Promise<any[]> {
    const links = await this.mediaLinkRepository.find({
      where: { reference_type: referenceType, reference_id: referenceId },
      relations: ['media'],
    });

     const FileTypesEnum = {
        DESIGN: { id: 1, name: "Design File" },
        MOCKUP: { id: 2, name: "Mockup File" },
        REQUIREMENT: { id: 3, name: "Product Requirement File" },
      };

    return links.map((link) => ({
      id: link.id,
      mediaId: link.media?.id,
      fileName: link.media?.file_name,
      fileType: link.media?.file_type,
      fileUrl: link.media?.file_url,
      tag: link.tag || null,
      typeId: link.media?.typeId || null,
      typeName: link.media?.typeId ? Object.values(FileTypesEnum).find(type => type.id === link.media.typeId)?.name : null,
      uploadedBy: link.media?.uploaded_by,
      uploadedOn: link.media?.uploaded_on,
      referenceType: link.reference_type,
      referenceId: link.reference_id,
    }));
  }
}
