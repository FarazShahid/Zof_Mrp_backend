import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientevent')
export class ClientEvent {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  EventName: string;

  @Column()
  Description: string;

  @Column()
  CreatedBy: number;

  @Column()
  CreatedOn: string;

  @Column()
  UpdatedBy: number;

  @Column()
  UpdatedOn: string;
}
