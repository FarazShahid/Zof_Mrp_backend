import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  Email: string;

  @IsString()
  Password: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
