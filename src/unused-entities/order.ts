import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity('ordercategory')
export class OrderCategory {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    CategoryName: string;

    @Column({ type: 'text', nullable: true })
    Description?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}


@Entity('orderdoc')
export class OrderDoc {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    DocumentId: number;

    @Column({ type: 'int' })
    DocumentTypeId: number;

    @Column({ type: 'int' })
    OrderId: number;

    @Column({ type: 'int', nullable: true })
    OrderItemId?: number | null;

    @Column({ type: 'text', nullable: true })
    Description?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}


@Entity('orderevent')
export class OrderEvent {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    EventName: string;

    @Column({ type: 'text', nullable: true })
    Description?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}

@Entity('orderservices')
export class OrderService {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    OrderServiceOptionId: number;

    @Column({ type: 'text', nullable: true })
    QuantityDetail?: string | null;

    @Column({ type: 'text', nullable: true })
    Description?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}

@Entity('orderservicesmedia')
export class OrderServicesMedia {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    OrderServicesId: number;

    @Column({ type: 'int', nullable: true })
    PhotoId?: number | null;

    @Column({ type: 'int', nullable: true })
    FileId?: number | null;

    @Column({ type: 'int', nullable: true })
    VideoId?: number | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}


@Entity('orderservicesoption')
export class OrderServicesOption {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    ServiceName: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}


@Entity('orderserviceunits')
export class OrderServiceUnits {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255 })
    UnitMeasureName: string;

    @Column({ type: 'varchar', length: 255 })
    Name: string;

    @Column({ type: 'int' })
    OrderServiceOptionId: number;

    @ManyToOne(() => OrderServicesOption, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
    @JoinColumn([{ name: 'OrderServiceOptionId', referencedColumnName: 'Id' }])
    OrderServiceOption: OrderServicesOption;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    CostPerUnit: string; // keep as string to preserve precision with decimals

    @Column({ type: 'varchar', length: 10 })
    Currency: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}

@Entity('ordertype')
export class OrderType {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    TypeName: string;

    @Column({ type: 'text', nullable: true })
    Description?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string | null;
}


