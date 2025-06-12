import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSizeOptionDto {
  @IsNotEmpty({ message: 'OptionSizeOptions is required' })
  OptionSizeOptions: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  ProductRegionId: number
}
