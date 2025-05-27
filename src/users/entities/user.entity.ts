import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true, length: 255 })
  Email: string;

  @Column({ length: 255 })
  Password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedOn: Date;

  @Column({ length: 255 })
  CreatedBy: string;

  @Column({ length: 255 })
  UpdatedBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  UpdatedOn: Date;
}
