import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryCategories } from './_/inventory-categories.entity';
import { InventoryCategoryService } from './inventory-categories.service';
import { InventoryCategoryController } from './inventory-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryCategories])],
  controllers: [InventoryCategoryController],
  providers: [InventoryCategoryService],
})
export class InventoryCategoryModule { }
