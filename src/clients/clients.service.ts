import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto, userEmail: string) {
    this.logger.log(`Creating client with data: ${JSON.stringify(createClientDto)}, createdBy: ${userEmail}`);
    return this.clientRepository.save({
      ...createClientDto,
      CreatedOn: String(new Date()),
      CreatedBy: userEmail,
    });
  }

  findAll() {
    this.logger.log('Finding all clients');
    return this.clientRepository.find();
  }

  findOne(Id: number) {
    this.logger.log(`Finding client with id: ${Id}`);
    return this.clientRepository.findOneBy({ Id });
  }

  async update(Id: number, updateClientDto: UpdateClientDto, userEmail: string) {
    this.logger.log(`Updating client with id: ${Id}, data: ${JSON.stringify(updateClientDto)}, updatedBy: ${userEmail}`);
    
    // First check if the client exists
    const client = await this.clientRepository.findOneBy({ Id });
    if (!client) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    
    // Add updatedBy and updatedOn
    const updateData = {
      ...updateClientDto,
      UpdatedOn: String(new Date()),
      UpdatedBy: userEmail,
    };
    
    await this.clientRepository.update(Id, updateData);
    return this.clientRepository.findOneBy({ Id });
  }

  async remove(Id: number) {
    this.logger.log(`Removing client with id: ${Id}`);
    const result = await this.clientRepository.delete(Id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    return { message: 'Client deleted successfully' };
  }
}
