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

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'zof_mrp',
    entities: [Client, Product, User, ClientEvent],
    // Make Sync False for Prod
    synchronize: true
  }), ClientsModule, ProductsModule, AuthModule, UserModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
