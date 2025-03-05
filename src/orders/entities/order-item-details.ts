import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orderitemdetails')
export class OrderItemDetails {
  @PrimaryGeneratedColumn()
  Id: number;

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
