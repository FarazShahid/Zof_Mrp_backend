import { PartialType } from '@nestjs/swagger';
import { CreateShipmentCarrierDto } from './create-shipment-carrier.dto';

export class UpdateShipmentCarrierDto extends PartialType(CreateShipmentCarrierDto) {}
