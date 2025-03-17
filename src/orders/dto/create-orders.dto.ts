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

export class OrderItemDetailDto {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ColorOptionId: number;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(999999)
  Quantity: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(999)
  Priority: number;
}

export class PrintingOptionDto {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  PrintingOptionId: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(500)
  Description?: string;
}

export class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductId: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  Description?: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(999)
  OrderItemPriority: number;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  ImageId?: number;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  FileId?: number;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  VideoId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrintingOptionDto)
  @IsOptional()
  @ArrayMinSize(0)
  printingOptions?: PrintingOptionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDetailDto)
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'At least one color option is required for each order item' })
  orderItemDetails: OrderItemDetailDto[];
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ClientId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  OrderEventId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  Description: string;

  @IsDateString()
  @IsNotEmpty()
  Deadline: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(999)
  @IsOptional()
  OrderPriority?: number;

  @IsString()
  @IsOptional()
  OrderNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  OrderName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  ExternalOrderId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one order item is required' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
