import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orderitemsprintingoptions')
export class OrderItemsPrintingOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OrderItemId: number;

  @Column()
  PrintingOptionId: number;

  @Column({ nullable: true })
  Description: string;
}
