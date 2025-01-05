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

  @IsArray()
  @IsOptional()
  items: {
    ProductId: number;
    Description?: string;
    OrderItemPriority: number;
    ImageId?: number;
    FileId?: number;
    ColorOptionId: number;
    VideoId?: number;
    printingOptions?: { PrintingOptionId: number; Description?: string }[]; // Added printing options
  }[];
}
