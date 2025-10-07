// src/media-handlers/media-handlers.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaHandlersService } from './media-handlers.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Response } from 'express';
import { Readable } from 'stream';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags("Media Handler")
@Controller("media-handler")
@UseInterceptors(AuditInterceptor)
export class MediaHandlersController {
  constructor(private readonly mediaHandlersService: MediaHandlersService) {}
  private s3Client = new S3Client({ region: process.env.AWS_REGION });
  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  @UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a media file to S3 (public URL)' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'referenceType',
    required: true,
    type: String,
    example: 'order',
  })
  @ApiQuery({ name: 'referenceId', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'typeId', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'tag', required: false, type: String, example: 'invoice' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded and linked' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('referenceType') referenceType: string,
    @Query('referenceId') referenceId: number,
    @Query('tag') tag: string,
    @Query('typeId') typeId: number,
    @CurrentUser() currentUser: any,
  ) {
    const url = await this.mediaHandlersService.uploadFileAndLink(
      file,
      currentUser.email,
      referenceType,
      referenceId,
      tag,
      typeId,
    );
    return url ?? null;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('documents')
  @ApiOperation({ summary: 'Get documents by reference type and ID' })
  @ApiQuery({
    name: 'referenceType',
    required: true,
    type: String,
    example: 'order',
  })
  @ApiQuery({ name: 'referenceId', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'typeId', required: false, type: Number, example: 1 })
  async getDocumentsByReference(
    @Query('referenceType') referenceType: string,
    @Query('referenceId') referenceId: number,
    @Query('typeId') typeId: number,  
  ) {
    return this.mediaHandlersService.getDocumentsByReference(
      referenceType,
      referenceId,
      typeId,
    );
  }

  @Get(':key')
  async getFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const file = await this.s3Client.send(command);

      if (file.ContentType) {
        res.setHeader('Content-Type', file.ContentType);
      } else {
        res.setHeader('Content-Type', 'application/octet-stream');
      }

      const bodyStream = file.Body as Readable;
      bodyStream.pipe(res);
    } catch (err) {
      res.status(404).send('File not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('migrate-legacy-azure-to-s3')
  @ApiOperation({ summary: 'Migrate legacy Azure blob media URLs to private S3 and update links' })
  async migrateLegacy() {
    return this.mediaHandlersService.migrateLegacyAzureToS3();
  }
}
