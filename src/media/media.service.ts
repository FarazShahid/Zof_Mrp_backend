import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './_/media.entity';
import { MediaLink } from 'src/media-link/_/media-link.entity';
import { CreateMediaDto, LinkMediaDto } from './_/media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepo: Repository<Media>,
    @InjectRepository(MediaLink)
    private mediaLinkRepo: Repository<MediaLink>,
  ) {}

  async create(data: CreateMediaDto) {
    const media = this.mediaRepo.create(data);
    return await this.mediaRepo.save(media);
  }

  async linkMedia(data: LinkMediaDto) {
    const link = this.mediaLinkRepo.create(data);
    return await this.mediaLinkRepo.save(link);
  }

  async findAll() {
    return this.mediaRepo.find();
  }

  async findOne(id: number) {
    return this.mediaRepo.findOneBy({ id });
  }

  async findByReference(type: string, refId: number) {
    const links = await this.mediaLinkRepo.find({
      where: { reference_type: type, reference_id: refId },
      relations: ['media'],
    });

    return links.map((link) => ({
      id: link.id,
      mediaId: link.media?.id,
      tag: link.tag || null,
      fileName: link.media?.file_name,
      fileType: link.media?.file_type,
      fileUrl: link.media?.file_url,
      uploadedBy: link.media?.uploaded_by,
      uploadedOn: link.media?.uploaded_on,
      referenceType: link.reference_type,
      referenceId: link.reference_id,
    }));
  }

  async update(id: number, data: Partial<CreateMediaDto>) {
    await this.mediaRepo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number) {
    await this.mediaRepo.softDelete(id);
    return { message: 'Media deleted' };
  }
}
