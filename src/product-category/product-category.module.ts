import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory]), AuditModule],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
  exports: [TypeOrmModule],
})
export class ProductCategoryModule {}
