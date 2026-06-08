import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('orderdocumenttypes')
export class OrderDocumentType extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  Name: string;

  @Column({ type: 'boolean', default: false })
  IsRequired: boolean;

  @Column({ type: 'json', nullable: true })
  SupportedExtensions: string[] | null;
}
