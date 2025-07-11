import { Module } from '@nestjs/common';
import { ShipmentCarrierController } from './shipment-carrier.controller';
import { ShipmentCarrierService } from './shipment-carrier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentCarrier } from './entities/shipment-carrier.entity';
import { Shipment } from 'src/shipment/entities/shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentCarrier, Shipment])],
  controllers: [ShipmentCarrierController],
  providers: [ShipmentCarrierService],
})
export class ShipmentCarrierModule { }
