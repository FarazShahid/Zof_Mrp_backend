import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateSizeMeasurementDto {
  @IsString()
  @IsOptional()
  Measurement1?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  FrontLengthHPS?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BackLengthHPS?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  AcrossShoulders?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  ArmHole?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  UpperChest?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  LowerChest?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Waist?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomWidth?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SleeveLength?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SleeveOpening?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  NeckSize?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarHeight?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarPointHeight?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  StandHeightBack?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  CollarStandLength?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SideVentFront?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  SideVentBack?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  PlacketLength?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  TwoButtonDistance?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  PlacketWidth?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  BottomHem?: number;
} 