import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

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

  async create(createClientDto: CreateClientDto, userEmail: string) {
    this.logger.log(`Creating client with data: ${JSON.stringify(createClientDto)}, createdBy: ${userEmail}`);
    const client = this.clientRepository.create({
      Name: createClientDto.Name,
      Email: createClientDto.Email,
      POCName: createClientDto?.POCName,
      Phone: createClientDto?.Phone,
      POCEmail: createClientDto?.POCEmail,
      Website: createClientDto?.Website,
      Linkedin: createClientDto?.Linkedin,
      Instagram: createClientDto?.Instagram,
      Country: createClientDto?.Country,
      State: createClientDto?.State,
      City: createClientDto?.City,
      CompleteAddress: createClientDto?.CompleteAddress,
      ClientStatusId: createClientDto?.ClientStatusId,
      CreatedBy: userEmail,
      UpdatedBy: userEmail,
    });
    return await this.clientRepository.save(client);
  }

  async findAll(userId: number) {
    this.logger.log('Finding all clients');
    const assignedClientIds = await this.getClientsForUser(userId);
    const results = await this.clientRepository.find({
      where: assignedClientIds.length ? { Id: In(assignedClientIds) } : {},
      order: { Name: 'ASC' },
    });
    return results;
  }

  async findOne(Id: number, userId: number) {
    this.logger.log(`Finding client with id: ${Id}`);
    const assignedClientIds = await this.getClientsForUser(userId);
    if (assignedClientIds.length && !assignedClientIds.includes(Id)) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    const client = await this.clientRepository.findOneBy({ Id });
    if (!client) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    return client;
  }

  async update(Id: number, updateClientDto: UpdateClientDto, userEmail: string, userId: number) {
    this.logger.log(`Updating client with id: ${Id}, data: ${JSON.stringify(updateClientDto)}, updatedBy: ${userEmail}`);

    // First check if the client exists
    const client = await this.clientRepository.findOneBy({ Id });
    if (!client) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }

    const assignedClientIds = await this.getClientsForUser(userId);
    if (assignedClientIds.length && !assignedClientIds.includes(Id)) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }

    // Create the update data with proper types
    const updateData = {
      Name: updateClientDto.Name,
      Email: updateClientDto.Email,
      POCName: updateClientDto?.POCName,
      Phone: updateClientDto?.Phone,
      POCEmail: updateClientDto?.POCEmail,
      Website: updateClientDto?.Website,
      Linkedin: updateClientDto?.Linkedin,
      Instagram: updateClientDto?.Instagram,
      Country: updateClientDto?.Country,
      State: updateClientDto?.State,
      City: updateClientDto?.City,
      CompleteAddress: updateClientDto?.CompleteAddress,
      ClientStatusId: updateClientDto?.ClientStatusId,
      UpdatedBy: userEmail
    };
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    );

    await this.clientRepository.update(Id, updateData);
    return this.clientRepository.findOneBy({ Id });
  }

  async remove(Id: number, userId: number) {
    this.logger.log(`Removing client with id: ${Id}`);

    const assignedClientIds = await this.getClientsForUser(userId);
    if (assignedClientIds.length && !assignedClientIds.includes(Id)) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    const result = await this.clientRepository.delete(Id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    return { message: 'Client deleted successfully' };
  }
}