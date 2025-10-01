import { Entity, Column, ManyToOne, JoinColumn, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './orders.entity';
import { Product } from '../../products/entities/product.entity';
import { OrderItemsPrintingOption } from './order-item-printiing.option.entity';
import { OrderItemDetails } from './order-item-details';
import { ShipmentBoxItem } from 'src/shipment/entities/shipment-box.entity';


export enum OrderItemShipmentEnum {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  PARTIALLY_SHIPPED = 'Partially Shipped',
}

@Entity('orderitems')
export class OrderItem {

  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  OrderId: number;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'OrderId' })
  order: Order;

  @Column({ type: 'int' })
  ProductId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'ProductId' })
  product: Product;

  @Column({ nullable: true })
  Description: string;

  @Column({ type: 'int', nullable: true })
  ImageId: number;

  @Column({ type: 'int', nullable: true })
  FileId: number;

  @Column({ type: 'int', nullable: true })
  VideoId: number;

  @Column({ type: 'int', default: 0 })
  OrderItemPriority: number;

  // Relations

  @OneToMany(() => OrderItemsPrintingOption, printingOption => printingOption.orderItem)
  printingOptions: OrderItemsPrintingOption[];

  @OneToMany(() => OrderItemDetails, orderItemDetail => orderItemDetail.orderItem)
  orderItemDetails: OrderItemDetails[];

  @OneToMany(() => ShipmentBoxItem, item => item.OrderItem)
  ShipmentBoxItems: ShipmentBoxItem[];

  @Column({ type: 'enum', enum: OrderItemShipmentEnum, default: OrderItemShipmentEnum.PENDING })
  itemShipmentStatus: OrderItemShipmentEnum;


  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 255 })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 255 })
  UpdatedBy: string;

}
