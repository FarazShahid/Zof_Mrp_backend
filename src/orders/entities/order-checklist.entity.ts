import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('orderqualitycheck')
export class OrderQualityCheck {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    orderId: number;

    @Column({ type: 'int', nullable: true })
    productId: number | null;

    @Column({ type: 'int', nullable: true })
    measurementId: number | null;

    @Column({ type: 'text', nullable: true })
    parameter: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    expected: string | null;

    @Column({ type: 'varchar', length: 255 })
    observed: string;

    @Column({ type: 'text', nullable: true })
    remarks: string | null;

    @Column({ type: 'varchar', length: 255 })
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdOn: Date;
}
