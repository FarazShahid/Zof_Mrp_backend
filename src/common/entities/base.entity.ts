import { CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  CreatedBy: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  UpdatedBy: string | null;
}   