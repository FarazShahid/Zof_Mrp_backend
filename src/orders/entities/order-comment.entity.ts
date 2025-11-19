import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './orders.entity';

@Entity('ordercomments')
export class OrderComment {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  OrderId: number;

  @ManyToOne(() => Order, order => order.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'OrderId' })
  Order: Order;

  @Column({ type: 'text' })
  Comment: string;

  @Column({ type: 'varchar', length: 255 })
  CreatedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  UpdatedBy: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;
}


