import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCutOptionDto } from './create-product-cut-option.dto';
import { IsOptional } from 'class-validator';

export class UpdateProductCutOptionDto extends PartialType(CreateProductCutOptionDto) {
  @IsOptional()
  Id: number;
}
