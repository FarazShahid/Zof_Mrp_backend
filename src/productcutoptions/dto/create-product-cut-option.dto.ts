import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductCutOptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  OptionProductCutOptions: string;
}
