import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';


@Entity('productregionstandard')

export class ProductRegionStandard {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  Name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string | null;
}
