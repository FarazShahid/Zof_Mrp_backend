import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventorySuppliers } from './_/inventory-suppliers.entity';
import { InventorySupplierController } from './inventory-suppliers.controller';
import { InventorySupplierService } from './inventory-suppliers.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventorySuppliers])],
  controllers: [InventorySupplierController],
  providers: [InventorySupplierService],
})
export class InventorySupplierModule { }
