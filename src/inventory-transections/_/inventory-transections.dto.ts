import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';
import { TransactionType } from './inventory-transections.entity';

export class CreateInventoryTransectionsDto {
  @CommonApiProperty('Inventory Item ID', '1')
  @IsNumber()
  @IsNotEmpty()
  InventoryItemId: number;

  @CommonApiProperty('Quantity', '2')
  @IsNumber()
  @IsNotEmpty()
  Quantity: number;

  @CommonApiProperty('Transaction Type Name', TransactionType.IN)
  @IsEnum(TransactionType)
  @IsNotEmpty()
  TransactionType: TransactionType;

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

  @CommonApiProperty('Transaction Date', '2025-07-04T10:00:00Z')
  @IsDateString()
  @IsOptional()
  TransactionDate?: string;
}
