import { Module } from '@nestjs/common';
import { ShipmentCarrierController } from './Shipment-carrier.controller';
import { ShipmentCarrierService } from './shipment-carrier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentCarrier } from './entities/shipment-carrier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentCarrier])],
  controllers: [ShipmentCarrierController],
  providers: [ShipmentCarrierService],
})
export class ShipmentCarrierModule { }
