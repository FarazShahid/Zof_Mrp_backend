import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
        required: true,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: 'reCAPTCHA token',
        example: '03AGdBq24...',
        required: true
    })
    @IsString()
    token: string;
}