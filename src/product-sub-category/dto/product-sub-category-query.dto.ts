import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductSubCategoryQueryDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ required: false, example: 'Crew' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'name' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], example: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({ required: false, example: 1, description: 'Filter by Product Category Id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productCategoryId?: number;
}
