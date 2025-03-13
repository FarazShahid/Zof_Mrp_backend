import { Controller, Get, Post, Body, Param, Delete, UseGuards, Logger,  HttpCode, 
  HttpStatus, BadRequestException,
  Put, } from '@nestjs/common';
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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto, @CurrentUser() user: any) {
    this.logger.log(`Creating client: ${JSON.stringify(createClientDto)}, User: ${JSON.stringify(user)}`);
    try {
      return this.clientsService.create(createClientDto, user.email);
    } catch (error) {
      this.logger.error(`Error creating client: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create client: ${error.message}`);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    this.logger.log('Getting all clients');
    try {
      return this.clientsService.findAll();
    } catch (error) {
      this.logger.error(`Error getting clients: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get clients: ${error.message}`);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    this.logger.log(`Getting client with id: ${id}`);
    try {
      return this.clientsService.findOne(+id);
    } catch (error) {
      this.logger.error(`Error getting client: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get client: ${error.message}`);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string, 
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: any
  ) {
    this.logger.log(`Updating client with id: ${id}, data: ${JSON.stringify(updateClientDto)}, User: ${JSON.stringify(user)}`);
    try {
      return this.clientsService.update(+id, updateClientDto, user.email);
    } catch (error) {
      this.logger.error(`Error updating client: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to update client: ${error.message}`);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.logger.log(`Deleting client with id: ${id}`);
    try {
      return this.clientsService.remove(+id);
    } catch (error) {
      this.logger.error(`Error deleting client: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to delete client: ${error.message}`);
    }
  }
}
