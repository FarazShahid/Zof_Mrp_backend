import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ClientId: number;

  @Column()
  OrderEventId: number;

  @Column({ nullable: true })
  Description: string;

  @Column()
  OrderStatusId: number;

  @Column({ type: 'timestamp',  default: () => 'CURRENT_TIMESTAMP' })
  Deadline: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column()
  CreatedBy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: number;

  @Column('json', { nullable: true })
  items: any[];
}
