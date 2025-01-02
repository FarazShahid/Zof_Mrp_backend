import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orderitemprintingoptions')
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
