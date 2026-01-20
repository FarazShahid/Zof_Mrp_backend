import { ShipmentCarrier } from "src/shipment-carrier/entities/shipment-carrier.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShipmentBox } from "./shipment-box.entity";
import { ShipmentOrder } from "./shipment-order.entity";

export enum ShipmentStatus {
    IN_TRANSIT = "In Transit",
    DAMAGED = "Damaged",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled",
    DISPATCHED = "Dispatched"
}

@Entity('shipment')
export class Shipment {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255 })
    ShipmentCode: string;

    @Column({ type: 'varchar', length: 255, default: () => "'TEMP_TRACKING'" })
    TrackingId: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    OrderNumber: string;

    @OneToMany(() => ShipmentOrder, so => so.Shipment, { cascade: true })
    ShipmentOrders: ShipmentOrder[];

    @Column({ type: 'int' })
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

    @Column({ type: 'int' })
    NumberOfBoxes: number;

    @Column({ type: 'varchar', length: 255 })
    WeightUnit: string;

    @Column({ type: 'timestamp', nullable: true, default: null })
    ReceivedTime?: Date;

    @Column({ type: 'enum', enum: ShipmentStatus })
    Status: ShipmentStatus;

    @OneToMany(() => ShipmentBox, box => box.shipment, { cascade: true })
    Boxes: ShipmentBox[];

    @CreateDateColumn({ type: 'timestamp' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 255 })
    CreatedBy: string;

    @UpdateDateColumn({ type: 'timestamp' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 255 })
    UpdatedBy: string;

}
