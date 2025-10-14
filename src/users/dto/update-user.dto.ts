import { Type } from 'class-transformer';
import { IsString, IsEmail, IsBoolean, IsOptional, IsInt, Min, IsArray, ValidateNested, IsNotEmpty, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class AssignedClientDto {
  @CommonApiProperty('Client ID', '101')
  @IsInt()
  @Min(1)
  clientId: number;
}

export class UpdateUserDto {
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
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  Email?: string;

  @CommonApiProperty('User Password goes here', 'Password')
  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  Password: string;

  @CommonApiProperty('User Role Id goes here', '1')
  @IsInt()
  @Min(1)
  @IsOptional()
  roleId?: number;

  @CommonApiProperty('User isActive goes here', 'true')
  @IsBoolean({ message: 'isActive must be a boolean value (true or false)' })
  @IsOptional()
  isActive: boolean;

  @CommonApiProperty('List of assigned clients', '[{ "clientId": 101 }, { "clientId": 102 }]')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignedClientDto)
  @IsOptional()
  assignedClients?: AssignedClientDto[];
} 