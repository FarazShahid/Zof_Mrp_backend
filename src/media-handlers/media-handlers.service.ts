import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { BlobServiceClient } from '@azure/storage-blob';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Media } from 'src/media/_/media.entity';
import { MediaLink } from 'src/media-link/_/media-link.entity';

@Injectable()
export class MediaHandlersService {
  private readonly logger = new Logger(MediaHandlersService.name);
  // private containerClient;

  private s3Client: S3Client;   // ✅ declare S3 client
  private bucketName: string;   // ✅ declare bucket name

  constructor(
    private configService: ConfigService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @InjectRepository(MediaLink)
    private readonly mediaLinkRepository: Repository<MediaLink>,
  ) {
    try {
      // const sasUrl = this.configService.get<string>('AZURE_STORAGE_SAS_URL');
      // const containerName = this.configService.get<string>(
      //   'AZURE_STORAGE_CONTAINER_NAME',
      // );

      // if (!sasUrl || !containerName) {
      //   throw new Error('Azure Storage configuration is missing');
      // }

      // if (!sasUrl.startsWith('https://') || !sasUrl.includes('?')) {
      //   throw new Error('Invalid Azure Storage SAS URL format');
      // }

      // const blobServiceClient = new BlobServiceClient(sasUrl);
      // this.containerClient =
      //   blobServiceClient.getContainerClient(containerName);

      // this.logger.log('Azure Storage connection initialized successfully');

      this.s3Client = new S3Client({
        region: this.configService.get<string>('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        },
      });

      this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');


      this.logger.log('S3 Storage connection initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize S3 Storage connection:',
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
      const key = `${guid}-${file.originalname}`;

      // Commenting out Azure Blob Storage code

      // const blobName = `${guid}-${file.originalname}`;

      // const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      // const bufferStream = new stream.PassThrough();
      // bufferStream.end(file.buffer);

      // await blockBlobClient.uploadStream(bufferStream, file.size, undefined, {
      //   blobHTTPHeaders: { blobContentType: file.mimetype },
      // });

      // Replacing with AWS S3 upload code
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }));

      // Store a backend-proxied URL to keep S3 private
      // Prefer explicit public URL, then APP_URL; fallback to relative path
      const publicBase =
        this.configService.get<string>('APP_PUBLIC_URL') ||
        this.configService.get<string>('APP_URL') ||
        '';
      const proxyPath = `/media-handler/${encodeURIComponent(key)}`;
      const fileUrl = publicBase
        ? `${publicBase.replace(/\/$/, '')}${proxyPath}`
        : proxyPath;

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
        // file_url: blockBlobClient.url,
        file_url: fileUrl,
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

  async migrateLegacyAzureToS3(): Promise<{ migrated: number; failed: number; details: { id: number; status: 'migrated' | 'skipped' | 'failed'; reason?: string }[] }> {
    const details: { id: number; status: 'migrated' | 'skipped' | 'failed'; reason?: string }[] = [];
    let migrated = 0;
    let failed = 0;

    // Find media entries that still point to Azure Blob URLs
    const legacyMedia = await this.mediaRepository.find({
      where: {
        // crude filter via Like; TypeORM syntax differs per DB, so fallback to post-filter
      } as any,
    });

    const candidates = legacyMedia.filter((m) => typeof (m as any).file_url === 'string' && (m as any).file_url.includes('blob.core.windows.net')) as any[];

    for (const media of candidates) {
      const mediaId = (media as any).id as number;
      const legacyUrl = (media as any).file_url as string;
      try {
        // Download from Azure via SAS URL
        const response = await fetch(legacyUrl);
        if (!response.ok) {
          throw new Error(`Download failed with status ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Build S3 key
        const guid = uuidv4();
        const nameWithoutExtension: string = (media as any).file_name || 'file';
        const extensionFromDb: string | undefined = (media as any).file_type;
        let extension = extensionFromDb;
        if (!extension) {
          try {
            const urlObj = new URL(legacyUrl);
            const path = urlObj.pathname;
            const last = path.split('/')?.pop() || '';
            const ext = last.includes('.') ? last.split('.').pop() : '';
            extension = ext || undefined;
          } catch {}
        }
        const safeExt = extension ? `.${extension}` : '';
        const originalName = `${nameWithoutExtension}${safeExt}`;
        const key = `${guid}-${originalName}`;

        // Content type: best-effort
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Upload to S3 (private)
        await this.s3Client.send(new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        // Update DB record to proxy URL
        const publicBase =
          this.configService.get<string>('APP_PUBLIC_URL') ||
          this.configService.get<string>('APP_URL') ||
          '';
        const proxyPath = `/media-handler/${encodeURIComponent(key)}`;
        const newUrl = publicBase ? `${publicBase.replace(/\/$/, '')}${proxyPath}` : proxyPath;

        (media as any).file_url = newUrl;
        await this.mediaRepository.save(media);

        details.push({ id: mediaId, status: 'migrated' });
        migrated += 1;
      } catch (err: any) {
        this.logger.error(`Migration failed for media ${mediaId}: ${err?.message || err}`);
        details.push({ id: mediaId, status: 'failed', reason: err?.message || 'unknown' });
        failed += 1;
      }
    }

    return { migrated, failed, details };
  }
}
