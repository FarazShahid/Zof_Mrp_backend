import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('InventorySuppliers')
export class InventorySuppliers {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ length: 100 })
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

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column({ length: 100 })
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column({ length: 100, nullable: true })
  UpdatedBy: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  DeletedAt: Date;
}