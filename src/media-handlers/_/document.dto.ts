import { IsNotEmpty, IsNumber } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateDocumentDto {
  @CommonApiProperty('Document Type Id', 1)
  @IsNotEmpty()
  @IsNumber()
  DocTypeId: number;
}
