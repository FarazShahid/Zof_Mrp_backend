import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity('app_rights')
export class AppRights {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    group_by: string;

    @CreateDateColumn({ type: 'timestamp', name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'CreatedBy' })
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamp', name: 'UpdatedOn' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'UpdatedBy' })
    updatedBy: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deletedOn' })
    deletedOn: Date;
}


@Entity('app_roles')
export class AppRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    name: string;

    @CreateDateColumn({ type: 'timestamp', name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'CreatedBy' })
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamp', name: 'UpdatedOn' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'UpdatedBy' })
    updatedBy: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deletedOn' })
    deletedOn: Date;
}

@Entity('app_roles_rights')
export class AppRoleRight {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    roleId: number;

    @Column({ type: 'int' })
    rightId: number;

    @CreateDateColumn({ type: 'timestamp', name: 'CreatedOn' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'CreatedBy' })
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamp', name: 'UpdatedOn' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'UpdatedBy' })
    updatedBy: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deletedOn' })
    deletedOn: Date;

    @ManyToOne(() => AppRole, (role) => role.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roleId' })
    role: AppRole;

    @ManyToOne(() => AppRights, (right) => right.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rightId' })
    right: AppRights;
}