import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto, @CurrentUser() user: any) {
    this.logger.log(`Creating client: ${JSON.stringify(createClientDto)}, User: ${JSON.stringify(user)}`);
    return this.clientsService.create(createClientDto, user.email);
  }

  @Get()
  findAll() {
    this.logger.log('Getting all clients');
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Getting client with id: ${id}`);
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: any
  ) {
    this.logger.log(`Updating client with id: ${id}, data: ${JSON.stringify(updateClientDto)}, User: ${JSON.stringify(user)}`);
    return this.clientsService.update(+id, updateClientDto, user.email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log(`Deleting client with id: ${id}`);
    return this.clientsService.remove(+id);
  }
}
