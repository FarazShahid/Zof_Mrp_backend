import { IsString, IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateFabricTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @IsNotEmpty()
  gsm: number;
}
