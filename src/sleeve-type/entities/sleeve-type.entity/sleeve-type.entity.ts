export class SleeveTypeEntity { }
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Entity('sleevetype')
export class SleeveType {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  SleeveTypeName: string;

  @Column({ type: 'int', nullable: true })
  ProductCategoryId: number;

  @ManyToOne(() => ProductCategory, { nullable: true })
  @JoinColumn({ name: 'ProductCategoryId' })
  productCategory: ProductCategory;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string | null;
}