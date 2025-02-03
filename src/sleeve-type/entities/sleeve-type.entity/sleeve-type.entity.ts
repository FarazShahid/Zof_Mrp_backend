export class SleeveTypeEntity {}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Entity('sleevetype')
export class SleeveType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sleeveTypeName: string;

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'productCategoryId' })
  productCategory: ProductCategory;

  @CreateDateColumn()
  createdOn: Date;

  @Column()
  createdBy: string;

  @UpdateDateColumn()
  updatedOn: Date;

  @Column()
  updatedBy: string;
}