import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateProjectDto {
  @CommonApiProperty('Project Name', 'Costa Rica')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Name: string;

  @CommonApiProperty('Client Id', 1)
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  ClientId: number;

  @CommonApiProperty('Project Description', 'Project description goes here')
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  Description?: string;
}

