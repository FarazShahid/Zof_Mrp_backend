import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('docstatus')
export class DocStatus {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    Status: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}


@Entity('doctype')
export class DocType {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    Type: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}