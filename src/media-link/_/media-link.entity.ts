/* STEP 2: media-link.entity.ts */
import { Media } from 'src/media/_/media.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('media_links')

export class MediaLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  media_id: number;

  @ManyToOne(() => Media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'media_id', referencedColumnName: 'id' })
  media: Media;

  @Column({ type: 'int' })
  reference_id: number;

  @Column({ type: 'varchar', length: 100 })
  reference_type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tag: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  created_by: string;
}
