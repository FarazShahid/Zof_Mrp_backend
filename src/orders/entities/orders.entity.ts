import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Client } from '../../clients/entities/client.entity';
import { ClientEvent } from '../../events/entities/clientevent.entity';
import { OrderStatus } from '../../orderstatus/entities/orderstatus.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusLogs } from './order-status-log';

@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  ClientId: number;

  @Column({ nullable: true })
  OrderEventId: number;

  @Column({ nullable: true })
  Description: string;

  @Column({ default: 1 })
  OrderStatusId: number;

  @Column({ type: 'int', nullable: true })
  OrderPriority: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Deadline: Date;

  @Column({ nullable: true })
  OrderNumber: string;

  @Column({ nullable: true })
  OrderName: string;

  @Column()
  ExternalOrderId: string;

  // Relations
  @ManyToOne(() => Client)
  @JoinColumn({ name: 'ClientId' })
  client: Client;

  @ManyToOne(() => ClientEvent)
  @JoinColumn({ name: 'OrderEventId' })
  event: ClientEvent;

  @ManyToOne(() => OrderStatus)
  @JoinColumn({ name: 'OrderStatusId' })
  status: OrderStatus;

  @OneToMany(() => OrderStatusLogs, log => log.Order)
  StatusLogs: OrderStatusLogs[];

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  //New Column
  // @OneToMany(() => Shipment, shipment => shipment.Order)
  // Shipments: Shipment[];
}
