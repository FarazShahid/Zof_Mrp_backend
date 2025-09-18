import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfMeasures } from './_/inventory-unit-measures.entity';
import { InventoryUnitOfMeasuresService } from './inventory-unit-measures.service';
import { UnitofMeasuresController } from './inventory-unit-measures.controller';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([UnitOfMeasures]), AuditModule],
  controllers: [UnitofMeasuresController],
  providers: [InventoryUnitOfMeasuresService],
})
export class InventoryUnitOfMeasuresModule { }
