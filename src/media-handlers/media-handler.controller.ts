// src/media-handlers/media-handlers.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaHandlersService } from './media-handlers.service';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user.decorator';

@ControllerAuthProtector('Media Handler', 'media-handler')
@ApiTags('Media Handler')
export class MediaHandlersController {
  constructor(private readonly mediaHandlersService: MediaHandlersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a media file to Azure Blob Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'typeId',
    type: Number,
    required: true,
    description: 'Document type ID for categorizing the upload',
  })
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('typeId') typeId: number,
     @CurrentUser() currentUser: any
  ) {
    const url = await this.mediaHandlersService.uploadFile(file, typeId, currentUser.email);
    return url ?? null;
  }
}
