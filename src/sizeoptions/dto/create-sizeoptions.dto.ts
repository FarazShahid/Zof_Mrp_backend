import { IsNotEmpty } from 'class-validator';

export class CreateSizeOptionDto {
  @IsNotEmpty({ message: 'OptionSizeOptions is required' })
  OptionSizeOptions: string;

  @IsNotEmpty({ message: 'CreatedBy is required' })
  CreatedBy: string;

  @IsNotEmpty({ message: 'UpdatedBy is required' })
  UpdatedBy: string;
}
