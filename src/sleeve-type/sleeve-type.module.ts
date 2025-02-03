import { Module } from '@nestjs/common';
import { SleeveTypeService } from './sleeve-type.service';
import { SleeveTypeController } from './sleeve-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SleeveType } from './entities/sleeve-type.entity/sleeve-type.entity';
import { ProductCategoryModule } from 'src/product-category/product-category.module';

@Module({
    imports: [TypeOrmModule.forFeature([SleeveType]),
    ProductCategoryModule],
  
  providers: [SleeveTypeService],
  controllers: [SleeveTypeController]
})
export class SleeveTypeModule {}
