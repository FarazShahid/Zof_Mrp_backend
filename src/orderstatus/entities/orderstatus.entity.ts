import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orderstatus')
export class OrderStatus {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  StatusName: string;

  @Column()
  Description: string;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
