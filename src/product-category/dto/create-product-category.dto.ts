import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}
