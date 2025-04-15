import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventoryCategoryDto {
  @CommonApiProperty('Inventory Category Name', 'Inventory Category Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;
}
