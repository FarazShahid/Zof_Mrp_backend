import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orderstatus')
export class OrderStatus {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  StatusName: string;

  @Column()
  Description: string;

  @Column()
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @Column()
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
