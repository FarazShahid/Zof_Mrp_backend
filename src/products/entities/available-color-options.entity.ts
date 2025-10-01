import { ColorOption } from "src/coloroption/_/color-option.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('availablecoloroptions')

export class AvailableColorOption {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ type: 'int' })
    colorId: number;

    @ManyToOne(() => ColorOption, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn([{ name: 'colorId', referencedColumnName: 'Id' }])
    coloroption: ColorOption;

    @Column({ type: 'int' })
    ProductId: number;

    @Column({ type: 'int', nullable: true })
    ImageId?: number | null;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    CreatedBy?: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    UpdatedOn: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    UpdatedBy?: string;

}