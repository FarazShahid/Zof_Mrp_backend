// src/media-handlers/media-handlers.module.ts
import { Module } from '@nestjs/common';
import { MediaHandlersService } from './media-handlers.service';
import { MediaHandlersController } from './media-handler.controller';
@Module({
  providers: [MediaHandlersService],
  controllers: [MediaHandlersController],
  exports: [MediaHandlersService],
})
export class MediaHandlersModule {}
