import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductRegionStandardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Name: string;
}
