import { IsNotEmpty, ValidateNested, IsArray } from 'class-validator';

class ProductColorDto {
  Id: number;

  @IsNotEmpty({ message: 'ColorName is required' })
  colorId: number;

  @IsNotEmpty({ message: 'ImageId is required' })
  ImageId: string;
}

export class ProductDetailDto {
  Id: number;

  @IsNotEmpty({ message: 'ProductCutOptionId is required' })
  ProductCutOptionId: number;

  @IsNotEmpty({ message: 'ProductSizeMeasurementId is required' })
  ProductSizeMeasurementId: number;

  @IsNotEmpty({ message: 'ProductRegionId is required' })
  ProductRegionId: number;

  @IsNotEmpty({ message: 'SleeveTypeId is required' })
  SleeveTypeId: number;
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

  @IsArray({ message: 'productDetails must be an array' })
  @ValidateNested({ each: true })
  productDetails: ProductDetailDto[];
}
