import { IsNotEmpty } from 'class-validator';

export class CreateSizeOptionDto {
  @IsNotEmpty({ message: 'OptionSizeOptions is required' })
  OptionSizeOptions: string;
}
