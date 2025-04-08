import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizemeasurements')
export class SizeMeasurement {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'decimal', nullable: false, default: 1})
  SizeOptionId: number;

  @Column({ type: 'decimal', nullable: true, default: null})
  ClientId: number;

  @Column({ length: 255, nullable: true })
  Measurement1: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  FrontLengthHPS: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BackLengthHPS: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  AcrossShoulders: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ArmHole: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  UpperChest: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  LowerChest: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Waist: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  SleeveLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  SleeveOpening: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  NeckSize: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  CollarHeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  CollarPointHeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  StandHeightBack: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  CollarStandLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  SideVentFront: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  SideVentBack: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  PlacketLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  TwoButtonDistance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  PlacketWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomHem: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ length: 100, nullable: true })
  CreatedBy: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  UpdatedOn: Date;

  @Column({ length: 100, nullable: true })
  UpdatedBy: string;
} 