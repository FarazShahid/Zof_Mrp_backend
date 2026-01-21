// src/media-handlers/media-handlers.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Get,
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
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';

@ControllerAuthProtector('Media Handler', 'media-handler')
@UseInterceptors(AuditInterceptor)
@ApiTags('Media Handler')
export class MediaHandlersController {
  constructor(private readonly mediaHandlersService: MediaHandlersService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a media file to Azure Blob Storage' })
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
    @CurrentUser() currentUser: ValidatedUser,
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
}
