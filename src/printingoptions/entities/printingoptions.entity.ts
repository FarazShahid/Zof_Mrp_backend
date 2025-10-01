import { ProductPrintingOptions } from 'src/products/entities/product-printing-options.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('printingoptions')
export class PrintingOptions {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  Type: string;

  @OneToMany(() => ProductPrintingOptions, ppo => ppo.PrintingOption)
  ProductPrintingOptions: ProductPrintingOptions[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  CreatedBy: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  UpdatedBy: string | null;
}
