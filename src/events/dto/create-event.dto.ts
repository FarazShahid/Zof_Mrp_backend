import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  EventName: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  Description: string;
} 