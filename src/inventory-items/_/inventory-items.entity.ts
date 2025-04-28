import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('InventoryItems')
export class InventoryItems {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ length: 200 })
  Name: string;

  @Column({ length: 20, unique: true })
  ItemCode: string;

  @Column()
  SubCategoryId: number;

  @Column()
  UnitOfMeasureId: number;

  @Column()
  SupplierId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ReorderLevel: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  Stock: number;

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
