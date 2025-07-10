import { ProductPrintingOptions } from 'src/products/entities/product-printing-options.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('printingoptions')
export class PrintingOptions {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Type: string;

  @OneToMany(() => ProductPrintingOptions, ppo => ppo.PrintingOption)
  ProductPrintingOptions: ProductPrintingOptions[];

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column()
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column()
  UpdatedBy: string;
}
