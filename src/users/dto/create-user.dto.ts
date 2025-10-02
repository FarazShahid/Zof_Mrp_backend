import { Type } from 'class-transformer';
import { IsString, IsEmail, IsBoolean, IsNotEmpty, MaxLength, IsNumber, IsOptional, Min, IsInt, IsArray, ValidateNested } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class AssignedClientDto {
  @CommonApiProperty('Client ID', '101')
  @IsInt()
  @Min(1)
  clientId: number;
}

export class CreateUserDto {
  @CommonApiProperty('User First Name goes here', 'John')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @CommonApiProperty('User Last Name goes here', 'Doe')
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @CommonApiProperty('User Email goes here', 'example@example.com')
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  Email: string;

  @CommonApiProperty('User Password goes here', 'Password')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Password?: string;

  @CommonApiProperty('User Role Id goes here', '1')
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  roleId: number;

  @CommonApiProperty('User isActive goes here', 'true')
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @CommonApiProperty('List of assigned clients', '[{ "clientId": 101 }, { "clientId": 102 }]')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignedClientDto)
  @IsOptional()
  assignedClients?: AssignedClientDto[];
}
