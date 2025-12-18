import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProductPrintingOptions } from "./product-printing-options.entity";
import { ProductCategory } from "src/product-category/entities/product-category.entity";
import { FabricType } from "src/fabrictype/_/fabrictype.entity";
import { Project } from "src/projects/entities/project.entity";


@Entity('product')

export class Product {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Name: string | null;

    @Column({ type: 'varchar', length: 255 })
    Description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    productStatus: string | null;

    @Column({ type: 'boolean', default: false })
    isArchived: boolean;

    @Column({ type: 'int', nullable: true })
    ClientId: number | null;

    @ManyToOne(() => Client, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    @JoinColumn([{ name: 'ClientId', referencedColumnName: 'Id' }])
    client: Client | null;

    @Column({ type: 'int', nullable: true })
    ProjectId: number | null;

    @ManyToOne(() => Project, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    @JoinColumn([{ name: 'ProjectId', referencedColumnName: 'Id' }])
    project: Project | null;

    @Column({ type: 'int' })
    ProductCategoryId: number;

    @ManyToOne(() => ProductCategory, { onUpdate: 'CASCADE' })
    @JoinColumn([{ name: 'ProductCategoryId', referencedColumnName: 'Id' }])
    ProductCategory: ProductCategory;

    @Column({ type: 'int' })
    FabricTypeId: number;

    @ManyToOne(() => FabricType)
    @JoinColumn([{ name: 'FabricTypeId', referencedColumnName: 'Id' }])
    fabricType: FabricType;

    @OneToMany(() => ProductPrintingOptions, productPrintingOptions => productPrintingOptions.Product)
    ProductPrintingOptions: ProductPrintingOptions[];

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 255 })
    CreatedBy: string;

    @Column({ type: 'varchar', length: 255 })
    UpdatedBy: string;
}



@Entity({ name: 'productdetails' })

export class Productdetails {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    ProductId: number;

    @Column({ type: 'int', nullable: true })
    ProductCutOptionId: number | null;

    @Column({ type: 'int', nullable: true })
    SleeveTypeId: number | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy: string | null;
}


