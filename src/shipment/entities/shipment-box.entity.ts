import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column()
    BoxNumber: number;

    @Column()
    Quantity: string;

    @Column()
    OrderItem: string;

    @Column()
    OrderItemDescription: string
}
