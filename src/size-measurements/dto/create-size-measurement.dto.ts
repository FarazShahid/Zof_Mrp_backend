import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export enum HatFusion {
  YES = 'Yes',
  NO = 'No'
}

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

  @CommonApiProperty('Top Unit, Left Sleeve Logo Size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_left_sleeve: number;

  @CommonApiProperty('Top Unit, Right Sleeve Logo Size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  t_right_sleeve: number

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

  //Hat / Cap Measurement Columns
  @CommonApiProperty('Hat, Visor Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_VisorLength: number;

  @CommonApiProperty('Hat, Visor Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_VisorWidth: number;

  @CommonApiProperty('Hat, Crown Circumference', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_CrownCircumference: number;

  @CommonApiProperty('Hat, Front Seam Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_FrontSeamLength: number;

  @CommonApiProperty('Hat, Back Seam Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_BackSeamLength: number;

  @CommonApiProperty('Hat, Right Center Seam Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_RightCenterSeamLength: number;

  @CommonApiProperty('Hat, Left Center Seam Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_LeftCenterSeamLength: number;

  @CommonApiProperty('Hat, Closure Height Including Strap Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_ClosureHeightIncludingStrapWidth: number;

  @CommonApiProperty('Hat, Strap Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_StrapWidth: number;

  @CommonApiProperty('Hat, Strapback Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_StrapbackLength: number;

  @CommonApiProperty('Hat, Sweat Band Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_SweatBandWidth: number;

  @CommonApiProperty('Hat, Fusion Inside', 'Yes')
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return false;
    // Handle string values (case-insensitive)
    if (typeof value === 'string') {
      return value.toLowerCase() === 'yes' || value === HatFusion.YES;
    }
    // Handle boolean
    if (typeof value === 'boolean') {
      return value;
    }
    // Handle enum value
    return value === HatFusion.YES;
  }, { toClassOnly: true })
  H_FusionInside: boolean;

  @CommonApiProperty('Hat, Hat Patch Size', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_PatchSize: number;

  @CommonApiProperty('Hat, Hat Patch Placement', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  H_PatchPlacement: number;

 // Bag Measurements

  @CommonApiProperty('Bag Height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_Height: number;

  @CommonApiProperty('Bag Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_Length: number;

  @CommonApiProperty('Bag Depth', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_Depth: number;

  @CommonApiProperty('Bag Handle Grip', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_HandleGrip: number;

  @CommonApiProperty('Bag Shoulder strap full lenght ', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_ShoulderStrap_Full_Length: number;

  @CommonApiProperty('Bag Front pocket length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_FrontPocketLength: number;

  @CommonApiProperty('Bag front pocket height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_FrontPocketHeight: number;

  @CommonApiProperty('Bag Sidepocket Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_SidePocketLength: number;

  @CommonApiProperty('Bag Side Pocket height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Bag_SidePocketHeight: number;

  // Basball Cap Measurements

  @CommonApiProperty('Cap Crown Circumference', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Cap_CrownCircumference: number;

  @CommonApiProperty('Cap Brim Length', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Cap_BrimLength: number;

  @CommonApiProperty('Cap Brim Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Cap_BrimWidth: number;

  @CommonApiProperty('Cap Height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  Cap_Height: number;

  @CommonApiProperty('Cap Crown Width', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)  
  Cap_Crown_Width: number;

  @CommonApiProperty('cap cuff height', '1')
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999.99)
  cap_cuff_height: number;
}
