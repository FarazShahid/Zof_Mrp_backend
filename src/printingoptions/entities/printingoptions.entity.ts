import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('printingoptions')
export class PrintingOptions {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Type: string;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
