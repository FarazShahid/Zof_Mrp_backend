import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderStatusDto {
    @IsNotEmpty({ message: 'Order Status Name is required' })
    Name: string;

    @IsString({ message: 'Description should be string' })
    @MaxLength(500)
    Description: string;

    @IsNotEmpty({ message: 'Created By is required' })
    CreatedBy: string;
}

export class UpdateOrderStatusDto extends PartialType(CreateOrderStatusDto) {
    Id: number | (() => string);

    @IsString({ message: 'Updated by should be string' })
    @IsNotEmpty({ message: 'Updated by is required' })
    @MaxLength(100)
    UpdatedBy: string;
}