import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEvent } from './entities/clientevent.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(ClientEvent)
    private clientEventRepository: Repository<ClientEvent>,
  ) {}

  async create(createEventDto: CreateEventDto, createdBy: string): Promise<ClientEvent> {
    try {
      const newEvent = this.clientEventRepository.create({
        ...createEventDto,
        CreatedBy: createdBy,
        UpdatedBy: createdBy
      });

      return await this.clientEventRepository.save(newEvent);
    } catch (error) {
      this.logger.error(`Error creating event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAllEvents(): Promise<ClientEvent[]> {
    try {
      return await this.clientEventRepository.find({
        order: {
          CreatedOn: 'DESC'
        }
      });
    } catch (error) {
      this.logger.error(`Error fetching events: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<ClientEvent> {
    try {
      const event = await this.clientEventRepository.findOne({ where: { Id: id } });
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      this.logger.error(`Error finding event: ${error.message}`, error.stack);
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
      this.logger.error(`Error updating event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const event = await this.findOne(id);
      await this.clientEventRepository.remove(event);
    } catch (error) {
      this.logger.error(`Error removing event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
