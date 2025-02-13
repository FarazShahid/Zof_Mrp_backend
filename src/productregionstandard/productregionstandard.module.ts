import { Module } from '@nestjs/common';
import { ProductRegionStandardController } from './productregionstandard.controller';
import { ProductRegionStandardService } from './productregionstandard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRegionStandard } from './_/product-region-standard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRegionStandard])],
  controllers: [ProductRegionStandardController],
  providers: [ProductRegionStandardService]
})
export class ProductregionstandardModule {}
