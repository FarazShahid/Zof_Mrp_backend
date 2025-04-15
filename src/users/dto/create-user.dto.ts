import { IsString, IsEmail, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateUserDto {
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

  @CommonApiProperty('User isActive goes here', 'true')
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
