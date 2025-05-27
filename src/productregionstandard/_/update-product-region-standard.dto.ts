import { PartialType } from '@nestjs/mapped-types';
import { CreateProductRegionStandardDto } from './create-product-region-standard.dto';
export class UpdateProductRegionStandardDto extends PartialType(CreateProductRegionStandardDto) {
  Name?: string;
}