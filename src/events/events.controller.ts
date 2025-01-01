import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EventService } from './events.service';
import { UserService } from 'src/users/user.service';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async findAll(@Request() req): Promise<any> {
    const events = await this.eventService.getAllEvents();
    
    const eventsWithEmails = await Promise.all(events.map(async (event) => {
      const createdByEmail = await this.userService.getUserEmailById(event.CreatedBy);
      const updatedByEmail = await this.userService.getUserEmailById(event.UpdatedBy);
      return {
        ...event,
        CreatedBy: createdByEmail,
        UpdatedBy: updatedByEmail,
      };
    }));

    return eventsWithEmails;
  }
}
