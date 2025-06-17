import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('availblesizeoptions')
export class AvailbleSizeOptions {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    sizeId: number;

    @Column()
    ProductId: number;
}