import { IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orderitems')
export class OrderItem {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OrderId: number;

  @Column()
  ProductId: number;

  @Column({ nullable: true })
  Description: string;

  @Column({ nullable: true })
  ImageId: number;

  @Column({ nullable: true })
  FileId: number;

  @Column({ nullable: true })
  VideoId: number;

  @Column()
  CreatedOn: Date;

  @Column()
  CreatedBy: number;

  @Column()
  UpdatedOn: Date;

  @Column()
  UpdatedBy: number;

  @Column({ type: 'int', default: 0 })
  OrderItemPriority: number;

  @Column({ type: 'int', default: 0 })
  OrderItemQuantity: number;
}
