import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Media } from 'src/media/_/media.entity';
import { MediaLink } from 'src/media-link/_/media-link.entity';
import * as Busboy from 'busboy';

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
      const { PassThrough } = await import('stream');
      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);

      try {
        await blockBlobClient.uploadStream(bufferStream, file.size, undefined, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
        });
      } catch (uploadError: any) {
        // Provide more helpful error messages for common Azure Storage errors
        if (uploadError.statusCode === 403) {
          this.logger.error('Azure Storage authentication failed. Possible causes:');
          this.logger.error('1. SAS URL may be expired');
          this.logger.error('2. SAS URL may not have write (w) or create (c) permissions');
          this.logger.error('3. SAS URL format may be incorrect');
          this.logger.error(`Error details: ${uploadError.message}`);
          throw new Error(
            'Azure Storage authentication failed. Please check your SAS URL has write permissions and is not expired. ' +
            `Details: ${uploadError.message}`
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
    } catch (error: any) {
      this.logger.error('Failed to upload and save document:', error.message);
      if (error.message && error.message.includes('Azure Storage authentication failed')) {
        throw error;
      }
      throw new Error(`Failed to upload file: ${error.message || 'Unknown error'}`);
    }
  }

  // Change this value to adjust upload timeout: 1 = testing, 10 = production
  private uploadTimeoutMs = 1 * 60 * 1000;

  async uploadFileStream(
    req: any,
    createdBy: string,
    referenceType: string,
    referenceId: number,
    tag?: string,
    typeId?: number,
  ): Promise<any> {
    const FileTypesEnum = {
      DESIGN: { id: 1, name: 'Design File' },
      MOCKUP: { id: 2, name: 'Mockup File' },
      REQUIREMENT: { id: 3, name: 'Product Requirement File' },
      QASHEET: { id: 4, name: 'QA Sheet' },
    };

    if (typeId && !Object.values(FileTypesEnum).some((t) => t.id === typeId)) {
      throw new Error('Invalid typeId provided');
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      this.logger.warn(`[UPLOAD] Timeout after ${this.uploadTimeoutMs / 60000} minutes — aborting`);
      abortController.abort();
    }, this.uploadTimeoutMs);

    try {
      return await this.streamUpload(
        req, createdBy, referenceType, referenceId, tag, typeId,
        abortController.signal,
      );
    } catch (error: any) {
      if (abortController.signal.aborted || error.name === 'AbortError') {
        throw new Error(`Upload timed out after ${this.uploadTimeoutMs / 60000} minutes`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId); // clean up timer if upload finishes before timeout
    }
  }

  private streamUpload(
    req: any,
    createdBy: string,
    referenceType: string,
    referenceId: number,
    tag?: string,
    typeId?: number,
    abortSignal?: AbortSignal,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB guard
      });

      let fileHandled = false;

      busboy.on('file', (fieldname, fileStream, info) => {
        fileHandled = true;
        const { filename, mimeType } = info;
        const extension = filename.split('.').pop();
        const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
        const blobName = `${uuidv4()}-${filename}`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        // Destroy the incoming stream when abort fires (stops reading from nginx/client)
        abortSignal?.addEventListener('abort', () => fileStream.destroy());

        const uploadStart = Date.now();
        this.logger.log(`[UPLOAD] Starting: ${filename}`);

        blockBlobClient
          .uploadStream(fileStream, 4 * 1024 * 1024, 4, {
            blobHTTPHeaders: { blobContentType: mimeType },
            abortSignal, // tells Azure SDK to stop mid-upload on abort
            onProgress: (ev) => {
              const mb = (ev.loadedBytes / (1024 * 1024)).toFixed(2);
              const elapsed = ((Date.now() - uploadStart) / 1000).toFixed(1);
              const speed = ev.loadedBytes / 1024 / 1024 / parseFloat(elapsed);
              this.logger.log(
                `[UPLOAD] ${filename} — ${mb} MB uploaded | ${elapsed}s elapsed | ${speed.toFixed(2)} MB/s`,
              );
            },
          })
          .then(async () => {
            try {
              const media = this.mediaRepository.create({
                file_name: nameWithoutExtension,
                file_type: extension,
                file_url: blobName,
                typeId: typeId || null,
                uploaded_by: createdBy,
              });
              const savedMedia = await this.mediaRepository.save(media);

              const link = this.mediaLinkRepository.create({
                media_id: savedMedia.id,
                reference_type: referenceType,
                reference_id: referenceId,
                tag: tag || null,
                created_by: createdBy,
              });
              const savedLink = await this.mediaLinkRepository.save(link);

              resolve({
                message: 'File uploaded and linked successfully',
                media: savedMedia,
                link: savedLink,
              });
            } catch (dbError) {
              reject(dbError);
            }
          })
          .catch((uploadError: any) => {
            if (uploadError.statusCode === 403) {
              this.logger.error('Azure Storage 403 — check SAS URL permissions/expiry');
              reject(
                new Error(
                  'Azure Storage authentication failed. Verify SAS URL has write/create permissions and is not expired. ' +
                    `Details: ${uploadError.message}`,
                ),
              );
            } else {
              reject(uploadError);
            }
          });

        fileStream.on('limit', () => {
          fileStream.destroy();
          reject(new Error('File size exceeds the 500 MB limit'));
        });
      });

      busboy.on('finish', () => {
        if (!fileHandled) {
          reject(new Error('No file field found in the request'));
        }
      });

      busboy.on('error', (err) => reject(err));

      req.pipe(busboy);
    });
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
