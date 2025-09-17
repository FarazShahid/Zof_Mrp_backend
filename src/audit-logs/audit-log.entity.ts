import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('auditlogs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 100 })
  module: string;

  @Column({ length: 50 })
  action: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ length: 100, nullable: true })
  ip: string;

  @Column({ length: 255, nullable: true })
  device: string;

  @CreateDateColumn()
  createdAt: Date;
}
