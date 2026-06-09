import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductComponentType } from './entities/product-component-type.entity';
import { ProductComponentTypesService } from './product-component-types.service';
import { ProductComponentTypesController } from './product-component-types.controller';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProductComponentType]), AuditModule],
    controllers: [ProductComponentTypesController],
    providers: [ProductComponentTypesService],
    exports: [ProductComponentTypesService],
})
export class ProductComponentTypesModule {}
