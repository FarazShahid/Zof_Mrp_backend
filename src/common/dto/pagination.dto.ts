import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  @ApiProperty({
    description: 'Search query for product name or description',
    required: false,
  })
  @IsOptional()
  searchQuery?: string;


  @ApiProperty({
    description: 'Client ID to filter products',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  @ApiProperty({
    description: 'Product ID to filter products',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productId?: number;
} 