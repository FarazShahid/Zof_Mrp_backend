import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateClientDto {
  @CommonApiProperty('Client Name', 'John Doe')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Name: string;

  @CommonApiProperty('Client Email', 'example@example.com')
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  Email: string;

  @CommonApiProperty('Client Phone Number', '+123456789')
  @IsPhoneNumber(undefined, {
    message: 'Phone number must be a valid phone number with country code (e.g., +1234567890)'
  })
  @IsNotEmpty()
  @MaxLength(255)
  Phone: string;

  @CommonApiProperty('Client Country Name', 'USA')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Country: string;

  @CommonApiProperty('Client State', 'Alaska')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  State: string;

  @CommonApiProperty('Client City', 'Example City')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  City: string;

  @CommonApiProperty('Client Complete Address', 'test streat, house a1')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  CompleteAddress: string;

  @CommonApiProperty('Client Status Id', '1')
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  ClientStatusId: number;
}