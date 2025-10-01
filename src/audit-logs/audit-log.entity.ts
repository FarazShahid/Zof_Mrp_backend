import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('auditlogs')

export class AuditLog {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'int' })
  UserId: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
  user: User;

  @Column({ type: 'varchar', length: 100 })
  Module: string;

  @Column({ type: 'varchar', length: 50 })
  Action: string;

  @Column({ type: 'text', nullable: true })
  Details: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  EntityId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Ip: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Device: string;

  @CreateDateColumn({ type: 'timestamp' })
  CreatedAt: Date;
}
