import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('productcategory')

export class ProductCategory {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  Type: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsTopUnit: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsBottomUnit: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  SupportsLogo: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsHat: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsBag: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  IsSocks: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;

}
