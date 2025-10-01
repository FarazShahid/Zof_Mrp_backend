import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('availblesizeoptions')
export class AvailbleSizeOptions {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    sizeId: number;

    @Column({ type: 'int' })
    ProductId: number;
}