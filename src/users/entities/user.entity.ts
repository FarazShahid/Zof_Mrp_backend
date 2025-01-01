import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true })
  Email: string;

  @Column()
  Password: string;

  @Column()
  CreatedOn: string;

  @Column({ default: true })
  isActive: boolean;
}
