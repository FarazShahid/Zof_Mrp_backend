import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('client')
export class Client {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ length: 255 })
    Name: string;

    @Column({ length: 255 })
    Email: string;

    @Column({ length: 255 })
    Phone: string;

    @Column({ length: 255 })
    Country: string;

    @Column({ length: 255 })
    State: string;

    @Column({ length: 255 })
    City: string;

    @Column({ length: 255 })
    CompleteAddress: string;

    @Column()
    ClientStatusId: number;

    @CreateDateColumn({ type: 'timestamp' })
    CreatedOn: string;

    @Column({ length: 255, nullable: true })
    CreatedBy: string;
    
    @UpdateDateColumn({ type: 'timestamp' })
    UpdatedOn: string;

    @Column({ length: 100, nullable: true })
    UpdatedBy: string;
}