import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, MaxLength, IsNumber, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Name: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    Email: string;

    @IsPhoneNumber(undefined, { 
      message: 'Phone number must be a valid phone number with country code (e.g., +1234567890)' 
    })
    @IsNotEmpty()
    @MaxLength(255)
    Phone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    Country: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    State: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    City: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    CompleteAddress: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsNotEmpty()
    ClientStatusId: number;
}
