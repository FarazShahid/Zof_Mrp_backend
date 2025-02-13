import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('productregionstandard')
export class ProductRegionStandard {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @CreateDateColumn({ type: 'datetime' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @UpdateDateColumn({ type: 'datetime' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;
}
