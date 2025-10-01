import { ProductRegionStandard } from 'src/productregionstandard/_/product-region-standard.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sizeoptions')
export class SizeOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  OptionSizeOptions: string;

  @Column({ type: 'int', nullable: true })
  ProductRegionId: number;

  @ManyToOne(() => ProductRegionStandard, { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'ProductRegionId', referencedColumnName: 'Id' })
  ProductRegion?: ProductRegionStandard | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  CreatedBy: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  UpdatedBy: string | null;
}
