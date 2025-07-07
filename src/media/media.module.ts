import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Media } from './_/media.entity';
import { MediaLink } from 'src/media-link/_/media-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, MediaLink])],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}