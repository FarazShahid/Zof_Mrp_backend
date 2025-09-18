import {
  IsNotEmpty,
  ValidateNested,
  IsArray,
  IsNumber,
  IsInt,
  Min,
  IsString,
  MaxLength,
  IsOptional,
  MinLength,
} from 'class-validator';
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

class ProductPrintingOptionsDto {
  @CommonApiProperty('Printing Option Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  PrintingOptionId: number;
}

export class ProductDetailDto {
  @CommonApiProperty('Product Detail Id', 1)
  @IsOptional()
  Id?: number;

  @CommonApiProperty('Product Cut Option Id', 1)
  @IsOptional()
  @IsNumber()
  @IsInt()
  ProductCutOptionId?: number;

  @CommonApiProperty('Sleeve Type Id', 1)
  @IsOptional()
  @IsNumber()
  @IsInt()
  SleeveTypeId?: number;
}

export class CreateProductDto {
  @CommonApiProperty('Product Category Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ProductCategoryId: number;

  @CommonApiProperty('Client Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ClientId: number;

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

  @ApiProperty({ type: [ProductPrintingOptionsDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductPrintingOptionsDto)
  printingOptions?: ProductPrintingOptionsDto[];

  @ApiProperty({ type: [ProductDetailDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailDto)
  productDetails?: ProductDetailDto[];

  @ApiProperty({ type: [ProductSizesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSizesDto)
  @IsNotEmpty()
  // @ArrayMinSize(, { message: 'At least one Product Size is required' })
  productSizes: ProductSizesDto[];

  @CommonApiProperty("", [{
    id: 1,
    name: "Is all okay",
    productId: 1
  }])
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductQAChecklistDto)
  qaChecklist?: ProductQAChecklistDto[];
}

export class ProductQAChecklistDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'Check stitching quality' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  productId?: number;
}