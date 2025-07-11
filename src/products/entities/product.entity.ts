import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProductPrintingOptions } from "./product-printing-options.entity";

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
    
    @Column()
    ProductCategoryId: number;

    @Column()
    isArchived: boolean;

    @Column()
    FabricTypeId: number;

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
