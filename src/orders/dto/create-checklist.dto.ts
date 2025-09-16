import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateQualityCheckDto {
  @CommonApiProperty('Order Id', '123')
  @IsInt()
  orderId: number;

  @CommonApiProperty('Product Id', '45')
  @IsOptional()
  @ValidateIf(o => o.measurementId == null)
  @IsInt()
  productId?: number;

  @CommonApiProperty('Measurement Id', '67')
  @IsOptional()
  @ValidateIf(o => o.productId == null)
  @IsInt()
  measurementId?: number;

  @CommonApiProperty('Parameter', 'Length')
  @IsString()
  parameter: string;

  @CommonApiProperty('Expected Value', '100 cm')
  @IsOptional()
  @IsString()
  expected?: string;

  @CommonApiProperty('Observed Value', '98 cm')
  @IsString()
  observed: string;

  @CommonApiProperty('Remarks', 'Slightly short')
  @IsOptional()
  @IsString()
  remarks?: string;
}
