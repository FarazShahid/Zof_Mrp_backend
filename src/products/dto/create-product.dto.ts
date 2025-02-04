import { IsNotEmpty, ValidateNested, IsArray } from 'class-validator';

class ProductColorDto {
  @IsNotEmpty({ message: 'ColorName is required' })
  ColorName: string;

  @IsNotEmpty({ message: 'ImageId is required' })
  ImageId: string;
}

export class CreateProductDto {
  @IsNotEmpty({ message: 'ProductCategoryId is required' })
  ProductCategoryId: number;

  @IsNotEmpty({ message: 'FabricTypeId is required' })
  FabricTypeId: number;

  @IsNotEmpty({ message: 'Name is required' })
  Name: string;

  @IsNotEmpty({ message: 'CreatedBy is required' })
  CreatedBy: string;

  @IsNotEmpty({ message: 'UpdatedBy is required' })
  UpdatedBy: string;

  Description?: string;

  @IsArray({ message: 'productColors must be an array' })
  @ValidateNested({ each: true })
  productColors: ProductColorDto[];
}
