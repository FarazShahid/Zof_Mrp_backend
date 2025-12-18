import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 255 })
  Name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Description: string | null;

  @Column({ type: 'int' })
  ClientId: number;

  @ManyToOne(() => Client, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'ClientId', referencedColumnName: 'Id' })
  client: Client;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ type: 'varchar', length: 255 })
  CreatedBy: string;

  @Column({ type: 'varchar', length: 255 })
  UpdatedBy: string;

  @OneToMany(() => Product, product => product.project)
  products: Product[];
}

