// src/media-handlers/public-media.controller.ts
import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { MediaHandlersService } from './media-handlers.service';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Public Media')
@Controller('public/media')
export class PublicMediaController {
  constructor(
    private readonly mediaHandlersService: MediaHandlersService,
  ) {}

  @Get(':key')
  @ApiOperation({ summary: 'Stream media file by blob name (public, server-token only)' })
  @ApiParam({
    name: 'key',
    description: 'The blob name (file name) to fetch',
    example: '123e4567-e89b-12d3-a456-426614174000-document.pdf',
  })
  @ApiResponse({ status: 200, description: 'Media file stream' })
  @ApiResponse({ status: 404, description: 'Not found - Media file does not exist' })
  async getFile(
    @Param('key') key: string,
    @Res() res: Response,
  ) {
    try {
      const blobName = decodeURIComponent(key);

      // Get media from Azure Storage
      const mediaData = await this.mediaHandlersService.getMediaByBlobName(blobName);

      if (!mediaData) {
        throw new NotFoundException(`Media file with blob name "${blobName}" not found`);
      }

      // Set response headers
      res.setHeader('Content-Type', mediaData.contentType);
      res.setHeader('Content-Length', mediaData.contentLength);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

      // Inline viewing; client can decide to download
      res.setHeader('Content-Disposition', 'inline');

      // Stream the file
      mediaData.stream.pipe(res);
    } catch (error) {
      throw new NotFoundException(`File not found: ${key}`);
    }
  }
}

