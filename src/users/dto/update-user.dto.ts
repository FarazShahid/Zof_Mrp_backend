import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  Email?: string;

  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  Password?: string;

  @IsBoolean({ message: 'isActive must be a boolean value (true or false)' })
  @IsOptional()
  isActive?: boolean;
} 