import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClientEvent } from './entities/clientevent.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(ClientEvent)
    private clientEventRepository: Repository<ClientEvent>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

   private async getClientsForUser(userId: number): Promise<number[]> {

    const user = await this.userRepository.findOne({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const assignedClientIds: number[] = user.assignedClients || [];

    if (!assignedClientIds.length) {
      return [];
    }
    
    // Filter out any invalid values (NaN, null, undefined) and ensure all are valid numbers
    const validClientIds = assignedClientIds.filter(id => {
      return id !== null && id !== undefined && !isNaN(Number(id)) && Number.isFinite(Number(id));
    }).map(id => Number(id));

    return validClientIds;
  }

  async create(createEventDto: CreateEventDto, createdBy: string, userId: number): Promise<ClientEvent> {
    try {
        const assignedClientIds = await this.getClientsForUser(userId);
        if (createEventDto.ClientId && !assignedClientIds.includes(createEventDto.ClientId)) {
          throw new NotFoundException(`Client with ID ${createEventDto.ClientId} not found or not assigned to the user`);
        }
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

  async getAllEvents(userId: number): Promise<ClientEvent[]> {
    try {
      const assignedClientIds = await this.getClientsForUser(userId);
      const response = await this.clientEventRepository.find({
        where: assignedClientIds.length > 0 ? { ClientId: In(assignedClientIds) } : {},
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

  async findOne(id: number, userId: number): Promise<any> {
    try {
      const assignedClientIds = await this.getClientsForUser(userId);
      const event = await this.clientEventRepository.findOne({
        where: {
          Id: id,
          ...(assignedClientIds.length > 0 ? { ClientId: In(assignedClientIds) } : {}),
        },
      });

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

  async update(id: number, updateEventDto: UpdateEventDto, updatedBy: string, userId: number): Promise<ClientEvent> {
    try {
      const event = await this.findOne(id, userId);

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

  async remove(id: number, userId: number): Promise<void> {
    try {
      const event = await this.findOne(id, userId);
      await this.clientEventRepository.remove(event);
    } catch (error) {
      throw error;
    }
  }
}
