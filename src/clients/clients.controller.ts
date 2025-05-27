import { Get, Post, Body, Param, Delete, Logger,  HttpCode, 
  HttpStatus, BadRequestException,
  Put, } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiBody } from '@nestjs/swagger';
import { CommonApiResponses, CommonApiResponseModal } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';

@ControllerAuthProtector('Clients', 'clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateClientDto })
  @CommonApiResponseModal(CreateClientDto)
  @CommonApiResponses('Create a new client')
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
  @CommonApiResponseModal([CreateClientDto])
  @CommonApiResponses('Get all clients')
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
  @CommonApiResponses('Get a client by id')
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
  @ApiBody({ type: CreateClientDto })
  @CommonApiResponses('Update a client by id')
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
  @CommonApiResponses('Delete a client by id')
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
