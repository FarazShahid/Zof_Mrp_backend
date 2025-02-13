import { IsNotEmpty } from 'class-validator';

export class CreateProductCutOptionDto {
  @IsNotEmpty({ message: 'OptionProductCutOptions is required' })
  OptionProductCutOptions: string;

  @IsNotEmpty({ message: 'CreatedBy is required' })
  CreatedBy: string;

  @IsNotEmpty({ message: 'UpdatedBy is required' })
  UpdatedBy: string;
}
