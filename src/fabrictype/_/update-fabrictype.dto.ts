import { IsString, IsInt, IsOptional, MaxLength, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFabricTypeDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  type?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsInt()
  @IsOptional()
  gsm?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdOn?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  createdBy?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedOn?: Date;
}
