import { IsNotEmpty, ValidateNested, IsArray, IsNumber, IsInt, Min, IsString, MaxLength, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class ProductColorDto {
  Id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  colorId: number;

  @IsNotEmpty()
  ImageId: string;
}

export class ProductDetailDto {
  Id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductCutOptionId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductSizeMeasurementId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductRegionId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SleeveTypeId: number;
}

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductCategoryId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  FabricTypeId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  Description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'At least one Product Color is required' })
  productColors: ProductColorDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailDto)
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'At least one Product Detail Option is required' })
  productDetails: ProductDetailDto[];
}
