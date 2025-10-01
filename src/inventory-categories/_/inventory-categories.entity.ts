import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('inventorycategories')
export class InventoryCategories {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string | null;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  DeletedAt: Date;
}