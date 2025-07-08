import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventorySubCategories } from './_/inventory-sub-categories.entity';
import { InventorySubCategoryService } from './inventory-sub-categories.service';
import { InventorySubCategoryController } from './inventory-sub-categories.controller';
import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventorySubCategories, InventoryCategories, InventoryItems])],
  controllers: [InventorySubCategoryController],
  providers: [InventorySubCategoryService],
})
export class InventorySubCategoryModule { }
