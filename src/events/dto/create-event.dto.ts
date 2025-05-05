import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateEventDto {
  @CommonApiProperty('Event Name', 'Event Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  EventName: string;

  @CommonApiProperty('Event Description', 'Event Description')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Description: string;

  @CommonApiProperty('Default Client Id', 1)
  @IsOptional()
  ClientId: number | null;
} 