import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEvent } from './entities/clientevent.entity';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEvent]),
    UserModule
  ],
  providers: [EventService],
  controllers: [EventController]
})
export class EventsModule {}
