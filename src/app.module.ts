import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { InventorySubCategoryModule } from './inventory-sub-categories/inventory-sub-categories.module';
import { InventorySupplierModule } from './inventory-suppliers/inventory-suppliers.module';
import { InventoryItemsModule } from './inventory-items/inventory-items.module';
import { InventoryTransectionsModule } from './inventory-transections/inventory-transections.module';
import { InventoryUnitOfMeasuresModule } from './inventory-unit-measures/inventory-unit-measures.module';
import { MediaHandlersModule } from './media-handlers/media-handlers.module';
import { ShipmentCarrierModule } from './shipment-carrier/shipment-carrier.module';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD') === '""' ? '' : configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [],
        // Make Sync False for Prod
        synchronize: configService.get('false'),
        logging: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        extra: {
          connectionLimit: 10
        }
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ClientsModule,
    ColorOptionModule,
    EventsModule,
    FabricTypeModule,
    InventoryCategoryModule,
    InventorySubCategoryModule,
    InventorySupplierModule,
    InventoryUnitOfMeasuresModule,
    InventoryItemsModule,
    InventoryTransectionsModule,
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
    UserModule,
    MediaHandlersModule,
    ShipmentCarrierModule,
    ShipmentModule
  ],
  controllers: []
})
export class AppModule { }
