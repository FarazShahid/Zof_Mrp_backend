import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('orderitemcolors')
export class OrderItemColor {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ProductId: number;

  @Column()
  OrderName: number;

  @Column()
  OrderNumber: number;

  @Column()
  ExternalOrderId: number;

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
