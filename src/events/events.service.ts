import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEvent } from './entities/clientevent.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(ClientEvent)
    private clientEventRepository: Repository<ClientEvent>,
  ) {}

  async getAllEvents(): Promise<ClientEvent[]> {
    return await this.clientEventRepository.find();
  }
}
