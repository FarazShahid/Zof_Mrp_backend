import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('ProductPrintingOptions')
export class ProductPrintingOptions {

    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => Product, product => product.PrintingOptions)
    @JoinColumn({ name: 'ProductId' })
    Product: Product;

    @Column()
    ProductId: number;
}