import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Entity('productsubcategory')
export class ProductSubCategory {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;

    @Column({ type: 'varchar', length: 255 })
    Name: string;

    @Column({ type: 'int' })
    ProductCategoryId: number;

    @ManyToOne(() => ProductCategory, { onUpdate: 'CASCADE' })
    @JoinColumn([{ name: 'ProductCategoryId', referencedColumnName: 'Id' }])
    ProductCategory: ProductCategory;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    CreatedBy: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    UpdatedBy: string | null;
}
