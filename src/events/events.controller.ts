import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EventService } from './events.service';
import { UserService } from 'src/users/user.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) { }

  @Post()
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
