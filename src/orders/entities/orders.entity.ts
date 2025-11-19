import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Client } from '../../clients/entities/client.entity';
import { ClientEvent } from '../../events/entities/clientevent.entity';
import { OrderStatus } from '../../orderstatus/entities/orderstatus.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusLogs } from './order-status-log.entity';
import { ShipmentOrder } from 'src/shipment/entities/shipment-order.entity';
import { OrderComment } from './order-comment.entity';

enum OrderItemShipmentEnum {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  PARTIALLY_SHIPPED = 'Partially Shipped',
}

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'int' })
  ClientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'ClientId' })
  client: Client;

  @Column({ type: 'int', nullable: true })
  OrderEventId: number;

  @ManyToOne(() => ClientEvent)
  @JoinColumn({ name: 'OrderEventId' })
  event: ClientEvent;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Description: string;

  @Column({ type: 'int', default: 1 })
  OrderStatusId: number;

  @ManyToOne(() => OrderStatus)
  @JoinColumn({ name: 'OrderStatusId' })
  status: OrderStatus;

  @Column({ type: 'int', nullable: true })
  OrderPriority: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Deadline: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  OrderNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  OrderName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ExternalOrderId: string;

  // Relations

  @Column({ type: 'enum', enum: OrderItemShipmentEnum, default: OrderItemShipmentEnum.PENDING })
  OrderShipmentStatus: OrderItemShipmentEnum;

  @OneToMany(() => OrderStatusLogs, log => log.Order)
  StatusLogs: OrderStatusLogs[];

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => ShipmentOrder, so => so.Order)
  ShipmentOrders: ShipmentOrder[];

  @OneToMany(() => OrderComment, comment => comment.Order)
  comments: OrderComment[];
}
