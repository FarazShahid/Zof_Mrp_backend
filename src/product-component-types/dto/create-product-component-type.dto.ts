import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductComponentTypeDto {
    @ApiProperty({ example: 'Collar' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    name: string;
}
