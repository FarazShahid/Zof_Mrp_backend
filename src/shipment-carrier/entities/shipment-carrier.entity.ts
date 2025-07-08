import { Shipment } from 'src/shipment/entities/shipment.entity';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ShipmentCarriers')
export class ShipmentCarrier {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 100 })
    Name: string;

    //New Column
    @OneToMany(() => Shipment, shipment => shipment.ShipmentCarrier)
    Shipments: Shipment[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column()
    CreatedBy: string;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column()
    UpdatedBy: string;
}