import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('client')
export class Client {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Name: string;

    @Column()
    Email: string;

    @Column()
    Phone: string;

    @Column()
    Country: string;

    @Column()
    State: string;

    @Column()
    City: string;

    @Column()
    CompleteAddress: string;

    @Column()
    ClientStatusId: string;

    @Column()
    CreatedOn: string;

    @Column()
    CreatedBy: string;
    
    @Column({ nullable: true })
    UpdatedOn: string;

    @Column({ nullable: true })
    UpdatedBy: string;
}