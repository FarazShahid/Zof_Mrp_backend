import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDocumentTypeDto } from './create-order-document-type.dto';

export class UpdateOrderDocumentTypeDto extends PartialType(CreateOrderDocumentTypeDto) {}
