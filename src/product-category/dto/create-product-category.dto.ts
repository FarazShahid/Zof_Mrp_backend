import { IsNotEmpty, IsString } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateProductCategoryDto {
  @CommonApiProperty('Product Category Name', 'Test Category')
  @IsString()
  @IsNotEmpty()
  type: string;
}
