import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, Index, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('qachecklist')

export class QAChecklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn([{ name: 'productId' }])
  product: Product;
}
