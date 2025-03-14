import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePrintingOptionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    Name: string;
}

export class UpdatePrintingOptionDto extends PartialType(CreatePrintingOptionDto) {

}