import { IsString, IsEmail, Length, IsPhoneNumber, IsDate } from 'class-validator';

export class CreateClientDto {

    @IsString()
    @Length(1, 255)
    Name: string;

    @IsEmail()
    @Length(1, 255)
    Email: string;

    @IsPhoneNumber()
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
    @Length(1, 255)
    iS: string;

    ClientStatusId?: any;

    @IsDate()
    @Length(1, 255)
    CreatedOn: string;

    CreatedBy: any;

}
