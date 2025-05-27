import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clientevent')
export class ClientEvent {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  EventName: string;

  @Column()
  Description: string;

  @Column({default: null})
  ClientId: number | null;

  @Column()
  CreatedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column()
  UpdatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;
}
