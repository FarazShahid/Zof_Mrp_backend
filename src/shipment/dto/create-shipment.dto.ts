import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  Min,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ShipmentStatus } from '../entities/shipment.entity';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class ShipmentDetailDto {
  @CommonApiProperty('Order Item ID', 1)
  @IsNumber()
  @Min(1)
  OrderItemId: number;

  @CommonApiProperty('Quantity', 1)
  @IsNumber()
  @Min(1)
  Quantity: number;

  @CommonApiProperty('Size', 'M')
  @IsString()
  Size: string;

  @CommonApiProperty('Item Details', 'Special instructions for packing')
  @IsString()
  @IsOptional()
  ItemDetails?: string;
}

export class ShipmentBoxDto {
  @CommonApiProperty('Box Number', 1)
  @IsNumber()
  @Min(1)
  BoxNumber: number;

  @CommonApiProperty('Weight', 2.5)
  @IsNumber()
  @Min(0.01)
  Weight: number;
}

export class CreateShipmentDto {
  @CommonApiProperty('Shipment Code', 'SHIP-0001')
  @IsString()
  @IsNotEmpty()
  ShipmentCode: string;

  @CommonApiProperty('Order ID', 1)
  @IsNumber()
  @Min(1)
  OrderId: number;

  @CommonApiProperty('Shipment Carrier ID', 1)
  @IsNumber()
  @Min(1)
  ShipmentCarrierId: number;

  @CommonApiProperty('Shipment Date', '2025-07-04T10:00:00Z')
  @IsDateString()
  ShipmentDate: string;

  @CommonApiProperty('Shipment Cost', 120.50)
  @IsNumber()
  @Min(0)
  ShipmentCost: number;

  @CommonApiProperty('Total Weight', 40.75)
  @IsNumber()
  @Min(0)
  TotalWeight: number;

  @CommonApiProperty('Number of Boxes', 3)
  @IsNumber()
  @Min(1)
  NumberOfBoxes: number;

  @CommonApiProperty('Weight Unit', 'kg')
  @IsString()
  @IsNotEmpty()
  WeightUnit: string;

  @CommonApiProperty('Received Time (optional)', '2025-07-06T16:00:00Z')
  @IsDateString()
  @IsOptional()
  ReceivedTime?: string;

  @CommonApiProperty('Status', 'Pending')
  @IsEnum(ShipmentStatus)
  Status: ShipmentStatus;

  @ApiProperty({ type: [ShipmentDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ShipmentDetailDto)
  ShipmentDetails: ShipmentDetailDto[];

  @ApiProperty({ type: [ShipmentBoxDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ShipmentBoxDto)
  boxes: ShipmentBoxDto[];
}




export interface ShipmentResponseDto {
  Id: number;
  ShipmentCode: string;
  ShipmentDate: string | Date;
  ShipmentCost: number;
  WeightUnit: string;
  TotalWeight: number;
  NumberOfBoxes: number;
  ReceivedTime: string | Date | null;
  Status: ShipmentStatus;
  ShipmentCarrierId: number;
  ShipmentCarrierName: string;
  OrderId: number;
  OrderName: string;
  OrderNumber: string;
  CreatedOn: string | Date;
  UpdatedOn: string | Date;
  CreatedBy: string;
  UpdatedBy: string;
}