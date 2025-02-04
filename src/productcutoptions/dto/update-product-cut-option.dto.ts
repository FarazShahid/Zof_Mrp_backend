import { PartialType } from '@nestjs/mapped-types';
import { CreateProductCutOptionDto } from './create-product-cut-option.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductCutOptionDto extends PartialType(CreateProductCutOptionDto) {
  @IsNotEmpty({ message: 'Id is required' })
  Id: number;
}
