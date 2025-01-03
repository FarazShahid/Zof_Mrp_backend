import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productcutoptions')
export class ProductCutOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OptionProductCutOptions: string;

  @Column()
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @Column()
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
