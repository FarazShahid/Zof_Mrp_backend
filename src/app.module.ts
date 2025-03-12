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
import { OrderItemDetails } from './orders/entities/order-item-details';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductCategory } from './product-category/entities/product-category.entity';
import { SleeveTypeModule } from './sleeve-type/sleeve-type.module';
import { SleeveType } from './sleeve-type/entities/sleeve-type.entity/sleeve-type.entity';
import { FabricTypeModule } from './fabrictype/fabrictype.module';
import { FabricType } from './fabrictype/_/fabrictype.entity';
import { ColorOptionModule } from './coloroption/coloroption.module';
import { ColorOption } from './coloroption/_/color-option.entity';
import { ProductregionstandardModule } from './productregionstandard/productregionstandard.module';
import { ProductRegionStandard } from './productregionstandard/_/product-region-standard.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'zof_mrp',
      autoLoadEntities: true, 
      entities: [
        Client, 
        Product, 
        User, 
        ClientEvent, 
        OrderStatus, 
        Order, 
        OrderItem, 
        OrderItemsPrintingOption, 
        PrintingOptions, 
        SizeOption, 
        ProductCutOption, 
        OrderItemDetails, 
        ProductCategory, 
        SleeveType, 
        FabricType, 
        ColorOption, 
        ProductRegionStandard
      ],
      // Make Sync False for Prod
      synchronize: process.env.NODE_ENV === 'development'
    }), 
    ClientsModule, 
    ProductsModule, 
    AuthModule, 
    UserModule, 
    EventsModule, 
    OrderstatusModule, 
    OrderModule, 
    PrintingoptionsModule, 
    SizeoptionsModule, 
    ProductcutoptionsModule, 
    ProductCategoryModule, 
    SleeveTypeModule, 
    FabricTypeModule, 
    ColorOptionModule, 
    ProductregionstandardModule
  ],
  controllers: []
})
export class AppModule {}
