import { InventoryItems } from "src/inventory-items/_/inventory-items.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('inventorybillofmaterials')
export class InventoryBillOfMaterial {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    FinishedGoodId: number;

    @ManyToOne(() => InventoryItems, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'FinishedGoodId', referencedColumnName: 'Id' }])
    FinishedGood: InventoryItems;

    @Column({ type: 'int' })
    RawMaterialId: number;

    @ManyToOne(() => InventoryItems, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'RawMaterialId', referencedColumnName: 'Id' }])
    RawMaterial: InventoryItems;

    // Note: TypeORM maps DECIMAL to string by default to avoid precision loss.
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    QuantityRequired: string;

    @CreateDateColumn({ type: 'datetime', })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}

