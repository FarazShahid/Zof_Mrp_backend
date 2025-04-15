import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateOrderStatusDto {
    @CommonApiProperty('Order Status Name', 'Test Order Status')
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    Name: string;

    @CommonApiProperty('Order Status Description', 'lorem ipsum dolor sit amet')
    @IsString()
    @MaxLength(255)
    Description: string;
}

export class UpdateOrderStatusDto extends PartialType(CreateOrderStatusDto) {
}