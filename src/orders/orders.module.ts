import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserModule } from '../users/user.module';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], 
})
export class OrderModule {}
