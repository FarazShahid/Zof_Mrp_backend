import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./orders.entity";
import { OrderStatus } from "src/orderstatus/entities/orderstatus.entity";


@Entity('orderstatuslogs')

export class OrderStatusLogs {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    OrderId: number;

    @ManyToOne(() => Order, order => order.StatusLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'OrderId' })
    Order: Order;

    @Column({ type: 'int' })
    StatusId: number;

    @ManyToOne(() => OrderStatus)
    @JoinColumn({ name: 'StatusId' })
    Status: OrderStatus;

    @CreateDateColumn({ type: 'timestamp' })
    CreatedOn: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    UpdatedOn: Date;

}