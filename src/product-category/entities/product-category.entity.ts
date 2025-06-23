import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('productcategory')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'boolean', default: false })
  IsTopUnit: boolean;

  @Column({ type: 'boolean', default: false })
  IsBottomUnit: boolean;

  @Column({ type: 'boolean', default: false })
  SupportsLogo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdOn: Date;

  @Column({ type: 'varchar', length: 100 })
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedOn: Date;

  @Column({ type: 'varchar', length: 100 })
  updatedBy: string;
  
}
