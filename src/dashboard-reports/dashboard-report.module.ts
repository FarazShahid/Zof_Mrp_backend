import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardReportController } from './dashboard-reports.controller';
import { DashboardReportService } from './dashboard-report.service';
import { Order } from '../orders/entities/orders.entity';
import { Product } from '../products/entities/product.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { Client } from '../clients/entities/client.entity';
import { OrderStatus } from '../orderstatus/entities/orderstatus.entity';
import { InventoryItems } from '../inventory-items/_/inventory-items.entity';
import { User } from '../users/entities/user.entity';
import { AuditModule } from 'src/audit-logs/audit.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            Product,
            Shipment,
            Client,
            OrderStatus,
            InventoryItems,
            User,
        ]),
        AuditModule,
    ],
    controllers: [DashboardReportController],
    providers: [DashboardReportService],
    exports: [DashboardReportService],
})
export class DashboardReportModule { }