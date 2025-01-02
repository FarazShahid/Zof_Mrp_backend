import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('printingoptions')
export class PrintingOptions {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Type: string;

  @Column()
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @Column()
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
