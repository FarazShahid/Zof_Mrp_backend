import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('inventoryitems')

export class InventoryItems {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 200 })
  Name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  ItemCode: string;

  @Column({ type: 'int', nullable: true })
  CategoryId: number;

  @ManyToOne(() => InventoryCategories, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'CategoryId', referencedColumnName: 'Id' }])
  category: InventoryCategories | null;

  @Column({ type: 'int', nullable: true })
  SubCategoryId: number | null;

  @ManyToOne(() => InventorySubCategories, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'SubCategoryId', referencedColumnName: 'Id' }])
  subcategory: InventorySubCategories | null;

  @Column({ type: 'int' })
  UnitOfMeasureId: number;

  @ManyToOne(() => UnitOfMeasures)
  @JoinColumn([{ name: 'UnitOfMeasureId', referencedColumnName: 'Id' }])
  unitOfMeasure: UnitOfMeasures;

  @Column({ type: 'int', nullable: true })
  SupplierId: number | null;

  @ManyToOne(() => InventorySuppliers, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'SupplierId', referencedColumnName: 'Id' }])
  supplier: InventorySuppliers | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  ReorderLevel: number | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  Stock: number | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  DeletedAt: Date;
}
