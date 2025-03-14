import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderStatusDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    Name: string;

    @IsString()
    @MaxLength(255)
    Description: string;
}

export class UpdateOrderStatusDto extends PartialType(CreateOrderStatusDto) {
}