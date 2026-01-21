import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';
@ControllerAuthProtector('Events', 'events')
@UseInterceptors(AuditInterceptor)
export class EventController {
  constructor(
    private readonly eventService: EventService,
  ) { }

  @HasRight(AppRightsEnum.AddEvents)
  @Post()
  @ApiBody({ type: CreateEventDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new event')
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: ValidatedUser): Promise<any> {
    try {
      const event = await this.eventService.create(createEventDto, user.email, user.userId);
      return event;
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewEvents)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all events')
  async findAll(@CurrentUser() user: ValidatedUser): Promise<any> {
    try {
      const events = await this.eventService.getAllEvents(user.userId);
      return events;
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewEvents)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get an event by id')
  async findOne(@Param('id') id: string, @CurrentUser() user: ValidatedUser): Promise<any> {
    try {
      const event = await this.eventService.findOne(+id, user.userId);
      return event;
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateEvents)
  @Put(':id')
  @ApiBody({ type: CreateEventDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update an event by id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @CurrentUser() user: ValidatedUser): Promise<any> {
    try {
      const event = await this.eventService.update(+id, updateEventDto, user.email, user.userId);
      return event;
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteEvents)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete an event by id')
  async remove(@Param('id') id: string, @CurrentUser() user: ValidatedUser): Promise<void> {
    try {
      await this.eventService.remove(+id, user.userId);
    } catch (error) {
      throw error;
    }
  }
}