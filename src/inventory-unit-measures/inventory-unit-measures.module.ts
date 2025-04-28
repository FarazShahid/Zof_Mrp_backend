import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfMeasures } from './_/inventory-unit-measures.entity';
import { InventoryUnitOfMeasuresService } from './inventory-unit-measures.service';
import { UnitofMeasuresController } from './inventory-unit-measures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnitOfMeasures])],
  controllers: [UnitofMeasuresController],
  providers: [InventoryUnitOfMeasuresService],
})
export class InventoryUnitOfMeasuresModule { }
