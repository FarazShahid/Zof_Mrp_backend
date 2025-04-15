import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class  CreateProductCutOptionDto {
  @CommonApiProperty('Product Cut Option Name', 'Test Product Cut Option')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  OptionProductCutOptions: string;
}
