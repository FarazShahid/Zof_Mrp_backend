import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateSizeMeasurementDto {
  @CommonApiProperty('Client Id', '1')
  @IsOptional()
  ClientId?: number;

  @CommonApiProperty('Cut Option Id', '1')
  @IsOptional()
  CutOptionId?: number;

  @CommonApiProperty('Size Option Id', '1')
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  SizeOptionId: number;

  @CommonApiProperty('Measurmen1', '1A')
  @IsString()
  @IsOptional()
  Measurement1?: string;

  @CommonApiProperty('Product Category Id', 1)
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  ProductCategoryId: number;

  @CommonApiProperty('Front Length HPS', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  FrontLengthHPS?: number;

  @CommonApiProperty('Back Length HPS', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BackLengthHPS?: number;

  @CommonApiProperty('Across Shoulders', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  AcrossShoulders?: number;

  @CommonApiProperty('Arm Hole', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  ArmHole?: number;

  @CommonApiProperty('Upper Chest', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  UpperChest?: number;

  @CommonApiProperty('Lower Chest', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  LowerChest?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Waist?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomWidth?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SleeveLength?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SleeveOpening?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  NeckSize?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarHeight?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarPointHeight?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  StandHeightBack?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarStandLength?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SideVentFront?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SideVentBack?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  PlacketLength?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  TwoButtonDistance?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  PlacketWidth?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomHem?: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BackNeckDrop: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  FrontNeckDrop: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  ShoulderSeam: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  ShoulderSlope: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Hem: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Inseam: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Hip: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  FrontRise: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  LegOpening: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  KneeWidth: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Outseam: number;

  @CommonApiProperty('', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  bFrontRise: number;

  // new fields
  @CommonApiProperty('Neck Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Neckwidth?: number;

  @CommonApiProperty('Collar Opening', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarOpening?: number;

  @CommonApiProperty('Collar Opening', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  ColllarHeightCenterBack?: number;

  @CommonApiProperty('Cuff Height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CuffHeight?: number;

  @CommonApiProperty('Arm Hole Straight', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  ArmHoleStraight?: number;

  @CommonApiProperty('Bottom Rib', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomRib?: number;

  @CommonApiProperty('Wasit Stretch', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  WasitStretch?: number;

  @CommonApiProperty('Wasit Relax', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  WasitRelax?: number;

  @CommonApiProperty('Wasit Relax', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Thigh?: number;

  @CommonApiProperty('Back Rise', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BackRise?: number;

  @CommonApiProperty('Total Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  TotalLength?: number;

  @CommonApiProperty('WB Height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  WBHeight?: number;

  @CommonApiProperty('Bottom Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  bBottomWidth?: number;

  @CommonApiProperty('Bottom Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomOriginal?: number;

  @CommonApiProperty('Bottom Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomElastic?: number;

  @CommonApiProperty('Bottom Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomCuffZipped?: number;

  @CommonApiProperty('Bottom Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomStraightZipped?: number;

@CommonApiProperty('Hem Bottom', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  HemBottom?: number;

  // end new fields

  @CommonApiProperty('Top Unit, Top Right Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_TopRight?: number;

  @CommonApiProperty('Top Unit, Top Left Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_TopLeft?: number;

  @CommonApiProperty('Top Unit, Bottom Right Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_BottomRight?: number;

  @CommonApiProperty('Top Unit, Bottom Left Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_BottomLeft?: number;

  @CommonApiProperty('Top Unit, Center Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_Center?: number;

  @CommonApiProperty('Top Unit, Back Logo Position', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_Back?: number;

  @CommonApiProperty('Bottom Unit, Top Right Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  b_TopRight?: number;

  @CommonApiProperty('Bottom Unit, Top Left Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  b_TopLeft?: number;

  @CommonApiProperty('Bottom Unit, Bottom Right Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  b_BottomRight?: number;

  @CommonApiProperty('Bottom Unit, Bottom Left Logo size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  b_BottomLeft?: number;
}
