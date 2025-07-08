import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryCategories } from './_/inventory-categories.entity';
import { InventoryCategoryService } from './inventory-categories.service';
import { InventoryCategoryController } from './inventory-categories.controller';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryCategories, InventorySubCategories, InventoryItems])],
  controllers: [InventoryCategoryController],
  providers: [InventoryCategoryService],
})
export class InventoryCategoryModule { }
