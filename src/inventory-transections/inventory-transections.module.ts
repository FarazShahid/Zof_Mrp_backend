import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryTransectionController } from './inventory-transections.controller';
import { inventoryTransectionService } from './inventory-transections.service';
import { InventoryTransactions } from './_/inventory-transections.entity';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { AuditModule } from 'src/audit-logs/audit.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryTransactions,
      InventoryItems,
      UnitOfMeasures,
      Client,
      Order,
      InventorySuppliers
    ]),
    AuditModule
  ],
  controllers: [InventoryTransectionController],
  providers: [inventoryTransectionService],
})
export class InventoryTransectionsModule {}