import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateSleeveTypeDto {
  @IsNotEmpty({ message: 'Sleeve Type Name is required' })
  sleeveTypeName: string;

  @IsInt({ message: 'Must be a valid integer' })
  @Min(1, { message: 'Must be greater than 0' })
  productCategoryId: number;
}
