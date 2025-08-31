import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProductPrintingOptions } from "./product-printing-options.entity";
import { ProductCategory } from "src/product-category/entities/product-category.entity";
import { FabricType } from "src/fabrictype/_/fabrictype.entity";

@Entity('product')
export class Product {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Name: string;

    @ManyToOne(() => Client, client => client.Products)
    @JoinColumn({ name: 'ClientId' })
    Client: Client;

    @Column()
    ClientId: number;

    @OneToMany(() => ProductPrintingOptions, ppo => ppo.Product)
    ProductPrintingOptions: ProductPrintingOptions[];

    @Column({ name: 'ProductCategoryId', type: 'int' })
    ProductCategoryId: number;

    @ManyToOne(() => ProductCategory, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'ProductCategoryId' })
    ProductCategory: ProductCategory;

    @Column()
    isArchived: boolean;
    
    @Column()
    FabricTypeId: number;

    @ManyToOne(() => FabricType)
    @JoinColumn({ name: 'FabricTypeId' })
    fabricType: FabricType;


    @Column()
    productStatus: string;

    @Column()
    Description: string;

    @CreateDateColumn({ type: 'timestamp' })
    CreatedOn: Date;

    @Column()
    CreatedBy: string;

    @UpdateDateColumn({ type: 'timestamp' })
    UpdatedOn: Date;

    @Column()
    UpdatedBy: string;
}
