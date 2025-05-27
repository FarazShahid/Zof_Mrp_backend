import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClientEvent } from './entities/clientevent.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(ClientEvent)
    private clientEventRepository: Repository<ClientEvent>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createEventDto: CreateEventDto, createdBy: string): Promise<ClientEvent> {
    try {
      const newEvent = this.clientEventRepository.create({
        ...createEventDto,
        ClientId: createEventDto.ClientId ?? null,
        CreatedBy: createdBy,
        UpdatedBy: createdBy
      });

      return await this.clientEventRepository.save(newEvent);
    } catch (error) {
      throw error;
    }
  }

  async getAllEvents(): Promise<ClientEvent[]> {
    try {
      const response = await this.clientEventRepository.find({
        order: {
          CreatedOn: 'DESC'
        }
      });
      const clientIds = response.filter(e => e.ClientId).map(e => e.ClientId);
      const clients = await this.clientRepository.find({
          where: { Id: In(clientIds) },
          withDeleted: true,
        });
      const clientMap = new Map(clients.map(cl => [cl.Id, cl.Name]));
 
      return response.map(e=>({
        Id: e.Id,
        EventName: e.EventName,
        Description: e.Description,
        ClientId: e.ClientId,
        ClientName: clientMap.get(e.ClientId) ?? "N/A",
        CreatedOn: e.CreatedOn,
        CreatedBy: e.CreatedBy,
        UpdatedOn: e.UpdatedOn,
        UpdatedBy: e.UpdatedBy
      }));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const event = await this.clientEventRepository.findOne({ where: { Id: id } });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      const client = await this.clientRepository.findOne({
        where: {
          Id: event.ClientId
        },
        withDeleted: true
      })

      return {
        Id: event.Id,
        EventName: event.EventName,
        Description: event.Description,
        ClientId: event.ClientId,
        ClientName: client?.Name ?? "N/A",
        CreatedOn: event.CreatedOn,
        CreatedBy: event.CreatedBy,
        UpdatedOn: event.UpdatedOn,
        UpdatedBy: event.UpdatedBy
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto, updatedBy: string): Promise<ClientEvent> {
    try {
      const event = await this.findOne(id);

      const updatedEvent = await this.clientEventRepository.save({
        ...event,
        ...updateEventDto,
        UpdatedBy: updatedBy,
        UpdatedOn: new Date(),
      });

      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const event = await this.findOne(id);
      await this.clientEventRepository.remove(event);
    } catch (error) {
      throw error;
    }
  }
}
