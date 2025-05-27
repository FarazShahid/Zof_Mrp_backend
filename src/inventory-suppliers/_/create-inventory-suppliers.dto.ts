import { IsString, IsNotEmpty, MaxLength, IsEmail, IsOptional } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventorySuppliersDto {
  @CommonApiProperty('Inventory Suppliers Name', 'John Doe')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  Name: string;

  @CommonApiProperty('Supplier Email', 'example@example.com')
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  Email: string;

  @CommonApiProperty('Supplier Phone Number', '+123456789')
  @IsOptional()
  @MaxLength(255)
  Phone: string;

  @CommonApiProperty('Supplier Country Name', 'USA')
  @IsOptional()
  @IsString()
  @MaxLength(255)
  Country: string;

  @CommonApiProperty('Supplier State', 'Alaska')
  @IsOptional()
  @IsString()
  @MaxLength(255)
  State: string;

  @CommonApiProperty('Supplier City', 'Example City')
  @IsOptional()
  @IsString()
  @MaxLength(255)
  City: string;

  @CommonApiProperty('Supplier Complete Address', 'test streat, house a1')
  @IsOptional()
  @IsString()
  @MaxLength(255)
  CompleteAddress: string;
}
