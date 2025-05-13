import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'document' })
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  PhotoGuid: string;

  @Column({ type: 'varchar', length: 255 })
  FileName: string;

  @Column({ type: 'varchar', length: 50 })
  Extension: string;

  @Column({ type: 'text', nullable: true })
  PhysicalPath: string;

  @Column({ type: 'text', nullable: true })
  CloudPath: string;

  @Column({ type: 'int' })
  DocStatusId: number;

  @Column({ type: 'int' })
  DocTypeId: number;

  @CreateDateColumn({ type: 'datetime' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @UpdateDateColumn({ type: 'datetime' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;
}
