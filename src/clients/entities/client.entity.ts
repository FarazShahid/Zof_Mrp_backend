import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, JoinColumn, ManyToOne } from "typeorm";

@Entity('client')
export class Client {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255 })
    Name: string;

    @Column({ type: 'varchar', length: 255 })
    Email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Phone?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Country?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    State?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    City?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    CompleteAddress?: string | null;

    @Column({ type: 'varchar', length: 255 })
    ClientStatusId?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    POCName?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    POCEmail?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Website?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Linkedin?: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Instagram?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;

}

