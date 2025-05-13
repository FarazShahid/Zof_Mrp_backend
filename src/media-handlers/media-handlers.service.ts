// src/media-handlers/media-handlers.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as stream from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaHandlersService {
  private readonly logger = new Logger(MediaHandlersService.name);
  private containerClient;

  constructor(private configService: ConfigService) {
    try {
      const sasUrl = this.configService.get<string>('AZURE_STORAGE_SAS_URL');
      const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME');
      
      if (!sasUrl || !containerName) {
        throw new Error('Azure Storage configuration is missing');
      }

      // Validate SAS URL format
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

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const blobName = `${uuidv4()}-${file.originalname}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      await blockBlobClient.uploadStream(bufferStream, file.size, undefined, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      return blockBlobClient.url;
    } catch (error) {
      this.logger.error('Failed to upload file:', error.message);
      throw error;
    }
  }
}
