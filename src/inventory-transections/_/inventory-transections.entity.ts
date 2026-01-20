import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  PRODUCTION = 'PRODUCTION',
  OPENING_BALANCE = 'Opening Balance',
  RETURN_TO_STOCK = 'Return to Stock',
  RETURN_TO_SUPPLIER = 'Return to Supplier',
  DISPOSAL = 'Disposal'
}

@Entity('inventorytransactions')

export class InventoryTransactions {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  InventoryItemId: number;

  @ManyToOne(() => InventoryItems, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'InventoryItemId', referencedColumnName: 'Id' }])
  item: InventoryItems;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Quantity: number;

  @Column({ type: 'enum', enum: TransactionType })
  TransactionType: TransactionType;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  TransactionDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  CurrentStock: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'int', nullable: true })
  ClientId: number;

  @Column({ type: 'int', nullable: true })
  OrderId: number;

  @Column({ type: 'int', nullable: true })
  SupplierId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  DeletedAt: Date;
}
