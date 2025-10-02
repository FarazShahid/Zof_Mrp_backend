import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AppRole } from 'src/roles-rights/roles.rights.entity';
@Entity({ name: 'users' })

export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  Email: string;

  @Column({ type: 'varchar', length: 255 })
  Password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 100 })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 100 })
  UpdatedBy: string;

  @Column({ type: 'int', nullable: true })
  roleId: number;

  @ManyToOne(() => AppRole, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: AppRole;

  @Column({ type: 'json', nullable: true })
  assignedClients: number[];
}
