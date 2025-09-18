import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEvent } from './entities/clientevent.entity';
import { UserModule } from 'src/users/user.module';
import { Client } from 'src/clients/entities/client.entity';
import { AuditModule } from 'src/audit-logs/audit.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEvent, Client]),
    UserModule,
    AuditModule
  ],
  providers: [EventService],
  controllers: [EventController]
})
export class EventsModule {}
