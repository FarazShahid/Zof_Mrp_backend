import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    ProductCategoryId: number;

    @Column()
    FabricTypeId: number;

    @Column()
    Name: string;

    @Column()
    Description: string;

    @Column()
    CreatedOn: Date;

    @Column()
    CreatedBy: string;

    @Column()
    UpdatedOn: Date;

    @Column()
    UpdatedBy: string;
}
