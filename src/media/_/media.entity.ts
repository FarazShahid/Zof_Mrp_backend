import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 100 })
  file_type: string;

  @Column({ type: 'text' })
  file_url: string;

  @Column({ type: 'int', nullable: true })
  typeId: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  uploaded_by: string | null;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  uploaded_on: Date | null;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_on: Date | null;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date | null;
}