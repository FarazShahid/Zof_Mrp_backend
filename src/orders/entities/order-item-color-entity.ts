import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';  // Assuming you have an OrderItem entity

@Entity('orderitemcolors')
export class OrderItemColor {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ProductId: number;

  @Column()
  OrderItemId: number;

  @Column()
  ColorOptionId: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column()
  CreatedBy: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: number;
}
