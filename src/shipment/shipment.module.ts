import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentCarrier } from 'src/shipment-carrier/entities/shipment-carrier.entity';
import { Shipment } from './entities/shipment.entity';
// import { ShipmentDetail } from './entities/shipment-details';
import { ShipmentBox, ShipmentBoxItem } from './entities/shipment-box.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { ShipmentOrder } from './entities/shipment-order.entity';
import { OrderItemDetails } from 'src/orders/entities/order-item-details';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentCarrier, Shipment, ShipmentBox, ShipmentBoxItem, Order, OrderItem, ShipmentOrder , OrderItemDetails])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
})
export class ShipmentModule { }
