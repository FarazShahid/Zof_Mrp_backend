import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity('product')
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

    @CreateDateColumn({ type: 'timestamp' })
    CreatedOn: Date;

    @Column()
    CreatedBy: string;

    @UpdateDateColumn({ type: 'timestamp' })
    UpdatedOn: Date;

    @Column()
    UpdatedBy: string;
}
