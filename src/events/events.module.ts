import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEvent } from './entities/clientevent.entity';
import { UserModule } from 'src/users/user.module';
import { Client } from 'src/clients/entities/client.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEvent, Client]),
    UserModule
  ],
  providers: [EventService],
  controllers: [EventController]
})
export class EventsModule {}
