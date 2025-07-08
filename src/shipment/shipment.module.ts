import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentCarrier } from 'src/shipment-carrier/entities/shipment-carrier.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentDetail } from './entities/shipment-details';
import { ShipmentBox } from './entities/shippment-box.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentCarrier, Shipment, ShipmentDetail, ShipmentBox, Order, OrderItem ])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule { }
