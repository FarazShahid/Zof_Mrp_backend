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
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDetailDto {
  @IsNumber()
  @IsNotEmpty()
  ColorOptionId: number;

  @IsNumber()
  @IsInt()
  @Min(1)
  Quantity: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  Priority: number;
}

export class PrintingOptionDto {
  @IsNumber()
  @IsNotEmpty()
  PrintingOptionId: number;

  @IsString()
  @IsOptional()
  Description?: string;
}

export class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  ProductId: number;

  @IsString()
  @IsOptional()
  Description?: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  OrderItemPriority: number;

  @IsNumber()
  @IsOptional()
  ImageId?: number;

  @IsNumber()
  @IsOptional()
  FileId?: number;

  @IsNumber()
  @IsOptional()
  VideoId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrintingOptionDto)
  @IsOptional()
  printingOptions?: PrintingOptionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDetailDto)
  @IsOptional()
  orderItemDetails?: OrderItemDetailDto[];
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  ClientId: number;

  @IsNumber()
  @IsNotEmpty()
  OrderEventId: number;

  @IsString()
  @IsNotEmpty()
  Description: string;

  @IsNumber()
  @IsNotEmpty()
  OrderStatusId: number;

  @IsDateString()
  Deadline: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  OrderPriority?: number;

  @IsString()
  @IsOptional()
  OrderNumber?: string;

  @IsString()
  @IsOptional()
  OrderName?: string;

  @IsString()
  @IsOptional()
  ExternalOrderId?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one order item is required' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
