import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransectionController } from './inventory-transections.controller';
import { inventoryTransectionService } from './inventory-transections.service';
import { InventoryTransactions } from './_/inventory-transections.entity';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
@Module({
  imports: [TypeOrmModule.forFeature([InventoryTransactions, InventoryItems, UnitOfMeasures])],
  controllers: [InventoryTransectionController],
  providers: [inventoryTransectionService],
})
export class InventoryTransectionsModule { }