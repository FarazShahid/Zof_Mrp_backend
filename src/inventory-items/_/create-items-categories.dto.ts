import { IsString, IsNotEmpty, MaxLength, IsNumber, IsOptional } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventoryItemDto {
  @CommonApiProperty('Inventory Item Name', 'Wool')
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  Name: string;

  @CommonApiProperty('Sub Category ID', '1')
  @IsNumber()
  @IsNotEmpty()
  SubCategoryId: number;

  @CommonApiProperty('Unit of Measure', '12fg')
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  UnitOfMeasure: string;

  @CommonApiProperty('Supplier ID', '1')
  @IsNumber()
  @IsNotEmpty()
  SupplierId: number;

  @CommonApiProperty('Reorder Level', '1')
  @IsNumber()
  @IsOptional()
  ReorderLevel?: number;

  @CommonApiProperty('Stock', '1')
  @IsNumber()
  Stock: number;
}
