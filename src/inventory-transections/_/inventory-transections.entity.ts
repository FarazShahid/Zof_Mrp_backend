import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

@Entity('InventoryTransactions')
export class InventoryTransactions {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    InventoryItemId: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    Quantity: number;

    @Column({ length: 10 })
    TransactionType: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    TransactionDate: Date;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ length: 100, nullable: true })
    CreatedBy: string;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ length: 100, nullable: true })
    UpdatedBy: string;

    @DeleteDateColumn({ type: 'datetime', nullable: true })
    DeletedAt: Date;
}