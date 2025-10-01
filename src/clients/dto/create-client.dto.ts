import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
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
  @IsOptional()
  @MaxLength(255)
  Email: string;

  @CommonApiProperty('Person of contact Name', 'Ali Raza')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  POCName: string;

  @CommonApiProperty('POC Phone Number', '+123456789')
  @IsOptional()
  @MaxLength(255)
  Phone: string;

  @CommonApiProperty('POC Email', 'aliraza@gmail.com')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  POCEmail: string;

  @CommonApiProperty('Website', 'www.myfitnessclub.com')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Website: string;

  @CommonApiProperty('Linkedin', '')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Linkedin: string;

  @CommonApiProperty('Instagram', '')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Instagram: string;

  @CommonApiProperty('Client Country Name', 'USA')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Country: string;

  @CommonApiProperty('Client State', 'Alaska')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  State: string;

  @CommonApiProperty('Client City', 'Example City')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  City: string;

  @CommonApiProperty('Client Complete Address', 'test streat, house a1')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  CompleteAddress: string;

  @CommonApiProperty('Client Status Id', '1')
  @IsString()
  @IsOptional()
  ClientStatusId: string | null;
}