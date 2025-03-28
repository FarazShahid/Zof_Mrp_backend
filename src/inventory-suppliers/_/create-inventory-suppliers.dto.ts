import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventorySuppliersDto {
  @CommonApiProperty('Inventory Suppliers Name', 'John Doe')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;
}
