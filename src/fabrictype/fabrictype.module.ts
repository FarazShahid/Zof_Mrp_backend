import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricType } from './_/fabrictype.entity';
import { FabricTypeService } from './fabrictype.service';
import { FabricTypeController } from './fabrictype.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FabricType])],
  controllers: [FabricTypeController],
  providers: [FabricTypeService],
})
export class FabricTypeModule {}
