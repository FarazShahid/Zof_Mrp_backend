import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clientevent')
export class ClientEvent {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  EventName: string;

  @Column({ type: 'varchar', length: 255 })
  Description: string;

  @Column({ type: 'int', nullable: true, default: null })
  ClientId: number | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 255 })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 255 })
  UpdatedBy: string;

}
