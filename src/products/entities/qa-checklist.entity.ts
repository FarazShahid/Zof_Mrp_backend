import { Entity, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('qachecklist')
export class QAChecklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column()
  productId: number;

  @JoinColumn({ name: 'productId' })
  product: Product;
}
