import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';

@Entity('unitofmeasures')
export class UnitOfMeasures {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  Name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ShortForm: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string | null;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  DeletedAt: Date | null;
}