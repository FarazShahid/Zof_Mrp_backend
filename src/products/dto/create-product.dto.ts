import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'ProductCategoryId is required' })
  ProductCategoryId: number;

  @IsNotEmpty({ message: 'FabricTypeId is required' })
  FabricTypeId: number;

  @IsNotEmpty({ message: 'Name is required' })
  Name: string;

  @IsNotEmpty({ message: 'CreatedBy is required' })
  CreatedBy: string;

  @IsNotEmpty({ message: 'UpdatedBy is required' })
  UpdatedBy: string;

  Description?: string;
}
