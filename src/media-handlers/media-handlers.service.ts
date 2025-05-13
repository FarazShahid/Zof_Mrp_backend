import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as stream from 'stream';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { DocumentEntity } from './_/document.entity';
import { AnyAaaaRecord } from 'dns';

@Injectable()
export class MediaHandlersService {
  private readonly logger = new Logger(MediaHandlersService.name);
  private containerClient;

  constructor(
    private configService: ConfigService,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) {
    try {
      const sasUrl = this.configService.get<string>('AZURE_STORAGE_SAS_URL');
      const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME');

      if (!sasUrl || !containerName) {
        throw new Error('Azure Storage configuration is missing');
      }

      if (!sasUrl.startsWith('https://') || !sasUrl.includes('?')) {
        throw new Error('Invalid Azure Storage SAS URL format');
      }

      const blobServiceClient = new BlobServiceClient(sasUrl);
      this.containerClient = blobServiceClient.getContainerClient(containerName);

      this.logger.log('Azure Storage connection initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Azure Storage connection:', error.message);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File, docTypeId: number, createdBy: string): Promise<any> {
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

      const document = this.documentRepository.create({
        PhotoGuid: guid,
        FileName: nameWithoutExtension,
        Extension: extension,
        CloudPath: blockBlobClient.url,
        DocStatusId: 1,
        DocTypeId: docTypeId,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });
     const savedData = await this.documentRepository.save(document);
      return savedData;
    } catch (error) {
      this.logger.error('Failed to upload and save document:', error.message);
      throw error;
    }
  }
}
