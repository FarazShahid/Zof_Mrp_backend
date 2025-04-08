import { IsString, IsNotEmpty, MaxLength, IsInt } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventorySubCategoryDto {
  @CommonApiProperty('Inventory Sub Category Name', 'test name 1')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;

  @CommonApiProperty('Category Id', '1')
  @IsInt()
  @IsNotEmpty()
  CategoryId: number;
}
