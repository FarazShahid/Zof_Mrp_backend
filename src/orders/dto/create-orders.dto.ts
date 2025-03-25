import { 
  IsArray, 
  IsOptional, 
  IsString, 
  IsNumber, 
  IsNotEmpty, 
  IsDateString, 
  ValidateNested, 
  Min, 
  IsInt,
  ArrayMinSize,
  Max,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';
import { ApiProperty } from '@nestjs/swagger';
export class OrderItemDetailDto {
  @CommonApiProperty('Color Option Id', 'Color Option Id')
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ColorOptionId: number;

  @CommonApiProperty('Quantity', '1')
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(999999)
  Quantity: number;

  @CommonApiProperty('Order Item Priority', '1')
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(999)
  Priority: number;
}

export class PrintingOptionDto {
  @CommonApiProperty('Printing Option Id', '1')
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  PrintingOptionId: number;

  @CommonApiProperty('Printing Option Description', 'Printing Option Description')
  @IsString()
  @IsOptional()
  @MaxLength(500)
  Description?: string;
}

export class OrderItemDto {
  @CommonApiProperty('Product Id', '1')
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductId: number;

  @CommonApiProperty('Order Item Description', 'Order Item Description')
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  Description?: string;

  @CommonApiProperty('Order Item Priority', '1')
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(999)
  OrderItemPriority: number;

  @CommonApiProperty('Image Id', '1')
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  ImageId?: number;

  @CommonApiProperty('File Id', '1')
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  FileId?: number;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  @CommonApiProperty('Video Id', '1')
  VideoId?: number;

  @ApiProperty({ type: [PrintingOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrintingOptionDto)
  @IsOptional()
  @ArrayMinSize(0)
  printingOptions?: PrintingOptionDto[];

  @ApiProperty({ type: [OrderItemDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDetailDto)
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'At least one color option is required for each order item' })
  orderItemDetails: OrderItemDetailDto[];
}

export class CreateOrderDto {
  @CommonApiProperty('Client Id', '1')
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ClientId: number;

  @CommonApiProperty('Order Event Id', '1')
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  OrderEventId: number;

  @CommonApiProperty('Order Description', 'Order Description')
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  Description: string;

  @CommonApiProperty('Order Deadline', '27-08-2024')
  @IsDateString()
  @IsNotEmpty()
  Deadline: string;
  
  @CommonApiProperty('Order Priority', '1')
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(999)
  @IsOptional()
  OrderPriority?: number;

  @CommonApiProperty('Order Number', 'Order Number')
  @IsString()
  @IsOptional()
  OrderNumber?: string;

  @CommonApiProperty('Order Name', 'T - Shirts Rise FC - 10')
  @IsString()
  @IsOptional()
  @MaxLength(200)
  OrderName?: string;

  @CommonApiProperty('External Order Id', 'RFC123')
  @IsString()
  @IsOptional()
  @MaxLength(100)
  ExternalOrderId: string;
  
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one order item is required' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
