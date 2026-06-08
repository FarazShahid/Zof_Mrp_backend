import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDocumentType } from './entities/order-document-type.entity';
import { OrderDocumentTypesService } from './order-document-types.service';
import { OrderDocumentTypesController } from './order-document-types.controller';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDocumentType]), AuditModule],
  controllers: [OrderDocumentTypesController],
  providers: [OrderDocumentTypesService],
  exports: [OrderDocumentTypesService],
})
export class OrderDocumentTypesModule {}
