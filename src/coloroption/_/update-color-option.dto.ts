import { PartialType } from '@nestjs/mapped-types';
import { CreateColorOptionDto } from './create-color-option.dto';
import { IsOptional } from 'class-validator';

export class UpdateColorOptionDto extends PartialType(CreateColorOptionDto) {
  @IsOptional()
  Id: number;
}
  