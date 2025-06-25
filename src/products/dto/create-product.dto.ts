import { IsNotEmpty, ValidateNested, IsArray, IsNumber, IsInt, Min, IsString, MaxLength, IsOptional, ArrayMinSize, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';
import { ApiProperty } from '@nestjs/swagger';

class ProductColorDto {
  @CommonApiProperty('Product Color Id', 1)
  @IsOptional()
  Id: number;

  @CommonApiProperty('Color Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  colorId: number;

  @CommonApiProperty('Image Id', 1)
  @IsOptional()
  ImageId: string;
}

class ProductSizesDto {
  @CommonApiProperty('Product Size Id', '1')
  @IsOptional()
  Id: number;

  @CommonApiProperty('Size Id', '1')
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  sizeId: number;
}

export class ProductDetailDto {
  @CommonApiProperty('Product Detail Id', 1)
  @IsOptional()
  Id: number;

  @CommonApiProperty('Product Cut Option Id', 1)
  @IsNumber()
  @IsOptional()
  @IsInt()
  ProductCutOptionId: number;

  @CommonApiProperty('Sleeve Type Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SleeveTypeId: number;
}

export class CreateProductDto {
  @CommonApiProperty('Product Category Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductCategoryId: number;

  @CommonApiProperty('Product name', 'T-Shirt', true)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  Name: string;

  @CommonApiProperty('Fabric Type Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  FabricTypeId: number;

  @CommonApiProperty('Product Status', 'Product Status goes here')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  productStatus?: string;

  @CommonApiProperty('Description', 'Description goes here')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Description?: string;

  @ApiProperty({ type: [ProductColorDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  productColors?: ProductColorDto[];

  @ApiProperty({ type: [ProductDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailDto)
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'At least one Product Detail Option is required' })
  productDetails: ProductDetailDto[];

  @ApiProperty({ type: [ProductSizesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSizesDto)
  @IsNotEmpty()
  @ArrayMinSize(1, { message: 'At least one Product Size is required' })
  productSizes: ProductSizesDto[];
}
