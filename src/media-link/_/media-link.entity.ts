/* STEP 2: media-link.entity.ts */
import { Media } from 'src/media/_/media.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('media_links')
export class MediaLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  media_id: number;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @Column()
  reference_type: string;

  @Column({ nullable: true })
  tag: string;

  @Column()
  reference_id: number;

  @CreateDateColumn()
  created_on: Date;

  @Column({ nullable: true })
  created_by: string;
}
