import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Product } from './product.entity';
import { PrintingOptions } from 'src/printingoptions/entities/printingoptions.entity';


@Entity('productprintingoptions')

export class ProductPrintingOptions {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  ProductId: number;

  @ManyToOne(() => Product, product => product.ProductPrintingOptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ProductId' })
  Product: Product;

  @Column({ type: 'int' })
  PrintingOptionId: number;

  @ManyToOne(() => PrintingOptions, printingOptions => printingOptions.ProductPrintingOptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PrintingOptionId' })
  PrintingOption: PrintingOptions;

}
