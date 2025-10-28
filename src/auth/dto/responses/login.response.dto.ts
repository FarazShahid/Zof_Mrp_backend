import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    access_token: string;

    @ApiProperty({
        description: 'JWT refresh token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    refresh_token: string;

    @ApiProperty({
        description: 'Access token expiration time in seconds',
        example: 900
    })
    expires_in: number;

    @ApiProperty({
        description: 'User information',
        example: {
            id: 1,
            email: 'user@example.com'
        }
    })
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
} 