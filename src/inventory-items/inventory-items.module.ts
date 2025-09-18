import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemController } from './inventory-items.controller';
import { InventoryItems } from './_/inventory-items.entity';
import { inventoryItemService } from './inventory-items.service';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
import { InventoryTransactions } from 'src/inventory-transections/_/inventory-transections.entity';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItems, InventorySuppliers, InventorySubCategories, InventoryCategories, UnitOfMeasures, InventoryTransactions]), AuditModule],
  controllers: [InventoryItemController],
  providers: [inventoryItemService],
})
export class InventoryItemsModule { }