import { IsString, IsEmail, Length, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateClientDto {

    @IsString()
    @Length(1, 255)
    Name: string;

    @IsEmail()
    @Length(1, 255)
    Email: string;

    @IsPhoneNumber(undefined, { 
      message: 'Phone number must be a valid phone number with country code (e.g., +1234567890)' 
    })
    @Length(1, 255)
    Phone: string;

    @IsString()
    @Length(1, 255)
    Country: string;

    @IsString()
    @Length(1, 255)
    State: string;

    @IsString()
    @Length(1, 255)
    City: string;

    @IsString()
    @Length(1, 255)
    CompleteAddress: string;

    @IsString()
    @IsOptional()
    ClientStatusId?: string;
}
