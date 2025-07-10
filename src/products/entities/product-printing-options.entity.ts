import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { PrintingOptions } from 'src/printingoptions/entities/printingoptions.entity';

@Entity('productprintingoptions')
export class ProductPrintingOptions {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => Product, product => product.ProductPrintingOptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ProductId' })
  Product: Product;

  @Column()
  ProductId: number;

  @ManyToOne(() => PrintingOptions, printingOption => printingOption.ProductPrintingOptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PrintingOptionId' })
  PrintingOption: PrintingOptions;

  @Column()
  PrintingOptionId: number;
}
