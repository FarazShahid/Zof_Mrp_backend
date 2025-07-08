import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from './orders.entity';
import { Product } from '../../products/entities/product.entity';
import { OrderItemsPrintingOption } from './order-item-printiing.option.entity';
import { OrderItemDetails } from './order-item-details';
// import { ShipmentDetail } from 'src/shipment/entities/shipment-details';

@Entity('orderitems')
export class OrderItem extends BaseEntity {
  @Column()
  OrderId: number;

  @Column()
  ProductId: number;

  @Column({ nullable: true })
  Description: string;

  @Column({ nullable: true })
  ImageId: number;

  @Column({ nullable: true })
  FileId: number;

  @Column({ nullable: true })
  VideoId: number;

  @Column({ type: 'int', default: 0 })
  OrderItemPriority: number;

  // Relations
  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'OrderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'ProductId' })
  product: Product;

  @OneToMany(() => OrderItemsPrintingOption, printingOption => printingOption.orderItem)
  printingOptions: OrderItemsPrintingOption[];

  @OneToMany(() => OrderItemDetails, orderItemDetail => orderItemDetail.orderItem)
  orderItemDetails: OrderItemDetails[];

  // //New COlumn
  // @OneToMany(() => ShipmentDetail, detail => detail.OrderItem)
  // ShipmentDetails: ShipmentDetail[];
}
