import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventoryUnitMeasuresDto {
  @CommonApiProperty('Inventory Unit Name', 'Kilogram')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;

  @CommonApiProperty('Inventory Unit Short form', 'KG')
  @IsString()
  @IsOptional()
  @MaxLength(100)
  ShortForm: string;
}
