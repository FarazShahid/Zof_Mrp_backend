import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateProductCategoryDto {
  @CommonApiProperty('Product Category Name', 'Test Category')
  @IsString()
  @IsNotEmpty()
  Type: string;

  @CommonApiProperty('IsTopUnit?', true)
  @IsBoolean()
  IsTopUnit: boolean = false;

  @CommonApiProperty('IsBottomUnit?', true)
  @IsBoolean()
  IsBottomUnit: boolean = false;

  @CommonApiProperty('SupportsLogo?', true)
  @IsBoolean()
  SupportsLogo: boolean = false;

  @CommonApiProperty('IsHat?', true)
  @IsBoolean()
  IsHat: boolean = false;

  @CommonApiProperty('IsBag?', true)
  @IsBoolean()
  IsBag: boolean = false;

  @CommonApiProperty('IsSocks?', true)
  @IsBoolean()
  IsSocks: boolean = false;

}
