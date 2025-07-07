import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('inventorysubcategories')
export class InventorySubCategories {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ length: 100 })
  Name: string;

  @Column()
  CategoryId: number;

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
