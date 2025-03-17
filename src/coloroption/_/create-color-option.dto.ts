import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateColorOptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  HexCode: string;
}
