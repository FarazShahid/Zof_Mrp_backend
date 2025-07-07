import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto, LinkMediaDto } from './_/media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() dto: CreateMediaDto) {
    return this.mediaService.create(dto);
  }

  @Post('link')
  link(@Body() dto: LinkMediaDto) {
    return this.mediaService.linkMedia(dto);
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.mediaService.findOne(id);
  }

  @Get('reference/:type/:refId')
  findByReference(@Param('type') type: string, @Param('refId') refId: number) {
    return this.mediaService.findByReference(type, refId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreateMediaDto>) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.mediaService.delete(id);
  }
}