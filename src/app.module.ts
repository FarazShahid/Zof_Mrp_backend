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
import { OrderModule } from './orders/orders.module';
import { Order } from './orders/entities/orders.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrderItemsPrintingOption } from './orders/entities/order-item-printiing.option.entity';
import { PrintingoptionsModule } from './printingoptions/printingoptions.module';
import { PrintingOptions } from './printingoptions/entities/printingoptions.entity';
import { SizeoptionsModule } from './sizeoptions/sizeoptions.module';
import { SizeOption } from './sizeoptions/entities/sizeoptions.entity';
import { ProductcutoptionsModule } from './productcutoptions/productcutoptions.module';
import { ProductCutOption } from './productcutoptions/entity/productcutoptions.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'zof_mrp',
    autoLoadEntities: true, 
    entities: [Client, Product, User, ClientEvent, OrderStatus, Order, OrderItem, OrderItemsPrintingOption, PrintingOptions, SizeOption, ProductCutOption],
    // Make Sync False for Prod
    synchronize: true
  }), ClientsModule, ProductsModule, AuthModule, UserModule, EventsModule, OrderstatusModule, OrderModule, PrintingoptionsModule, SizeoptionsModule, ProductcutoptionsModule],
  controllers: []
})
export class AppModule {}
