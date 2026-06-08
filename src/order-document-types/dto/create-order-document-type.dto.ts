import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateOrderDocumentTypeDto {
  @CommonApiProperty('Order document type name', 'Purchase Order')
  @IsString()
  @IsNotEmpty()
  Name: string;

  @CommonApiProperty('Whether this document type is required to complete an order', true)
  @IsBoolean()
  IsRequired: boolean = false;

  @CommonApiProperty('File extensions accepted for this document type', ['pdf', 'jpg', 'png'], false)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  SupportedExtensions?: string[];
}
