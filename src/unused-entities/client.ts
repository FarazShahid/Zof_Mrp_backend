import { Client } from "src/clients/entities/client.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('clientstatus')
export class ClientStatus {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    StatusName: string;

    @Column({ type: 'text', nullable: true })
    Description?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}



@Entity('clientassociates')
export class ClientAssociate {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    ClientId: number;

    @ManyToOne(() => Client, { onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'ClientId', referencedColumnName: 'Id' }])
    client: Client;

    @Column({ type: 'varchar', length: 255 })
    Email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    Name?: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    Phone?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    Country?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    State?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    City?: string | null;

    @Column({ type: 'text', nullable: true })
    CompleteAddress?: string | null;

    @Column({ type: 'int' })
    StatusId: number;

    @ManyToOne(() => ClientStatus, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn([{ name: 'StatusId', referencedColumnName: 'Id' }])
    status: ClientStatus;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}