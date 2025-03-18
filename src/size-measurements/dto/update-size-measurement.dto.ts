import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeMeasurementDto } from './create-size-measurement.dto';

export class UpdateSizeMeasurementDto extends PartialType(CreateSizeMeasurementDto) {} 