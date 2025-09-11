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
  IsOptional,
  ArrayNotEmpty,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ShipmentStatus } from '../entities/shipment.entity';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class ShipmentBoxItemDto {
  @CommonApiProperty('Order Item ID', 1)
  @IsNotEmpty()
  @IsNumber()
  OrderItemId: number;

  @CommonApiProperty('Item Description', 'Information about item')
  @IsString()
  @IsOptional()
  OrderItemDescription?: string;

  @CommonApiProperty('Quantity of this order item inside the box', 2)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  Quantity: number;
}

export class ShipmentBoxDto {
  @CommonApiProperty('Box Number', "ASDSA787ASDAS78")
  @IsNotEmpty()
  @IsString()
  BoxNumber: string;

  @CommonApiProperty('Weight', 2.5)
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  Weight: number;

  @CommonApiProperty('Order Item Name', 'Green Jersey')
  @IsOptional()
  @IsString()
  OrderItemName: string;

  @ApiProperty({ type: [ShipmentBoxItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ShipmentBoxItemDto)
  items: ShipmentBoxItemDto[];
}

export class CreateShipmentDto {
  @CommonApiProperty('Shipment Code', 'SHIP-0001')
  @IsString()
  @IsNotEmpty()
  ShipmentCode: string;

  @CommonApiProperty('Tracking Id', 'TD-534-T534')
  @IsString()
  @IsNotEmpty()
  TrackingId: string;

  @CommonApiProperty('Order Number', 'CTA-158')
  @IsString()
  OrderNumber: string;

  @ApiProperty({ description: "Order IDs", example: [1, 2, 3] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  OrderIds: number[];

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
  @IsString()
  @IsOptional()
  ReceivedTime?: string;

  @CommonApiProperty('Status', 'Pending')
  @IsEnum(ShipmentStatus)
  Status: ShipmentStatus;

  @ApiProperty({ type: [ShipmentBoxDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ShipmentBoxDto)
  boxes: ShipmentBoxDto[];
}




export interface ShipmentResponseDto {
  Id: number;
  Orders: Array<{ Id: number; OrderName: string }>;
  ShipmentCode: string;
  OrderIds: number[];  
  TrackingId: string;
  ShipmentDate: string | Date;
  ShipmentCost: number;
  WeightUnit: string;
  TotalWeight: number;
  NumberOfBoxes: number;
  ReceivedTime: string | Date | null;
  Boxes: any[];
  Status: ShipmentStatus;
  ShipmentCarrierId: number;
  ShipmentCarrierName: string;
  OrderNumber: string;
  CreatedOn: string | Date;
  UpdatedOn: string | Date;
  CreatedBy: string;
  UpdatedBy: string;
}