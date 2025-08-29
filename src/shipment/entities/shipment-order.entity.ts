// Junction Table
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Shipment } from './shipment.entity';
import { Order } from 'src/orders/entities/orders.entity';

@Entity('shipmentOrders')
export class ShipmentOrder {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int', nullable: false })
    ShipmentId: number;

    @ManyToOne(() => Shipment, s => s.ShipmentOrders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ShipmentId' })
    Shipment: Shipment;

    @Column({ type: 'int', nullable: false })
    OrderId: number;

    @ManyToOne(() => Order, o => o.ShipmentOrders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'OrderId' })
    Order: Order;
}
