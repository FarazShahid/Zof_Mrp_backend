import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), // Register Order entity
    UserModule, // Import UserModule if required
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Export service if needed in other modules
})
export class OrderModule {}
