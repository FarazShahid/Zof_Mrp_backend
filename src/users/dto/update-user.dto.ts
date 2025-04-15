import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class UpdateUserDto {
  @CommonApiProperty('User Email goes here', 'example@example.com')
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  Email?: string;

  @CommonApiProperty('User Password goes here', 'Password')
  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  Password: string;

  @CommonApiProperty('User isActive goes here', 'true')
  @IsBoolean({ message: 'isActive must be a boolean value (true or false)' })
  @IsOptional()
  isActive: boolean;
} 