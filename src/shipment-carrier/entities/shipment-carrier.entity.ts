import { Shipment } from 'src/shipment/entities/shipment.entity';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shipmentcarriers')
export class ShipmentCarrier {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 100 })
    Name: string;

    @OneToMany(() => Shipment, shipment => shipment.ShipmentCarrier)
    Shipments: Shipment[];

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    createdBy: string | null;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    updatedBy: string | null;
}