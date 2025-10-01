import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('inventorysuppliers')
export class InventorySuppliers {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  Name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Country: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  State: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  City: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  CompleteAddress: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CreatedBy: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  UpdatedBy: string | null;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  DeletedAt: Date | null;
}