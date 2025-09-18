import { Module } from '@nestjs/common';
import { ShipmentCarrierController } from './shipment-carrier.controller';
import { ShipmentCarrierService } from './shipment-carrier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentCarrier } from './entities/shipment-carrier.entity';
import { Shipment } from 'src/shipment/entities/shipment.entity';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentCarrier, Shipment]), AuditModule],
  controllers: [ShipmentCarrierController],
  providers: [ShipmentCarrierService],
})
export class ShipmentCarrierModule { }
