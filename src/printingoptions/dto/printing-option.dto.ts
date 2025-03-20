import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreatePrintingOptionDto {
    @CommonApiProperty('Printing Option Name', 'Seblimation')  
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    Name: string;
}

export class UpdatePrintingOptionDto extends PartialType(CreatePrintingOptionDto) {

}