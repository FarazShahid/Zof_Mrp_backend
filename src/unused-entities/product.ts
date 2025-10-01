import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';


@Entity('productionorders')
export class ProductionOrder {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    FinishedGoodId: number;

    @ManyToOne(() => InventoryItems, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'FinishedGoodId', referencedColumnName: 'Id' }])
    finishedGood: InventoryItems;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    QuantityToProduce: string; // keep as string to preserve decimal precision

    @Column({ type: 'datetime' })
    ProductionDate: Date;

    @Column({ type: 'boolean', default: false })
    IsCompleted: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}

@Entity('productionconsumption')
export class ProductionConsumption {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    ProductionOrderId: number;

    @ManyToOne(() => ProductionOrder, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'ProductionOrderId', referencedColumnName: 'Id' }])
    productionOrder: ProductionOrder;

    @Column({ type: 'int' })
    RawMaterialId: number;

    @ManyToOne(() => InventoryItems, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'RawMaterialId', referencedColumnName: 'Id' }])
    rawMaterial: InventoryItems;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    QuantityUsed: string;

    @Column({ type: 'datetime' })
    UsedDate: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}
