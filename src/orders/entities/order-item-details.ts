import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { ColorOption } from '../../coloroption/_/color-option.entity';

@Entity('orderitemdetails')
export class OrderItemDetails {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  OrderItemId: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.orderItemDetails)
  @JoinColumn({ name: 'OrderItemId' })
  orderItem: OrderItem;

  @Column({ type: 'int', nullable: true })
  ColorOptionId: number;

  @ManyToOne(() => ColorOption)
  @JoinColumn({ name: 'ColorOptionId' })
  colorOption: ColorOption;

  @Column({ type: 'int', nullable: true })
  SizeOption: number;

  @Column({ type: 'int', nullable: true })
  MeasurementId: number;

  @Column({ type: "int", default: () => '1' })
  Quantity: number;

  @Column({ type: "int", default: () => '0' })
  Priority: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 255 })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 255 })
  UpdatedBy: string;
}
