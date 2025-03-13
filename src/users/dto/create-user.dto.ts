import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  Email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Password?: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
