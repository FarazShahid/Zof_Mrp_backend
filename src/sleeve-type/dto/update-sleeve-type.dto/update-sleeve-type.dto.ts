import { PartialType } from '@nestjs/mapped-types';
import { CreateSleeveTypeDto } from '../create-sleeve-type.dto/create-sleeve-type.dto';

export class UpdateSleeveTypeDto extends PartialType(CreateSleeveTypeDto) {}