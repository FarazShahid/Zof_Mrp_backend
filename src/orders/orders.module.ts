import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserModule } from '../users/user.module';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsPrintingOption } from './entities/order-item-printiing.option.entity';
import { OrderItemDetails } from './entities/order-item-details';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderItemsPrintingOption, OrderItemDetails]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], 
})
export class OrderModule {}
