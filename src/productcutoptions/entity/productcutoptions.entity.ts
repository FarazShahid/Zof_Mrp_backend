import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('productcutoptions')
export class ProductCutOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OptionProductCutOptions: string;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
