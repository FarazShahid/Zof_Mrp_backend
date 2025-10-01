import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;
}


