import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fabrictype')
export class FabricType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  type: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  gsm: number;

  @Column({default: null})
  CategoryId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdOn: Date;

  @Column({ length: 100 })
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedOn: Date;

  @Column({ length: 100, nullable: true })
  updatedBy: string;
}
