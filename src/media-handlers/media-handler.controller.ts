// src/media-handlers/media-handlers.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaHandlersService } from './media-handlers.service';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ControllerAuthProtector('Media Handler', 'media-handler')
@ApiTags('Media Handler')
export class MediaHandlersController {
  constructor(private readonly mediaHandlersService: MediaHandlersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a media file to Azure Blob Storage' })
  @ApiConsumes('multipart/form-data')
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
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: { url: 'https://genxstorage.blob.core.windows.net/dev/yourfile.jpg' },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.mediaHandlersService.uploadFile(file);
    return { url };
  }
}
