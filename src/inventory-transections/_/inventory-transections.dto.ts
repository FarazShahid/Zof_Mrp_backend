import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventoryTransectionsDto {
  @CommonApiProperty('Inventory Item ID', '1')
  @IsNumber()
  @IsNotEmpty()
  InventoryItemId: number;

  @CommonApiProperty('Quantity', '2')
  @IsNumber()
  @IsNotEmpty()
  Quantity: number;

  @CommonApiProperty('Transection Type Name', 'In')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  TransactionType: string;

  @CommonApiProperty('Client ID', '3')
  @IsNumber()
  @IsOptional()
  ClientId?: number;

  @CommonApiProperty('Supplier ID', '5')
  @IsNumber()
  @IsOptional()
  SupplierId?: number;

  @CommonApiProperty('Order ID', '7')
  @IsNumber()
  @IsOptional()
  OrderId?: number;
}
