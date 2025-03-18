import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeMeasurementsService } from './size-measurements.service';
import { SizeMeasurementsController } from './size-measurements.controller';
import { SizeMeasurement } from './entities/size-measurement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SizeMeasurement])],
  controllers: [SizeMeasurementsController],
  providers: [SizeMeasurementsService],
  exports: [SizeMeasurementsService],
})
export class SizeMeasurementsModule {} 