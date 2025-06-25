import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./orders.entity";
import { OrderStatus } from "src/orderstatus/entities/orderstatus.entity";

@Entity('orderstatuslogs')
export class OrderStatusLogs {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int', nullable: false })
    OrderId: number;

    @ManyToOne(() => Order, order => order.StatusLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'OrderId' })
    Order: Order;

    @Column({ type: 'int', nullable: false })
    StatusId: number;

    @ManyToOne(() => OrderStatus)
    @JoinColumn({ name: 'StatusId' })
    Status: OrderStatus;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

}