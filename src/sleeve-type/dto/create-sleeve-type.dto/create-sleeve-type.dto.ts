import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateSleeveTypeDto {
  @IsNotEmpty({ message: 'Sleeve Type Name is required' })
  sleeveTypeName: string;

  @IsInt({ message: 'ProductCategoryId must be a valid integer' })
  @Min(1, { message: 'ProductCategoryId must be greater than 0' })
  productCategoryId: number;

  @IsNotEmpty({ message: 'CreatedBy is required' })
  createdBy: string;
}
