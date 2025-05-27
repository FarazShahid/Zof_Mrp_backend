import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeMeasurementsService } from './size-measurements.service';
import { SizeMeasurementsController } from './size-measurements.controller';
import { SizeMeasurement } from './entities/size-measurement.entity';
import { ProductCutOption } from 'src/productcutoptions/entity/productcutoptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SizeMeasurement, ProductCutOption])],
  controllers: [SizeMeasurementsController],
  providers: [SizeMeasurementsService],
  exports: [SizeMeasurementsService],
})
export class SizeMeasurementsModule {} 