import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shipment } from "./shipment.entity";
import { OrderItem } from "src/orders/entities/order-item.entity";

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

    @Column()
    Quantity: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    OrderItemName: string;

    @Column({ type: 'int', nullable: true })
    OrderItemId: number;

    @ManyToOne(() => OrderItem, orderItem => orderItem.Boxes, { cascade: true })
    @JoinColumn({ name: "OrderItemId" })
    OrderItem: OrderItem;

    @Column()
    OrderItemDescription: string
}
