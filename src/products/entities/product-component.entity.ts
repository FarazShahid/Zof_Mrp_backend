import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductComponentType } from 'src/product-component-types/entities/product-component-type.entity';
import { FabricType } from 'src/fabrictype/_/fabrictype.entity';

@Entity('productcomponent')
export class ProductComponent {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;

    @Column({ type: 'int' })
    ProductId: number;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'ProductId', referencedColumnName: 'Id' }])
    Product: Product;

    @Column({ type: 'int' })
    ComponentTypeId: number;

    @ManyToOne(() => ProductComponentType, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'ComponentTypeId', referencedColumnName: 'Id' }])
    ComponentType: ProductComponentType;

    @Column({ type: 'int' })
    FabricTypeId: number;

    @ManyToOne(() => FabricType, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'FabricTypeId', referencedColumnName: 'Id' }])
    FabricType: FabricType;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;
}
