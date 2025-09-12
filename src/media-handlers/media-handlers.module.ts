// src/media-handlers/media-handlers.module.ts
import { Module } from '@nestjs/common';
import { MediaHandlersService } from './media-handlers.service';
import { MediaHandlersController } from './media-handler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/media/_/media.entity';
import { MediaLink } from 'src/media-link/_/media-link.entity';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
   imports: [
      TypeOrmModule.forFeature([Media, MediaLink]),
      AuditModule
    ],
  providers: [MediaHandlersService],
  controllers: [MediaHandlersController],
  exports: [MediaHandlersService],
})
export class MediaHandlersModule {}
