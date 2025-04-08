import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
@ControllerAuthProtector('Events', 'events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
  ) { }

  @Post()
  @ApiBody({ type: CreateEventDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new event')
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: any): Promise<any> {
    try {
      const event = await this.eventService.create(createEventDto, user.email);
      return event;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all events')
  async findAll(): Promise<any> {
    try {
      const events = await this.eventService.getAllEvents();
      return events;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get an event by id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const event = await this.eventService.findOne(+id);
      return event;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiBody({ type: CreateEventDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update an event by id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @CurrentUser() user: any): Promise<any> {
    try {
      const event = await this.eventService.update(+id, updateEventDto, user.email);
      return event;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete an event by id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.eventService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}