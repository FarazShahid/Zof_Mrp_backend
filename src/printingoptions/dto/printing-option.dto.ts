import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePrintingOptionDto {
    @IsNotEmpty({ message: 'Printing Option Name is required' })
    Name: string;

    @IsNotEmpty({ message: 'CreatedBy is required' })
    createdBy: string;
}

export class UpdatePrintingOptionDto extends PartialType(CreatePrintingOptionDto) {

    Id: number | (() => string);

    @IsString({ message: 'Updated by should be string' })
    @IsNotEmpty({ message: 'Updated by is required' })
    @MaxLength(100)
    UpdatedBy: string;
}