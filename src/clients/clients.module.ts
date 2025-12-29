import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AuditModule } from 'src/audit-logs/audit.module';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/product.entity';
import { ClientEvent } from 'src/events/entities/clientevent.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User, Project, Order, Product, ClientEvent]),
 AuditModule,
],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
