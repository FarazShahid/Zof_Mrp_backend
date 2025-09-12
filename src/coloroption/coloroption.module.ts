import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorOptionService } from './coloroption.service';
import { ColorOptionController } from './coloroption.controller';
import { ColorOption } from './_/color-option.entity';
import { AvailableColorOption } from 'src/products/entities/available-color-options.entity';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColorOption, AvailableColorOption]), AuditModule],
  controllers: [ColorOptionController],
  providers: [ColorOptionService],
})
export class ColorOptionModule { }
