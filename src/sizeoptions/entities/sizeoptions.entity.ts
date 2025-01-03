import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizeoptions')
export class SizeOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OptionSizeOptions : string;

  @Column()
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @Column()
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
