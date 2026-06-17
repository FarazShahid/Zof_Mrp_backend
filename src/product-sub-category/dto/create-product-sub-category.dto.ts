import { IsString, IsNotEmpty, MinLength, MaxLength, IsInt, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSubCategoryDto {
    @ApiProperty({ example: 'Crew Neck' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    name: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    productCategoryId: number;
}
