import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity('inventorysubcategories')
export class InventorySubCategories {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'int' })
  CategoryId: number;

  @ManyToOne(() => InventoryCategories, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'CategoryId', referencedColumnName: 'Id' }])
  category: InventoryCategories;

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
