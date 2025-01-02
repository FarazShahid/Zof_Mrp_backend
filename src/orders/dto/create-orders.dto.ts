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

  @IsArray()
  @IsOptional()
  items: {
    ProductId: number;
    Description?: string;
    ImageId?: number;
    FileId?: number;
    VideoId?: number;
  }[];
}
