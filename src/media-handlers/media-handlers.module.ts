// src/media-handlers/media-handlers.module.ts
import { Module } from '@nestjs/common';
import { MediaHandlersService } from './media-handlers.service';
import { MediaHandlersController } from './media-handler.controller';
import { DocumentEntity } from './_/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
      TypeOrmModule.forFeature([
       DocumentEntity
      ]),
    ],
  providers: [MediaHandlersService],
  controllers: [MediaHandlersController],
  exports: [MediaHandlersService],
})
export class MediaHandlersModule {}
