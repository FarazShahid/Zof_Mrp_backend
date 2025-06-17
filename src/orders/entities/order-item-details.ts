import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderItem } from './order-item.entity';
import { ColorOption } from '../../coloroption/_/color-option.entity';

@Entity('orderitemdetails')
export class OrderItemDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OrderItemId: number;

  @Column()
  ColorOptionId: number;

   @Column()
  SizeOption: number;

   @Column()
  MeasurementId: number;

  @Column()
  Quantity: number;

  @Column()
  Priority: number;

  // Relations
  @ManyToOne(() => OrderItem, orderItem => orderItem.orderItemDetails)
  @JoinColumn({ name: 'OrderItemId' })
  orderItem: OrderItem;

  @ManyToOne(() => ColorOption)
  @JoinColumn({ name: 'ColorOptionId' })
  colorOption: ColorOption;
}
