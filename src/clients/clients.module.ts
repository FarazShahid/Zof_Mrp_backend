import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AuditModule } from 'src/audit-logs/audit.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, User]),
 AuditModule,
],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
