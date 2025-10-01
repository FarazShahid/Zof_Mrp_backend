import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "src/orders/entities/order-item.entity";
import { Shipment } from "./shipment.entity";

@Entity('shipmentbox')

export class ShipmentBox {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  ShipmentId: number;

  @ManyToOne(() => Shipment, shipment => shipment.Boxes, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'ShipmentId' }])
  shipment: Shipment;

  @Column({ type: 'text', nullable: true })
  OrderBoxDescription: string;

  @Column({ type: 'float' })
  Weight: number;

  @Column({ type: 'varchar', length: 100 })
  BoxNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  OrderItemName: string;

  @OneToMany(() => ShipmentBoxItem, (boxItem) => boxItem.ShipmentBox, { cascade: true })
  ShipmentBoxItems: ShipmentBoxItem[];
}

@Entity("shipmentboxitem")

export class ShipmentBoxItem {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  ShipmentBoxId: number;

  @ManyToOne(() => ShipmentBox, box => box.ShipmentBoxItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ShipmentBoxId' })
  ShipmentBox: ShipmentBox;

  @Column({ type: 'int' })
  OrderItemId: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.ShipmentBoxItems)
  @JoinColumn({ name: 'OrderItemId' })
  OrderItem: OrderItem;

  @Column({ type: "varchar", length: 255, nullable: true })
  OrderItemDescription: string;

  @Column({ type: "int", default: 1 })
  Quantity: number;
}
