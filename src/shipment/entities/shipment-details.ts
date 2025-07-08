import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./shipment.entity";
import { OrderItem } from "src/orders/entities/order-item.entity";

@Entity('ShipmentDetails')
export class ShipmentDetail {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ShipmentId: number;

  @ManyToOne(() => Shipment, shipment => shipment.ShipmentDetails)
  @JoinColumn({ name: 'ShipmentId' })
  Shipment: Shipment;

  @Column()
  OrderItemId: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.ShipmentDetails)
  @JoinColumn({ name: 'OrderItemId' })
  OrderItem: OrderItem;

  @Column()
  Quantity: number;

  @Column()
  Size: string;

  @Column()
  Description:string;

  @Column({ nullable: true })
  ItemDetails?: string;
  
}
