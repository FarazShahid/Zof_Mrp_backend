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

      const sasParams = new URL(sasUrl).searchParams;
      const permissions = sasParams.get('sp') || sasParams.get('permissions') || '';

      if (permissions && !permissions.includes('w') && !permissions.includes('c')) {
        this.logger.warn(
          'Warning: SAS URL may not have write/create permissions. ' +
          'Required permissions: w (write) and c (create) for uploads.'
        );
      }

      const blobServiceClient = new BlobServiceClient(sasUrl);
      this.containerClient =
        blobServiceClient.getContainerClient(containerName);

      this.logger.log('Azure Storage connection initialized successfully');
      this.logger.log(`Container: ${containerName}`);
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

      try {
        await blockBlobClient.uploadStream(bufferStream, file.size, undefined, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
        });
      } catch (uploadError: unknown) {
        // Provide more helpful error messages for common Azure Storage errors
        const error = uploadError as { statusCode?: number; message?: string };
        if (error.statusCode === 403) {
          this.logger.error('Azure Storage authentication failed. Possible causes:');
          this.logger.error('1. SAS URL may be expired');
          this.logger.error('2. SAS URL may not have write (w) or create (c) permissions');
          this.logger.error('3. SAS URL format may be incorrect');
          this.logger.error(`Error details: ${error.message}`);
          throw new Error(
            'Azure Storage authentication failed. Please check your SAS URL has write permissions and is not expired. ' +
            `Details: ${error.message}`
          );
        }
        throw uploadError;
      }

      const FileTypesEnum = {
        DESIGN: { id: 1, name: "Design File" },
        MOCKUP: { id: 2, name: "Mockup File" },
        REQUIREMENT: { id: 3, name: "Product Requirement File" },
        QASHEET: { id: 4, name: "QA Sheet" },
      };

      const isValidTypeId = Object.values(FileTypesEnum).some(type => type.id === typeId);

      if (typeId && !isValidTypeId) {
        throw new Error('Invalid typeId provided');
      }

      const document = this.mediaRepository.create({
        file_name: nameWithoutExtension,
        file_type: extension,
        file_url: blobName, // Store only blob name instead of complete URL
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
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error('Failed to upload and save document:', err.message);
      if (err.message && err.message.includes('Azure Storage authentication failed')) {
        throw error;
      }
      throw new Error(`Failed to upload file: ${err.message || 'Unknown error'}`);
    }
  }

  async getDocumentsByReference(
    referenceType: string,
    referenceId: number,
    typeId?: number,
  ): Promise<any[]> {
    const links = await this.mediaLinkRepository.find({
      where: { reference_type: referenceType, reference_id: referenceId, media: typeId ? { typeId } : {} },
      relations: ['media'],
    });

     const FileTypesEnum = {
        DESIGN: { id: 1, name: "Design File" },
        MOCKUP: { id: 2, name: "Mockup File" },
        REQUIREMENT: { id: 3, name: "Product Requirement File" },
        QASHEET: { id: 4, name: "QA Sheet" },
      };

    return links.map((link) => {
      // Construct URL dynamically using blob name
      const blobName = link.media?.file_url; // file_url now contains blob name
      const fileUrl = blobName ? this.constructMediaUrl(blobName) : null;

      return {
        id: link.id,
        mediaId: link.media?.id,
        fileName: link.media?.file_name,
        fileType: link.media?.file_type,
        fileUrl: blobName,
        tag: link.tag || null,
        typeId: link.media?.typeId || null,
        typeName: link.media?.typeId ? Object.values(FileTypesEnum).find(type => type.id === link.media.typeId)?.name : null,
        uploadedBy: link.media?.uploaded_by,
        uploadedOn: link.media?.uploaded_on,
        referenceType: link.reference_type,
        referenceId: link.reference_id,
      };
    });
  }

  /**
   * Construct media URL using blob name
   * Uses environment variables for base URL and token
   */
  private constructMediaUrl(blobName: string): string {
    const mediaViewUrl = this.configService.get<string>('MEDIA_VIEW_URL') || '';
    if (!mediaViewUrl || !blobName) {
      return '';
    }

    // Ensure no trailing slash, then append path segment
    const base = mediaViewUrl.endsWith('/')
      ? mediaViewUrl.slice(0, -1)
      : mediaViewUrl;

    return `${base}/${encodeURIComponent(blobName)}`;
  }

  /**
   * Get media file by blob name from Azure Storage
   */
  async getMediaByBlobName(blobName: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string; contentLength: number } | null> {
    try {
      console.log('blobName', blobName);
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      console.log('blockBlobClient', blockBlobClient);
      // Check if blob exists
      const exists = await blockBlobClient.exists();
      if (!exists) {
        return null;
      }

      // Get blob properties
      const properties = await blockBlobClient.getProperties();
      
      // Download blob as stream
      const downloadResponse = await blockBlobClient.download(0);
      
      if (!downloadResponse.readableStreamBody) {
        throw new Error('Failed to get readable stream from blob');
      }
      
      return {
        stream: downloadResponse.readableStreamBody,
        contentType: properties.contentType || 'application/octet-stream',
        contentLength: properties.contentLength,
      };
    } catch (error) {
      this.logger.error(`Failed to get media by blob name ${blobName}:`, error.message);
      throw error;
    }
  }
}
