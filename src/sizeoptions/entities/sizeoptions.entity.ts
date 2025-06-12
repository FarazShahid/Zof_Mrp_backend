import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sizeoptions')
export class SizeOption {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  OptionSizeOptions: string;

  @Column()
  ProductRegionId: number;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
