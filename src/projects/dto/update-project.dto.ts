import {
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class UpdateProjectDto {
  @CommonApiProperty('Project Name', 'Costa Rica')
  @IsString()
  @IsOptional()
  @MaxLength(255)
  Name?: string;

  @CommonApiProperty('Project Description', 'Project description goes here')
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  Description?: string;

  @CommonApiProperty('Is Archived', false)
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}

