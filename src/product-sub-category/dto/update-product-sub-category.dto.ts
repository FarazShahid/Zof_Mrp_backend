import { PartialType } from '@nestjs/swagger';
import { CreateProductSubCategoryDto } from './create-product-sub-category.dto';

export class UpdateProductSubCategoryDto extends PartialType(CreateProductSubCategoryDto) {}
