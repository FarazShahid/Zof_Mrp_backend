import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "src/orders/entities/order-item.entity";
import { Shipment } from "./shipment.entity";

@Entity('ShipmentBox')
export class ShipmentBox {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ShipmentId: number;

    @ManyToOne(() => Shipment, shipment => shipment.Boxes)
    @JoinColumn({ name: 'ShipmentId' })
    Shipment: Shipment;

    @Column({ type: 'float' })
    Weight: number;

    @Column({ type: 'varchar' })
    BoxNumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    OrderItemName: string;

    @OneToMany(() => ShipmentBoxItem, (boxItem) => boxItem.ShipmentBox, {
        cascade: true,
    })
    ShipmentBoxItems: ShipmentBoxItem[];
}

@Entity("ShipmentBoxItem")
export class ShipmentBoxItem {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => ShipmentBox, box => box.ShipmentBoxItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ShipmentBoxId' })
  ShipmentBox: ShipmentBox;

  @Column()
  OrderItemId: number;

  @ManyToOne(() => OrderItem, orderItem => orderItem.ShipmentBoxItems)
  @JoinColumn({ name: 'OrderItemId' })
  OrderItem: OrderItem;

  @Column({ type: "varchar", nullable: true })
  OrderItemDescription: string;

  @Column({ type: "int", default: 1 })
  Quantity: number;
}
