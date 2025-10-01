import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'users' })

export class User {
  @PrimaryGeneratedColumn()
  Id: number;

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

}
