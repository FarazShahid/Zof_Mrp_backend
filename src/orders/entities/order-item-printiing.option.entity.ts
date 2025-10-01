import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { PrintingOptions } from '../../printingoptions/entities/printingoptions.entity';

@Entity('orderitemsprintingoptions')
export class OrderItemsPrintingOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  OrderItemId: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.printingOptions)
  @JoinColumn({ name: 'OrderItemId' })
  orderItem: OrderItem;

  @Column({ type: 'int' })
  PrintingOptionId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Description: string;

  @ManyToOne(() => PrintingOptions)
  @JoinColumn({ name: 'PrintingOptionId' })
  printingOption: PrintingOptions;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string;
}
