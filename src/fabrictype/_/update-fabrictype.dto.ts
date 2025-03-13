import { IsString, IsInt, IsOptional, MaxLength, IsDate, IsNumber } from 'class-validator';

export class UpdateFabricTypeDto {
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
}
