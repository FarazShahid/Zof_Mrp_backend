import { PartialType } from '@nestjs/swagger';
import { CreateShipmentCarrierDto } from './create-Shipment-carrier.dto';

export class UpdateShipmentCarrierDto extends PartialType(CreateShipmentCarrierDto) {}
