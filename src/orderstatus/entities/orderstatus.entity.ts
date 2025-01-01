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
  CreatedBy: string; // User ID of the creator

  @Column()
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string; // User ID of the last updater
}
