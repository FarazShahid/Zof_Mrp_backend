import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeOptionDto } from './create-sizeoptions.dto';

export class UpdateSizeOptionDto extends PartialType(CreateSizeOptionDto) {
    Id: number | (() => string);
}