import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderItem } from './order-item.entity';
import { PrintingOptions } from '../../printingoptions/entities/printingoptions.entity';

@Entity('orderitemsprintingoptions')
export class OrderItemsPrintingOption extends BaseEntity {
  @Column()
  OrderItemId: number;

  @Column()
  PrintingOptionId: number;

  @Column({ nullable: true })
  Description: string;

  // Relations
  @ManyToOne(() => OrderItem, orderItem => orderItem.printingOptions)
  @JoinColumn({ name: 'OrderItemId' })
  orderItem: OrderItem;

  @ManyToOne(() => PrintingOptions)
  @JoinColumn({ name: 'PrintingOptionId' })
  printingOption: PrintingOptions;
}
