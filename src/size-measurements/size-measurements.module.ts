import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeMeasurementsService } from './size-measurements.service';
import { SizeMeasurementsController } from './size-measurements.controller';
import { SizeMeasurement } from './entities/size-measurement.entity';
import { ProductCutOption } from 'src/productcutoptions/entity/productcutoptions.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { AuditModule } from 'src/audit-logs/audit.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SizeMeasurement, ProductCutOption, ProductCategory, User]), AuditModule],
  controllers: [SizeMeasurementsController],
  providers: [SizeMeasurementsService],
  exports: [SizeMeasurementsService],
})
export class SizeMeasurementsModule { } 