import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  ClientId: number;

  @IsNumber()
  OrderEventId: number;

  @IsString()
  Description: string;

  @IsNumber()
  OrderStatusId: number;

  @IsString()
  Deadline: string;

  @IsOptional()
  OrderPriority?: number;

  @IsString()
  OrderNumber?: string;

  @IsString()
  OrderName?: string;

  @IsString()
  ExternalOrderId?: string;

  @IsArray()
  @IsOptional()
  items: {
    ProductId: number;
    Description?: string;
    OrderItemPriority: number;
    ImageId?: number;
    FileId?: number;
    VideoId?: number;
    OrderItemQuantity?: number;
    printingOptions?: { PrintingOptionId: number; Description?: string }[];
    orderItemDetails?: { ColorOptionId: number }[];
  }[];
}
