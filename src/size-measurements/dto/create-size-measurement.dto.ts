  import { IsString, IsNumber, IsOptional, Min, Max, IsNotEmpty  } from 'class-validator';
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
} 