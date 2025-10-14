import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricType } from './_/fabrictype.entity';
import { FabricTypeService } from './fabrictype.service';
import { FabricTypeController } from './fabrictype.controller';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { Product } from 'src/products/entities/product.entity';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([FabricType, ProductCategory, Product]), AuditModule],
  controllers: [FabricTypeController],
  providers: [FabricTypeService],
})
export class FabricTypeModule {}
