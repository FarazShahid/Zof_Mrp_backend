import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { Client } from './clients/entities/client.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UserModule } from './users/user.module';
import { EventsModule } from './events/events.module';
import { ClientEvent } from './events/entities/clientevent.entity';
import { OrderstatusModule } from './orderstatus/orderstatus.module';
import { OrderStatus } from './orderstatus/entities/orderstatus.entity';
import { OrdersService } from './orders/orders.service';
import { OrderModule } from './orders/orders.module';
import { Order } from './orders/entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'zof_mrp',
    autoLoadEntities: true, 
    entities: [Client, Product, User, ClientEvent, OrderStatus, Order],
    // Make Sync False for Prod
    synchronize: true
  }), ClientsModule, ProductsModule, AuthModule, UserModule, EventsModule, OrderstatusModule, OrderModule],
  controllers: []
})
export class AppModule {}
