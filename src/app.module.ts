import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { EventsModule } from './events/events.module';
import { OrderstatusModule } from './orderstatus/orderstatus.module';
import { OrderModule } from './orders/orders.module';
import { PrintingoptionsModule } from './printingoptions/printingoptions.module';
import { SizeoptionsModule } from './sizeoptions/sizeoptions.module';
import { ProductcutoptionsModule } from './productcutoptions/productcutoptions.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { SleeveTypeModule } from './sleeve-type/sleeve-type.module';
import { FabricTypeModule } from './fabrictype/fabrictype.module';
import { ColorOptionModule } from './coloroption/coloroption.module';
import { ProductregionstandardModule } from './productregionstandard/productregionstandard.module';
import { SizeMeasurementsModule } from './size-measurements/size-measurements.module';
import { InventoryCategoryModule } from './inventory-categories/inventory-categories.module';
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
      entities: [],
      // Make Sync False for Prod
      synchronize: false
    }),
    AuthModule,
    ClientsModule,
    ColorOptionModule,
    EventsModule,
    FabricTypeModule,
    InventoryCategoryModule,
    OrderModule,
    OrderstatusModule,
    PrintingoptionsModule,
    ProductCategoryModule,
    ProductcutoptionsModule,
    ProductregionstandardModule,
    ProductsModule,
    SizeMeasurementsModule,
    SizeoptionsModule,
    SleeveTypeModule,
    UserModule
  ],
  controllers: []
})
export class AppModule { }
