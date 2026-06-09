import { PartialType } from '@nestjs/swagger';
import { CreateProductComponentTypeDto } from './create-product-component-type.dto';

export class UpdateProductComponentTypeDto extends PartialType(CreateProductComponentTypeDto) {}
