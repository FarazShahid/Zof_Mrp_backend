import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fabrictype')
export class FabricType {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  Type: string;

  @Column({ type: 'varchar', length: 255 })
  Name: string;

  @Column({ type: 'int' })
  GSM: number;

  @Column({ type: 'int', nullable: true })
  CategoryId: number | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100 })
  CreatedBy: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;
}
