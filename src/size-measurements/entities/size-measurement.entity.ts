import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizemeasurements')
export class SizeMeasurement {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'decimal', nullable: false, default: 1 })
  SizeOptionId: number;

  @Column({ type: 'decimal', nullable: true, default: null })
  ClientId: number;

  @Column({ type: 'decimal', nullable: true, default: null })
  CutOptionId: number;

  @Column({ type: 'int', nullable: true, default: null })
  ProductCategoryId: number;

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
  BackNeckDrop: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  FrontNeckDrop: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ShoulderSeam: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ShoulderSlope: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Hem: number;

  // new fields for top measurements
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Neckwidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  CollarOpening: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ArmHoleStraight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomRib: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  CuffHeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ColllarHeightCenterBack: number;


  //bottom measurements
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomHem: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Inseam: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Hip: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  FrontRise: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  LegOpening: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  KneeWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Outseam: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bFrontRise: number;

  // new fields for bottom unit

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  WasitStretch: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  WasitRelax: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  Thigh: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BackRise: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  TotalLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  WBHeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bBottomWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomOriginal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomElastic: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomCuffZipped: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  BottomStraightZipped: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  HemBottom: number;

  // Logo Placement
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_TopRight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_TopLeft: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_BottomRight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_BottomLeft: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_Center: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_Back: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  b_TopRight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  b_TopLeft: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  b_BottomRight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  b_BottomLeft: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_left_sleeve: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  t_right_sleeve: number;

  // Hat / Cap Measurement Columns
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_VisorLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_VisorWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_CrownCircumference: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_FrontSeamLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_BackSeamLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_RightCenterSeamLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_LeftCenterSeamLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_ClosureHeightIncludingStrapWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_StrapWidth: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_StrapbackLength: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_SweatBandWidth: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  H_FusionInside: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_PatchSize: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  H_PatchPlacement: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreatedOn: Date;

  @Column({ length: 100, nullable: true })
  CreatedBy: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  UpdatedOn: Date;

  @Column({ length: 100, nullable: true })
  UpdatedBy: string;
}
