import { Order } from "src/orders/entities/orders.entity";
import { ShipmentCarrier } from "src/shipment-carrier/entities/shipment-carrier.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShipmentBox } from "./shippment-box.entity";
import { ShipmentDetail } from "./shipment-details";

export enum ShipmentStatus {
    Pending = 'Pending',
    InTransit = 'In Transit',
    Delivered = 'Delivered',
    Received = 'Received',
    Cancelled = 'Cancelled',
}


@Entity('Shipment')
export class Shipment {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ShipmentCode: string;

    @Column()
    OrderId: number;

    @ManyToOne(() => Order, order => order.Shipments)
    @JoinColumn({ name: 'OrderId' })
    Order: Order;

    @Column()
    ShipmentCarrierId: number;

    @ManyToOne(() => ShipmentCarrier, carrier => carrier.Shipments)
    @JoinColumn({ name: 'ShipmentCarrierId' })
    ShipmentCarrier: ShipmentCarrier;

    @Column({ type: 'timestamp' })
    ShipmentDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    ShipmentCost: number;

    @Column({ type: 'float' })
    TotalWeight: number;

    @Column()
    NumberOfBoxes: number;

    @Column()
    WeightUnit: string;

    @Column({ type: 'timestamp', nullable: true })
    ReceivedTime?: Date;

    @Column({ type: 'enum', enum: ShipmentStatus })
    Status: ShipmentStatus;

    @OneToMany(() => ShipmentDetail, detail => detail.Shipment, { cascade: true })
    ShipmentDetails: ShipmentDetail[];

    @OneToMany(() => ShipmentBox, box => box.Shipment, { cascade: true })
    Boxes: ShipmentBox[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column()
    CreatedBy: string;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column()
    UpdatedBy: string;

}
