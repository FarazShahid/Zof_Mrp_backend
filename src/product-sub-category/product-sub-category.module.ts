import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSubCategory } from './entities/product-sub-category.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { ProductSubCategoryService } from './product-sub-category.service';
import { ProductSubCategoryController } from './product-sub-category.controller';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProductSubCategory, ProductCategory]), AuditModule],
    controllers: [ProductSubCategoryController],
    providers: [ProductSubCategoryService],
    exports: [ProductSubCategoryService, TypeOrmModule],
})
export class ProductSubCategoryModule {}
