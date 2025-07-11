import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ProductPrintingOptions } from './entities/product-printing-options.entity';
import { PrintingOptions } from 'src/printingoptions/entities/printingoptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductPrintingOptions, Client])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
