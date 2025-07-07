import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  file_name: string;

  @IsString()
  @IsNotEmpty()
  file_type: string;

  @IsString()
  @IsNotEmpty()
  file_url: string;

  @IsString()
  uploaded_by?: string;
}

export class LinkMediaDto {
  @IsNumber()
  media_id: number;

  @IsString()
  reference_type: string;

  @IsNumber()
  reference_id: number;

  @IsString()
  tag?: string;
}