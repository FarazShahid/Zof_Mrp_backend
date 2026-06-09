import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productcomponenttype')
export class ProductComponentType {
    @PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
    Id: number;

    @Column({ type: 'varchar', length: 255 })
    Name: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    CreatedBy: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    UpdatedBy: string | null;
}
