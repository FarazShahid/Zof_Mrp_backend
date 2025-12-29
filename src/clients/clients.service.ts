import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/product.entity';
import { ClientEvent } from 'src/events/entities/clientevent.entity';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ClientEvent)
    private readonly clientEventRepository: Repository<ClientEvent>,
  ) { }

    private async getClientsForUser(userId: number): Promise<number[] | null> {

    const user = await this.userRepository.findOne({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.roleId === 1) {
      return null;
    }

    const assignedClientIds: number[] = user.assignedClients || [];

    if (!assignedClientIds.length) {
      return [];
    }
    
    const validClientIds = assignedClientIds.filter(id => {
      return id !== null && id !== undefined && !isNaN(Number(id)) && Number.isFinite(Number(id));
    }).map(id => Number(id));

    return validClientIds;
  }

  private async checkDuplicateEmails(email?: string, pocEmail?: string,  excludeClientId?: number): Promise<void> {
    const errors: string[] = [];

    // Check if Email and POCEmail are the same (case-insensitive)
    if (email && pocEmail && email.trim().toLowerCase() === pocEmail.trim().toLowerCase()) {
      errors.push('Email and POC Email cannot be the same');
    }

    if (email && email.trim()) {
      const trimmedEmail = email.trim().toLowerCase();
      
      // Check if Email conflicts with another client's Email
      const emailQueryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .where('LOWER(client.Email) = :trimmedEmail', { trimmedEmail });

      if (excludeClientId) {
        emailQueryBuilder.andWhere('client.Id != :excludeId', { excludeId: excludeClientId });
      }

      const existingClientWithEmail = await emailQueryBuilder.getOne();
      if (existingClientWithEmail) {
        errors.push(`Email '${email}' is already associated with another client`);
      }

      // Check if Email conflicts with another client's POCEmail
      const pocEmailQueryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .where('LOWER(client.POCEmail) = :trimmedEmail', { trimmedEmail })
        .andWhere('client.POCEmail IS NOT NULL');

      if (excludeClientId) {
        pocEmailQueryBuilder.andWhere('client.Id != :excludeId', { excludeId: excludeClientId });
      }

      const existingClientWithPOCEmailMatch = await pocEmailQueryBuilder.getOne();
      if (existingClientWithPOCEmailMatch) {
        errors.push(`Email '${email}' is already associated with another client as POC Email`);
      }
    }

    if (pocEmail && pocEmail.trim()) {
      const trimmedPOCEmail = pocEmail.trim().toLowerCase();
      
      // Check if POCEmail conflicts with another client's POCEmail
      const pocEmailQueryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .where('LOWER(client.POCEmail) = :trimmedPOCEmail', { trimmedPOCEmail })
        .andWhere('client.POCEmail IS NOT NULL');

      if (excludeClientId) {
        pocEmailQueryBuilder.andWhere('client.Id != :excludeId', { excludeId: excludeClientId });
      }

      const existingClientWithPOCEmail = await pocEmailQueryBuilder.getOne();
      if (existingClientWithPOCEmail) {
        errors.push(`POC Email '${pocEmail}' is already associated with another client`);
      }

      // Check if POCEmail conflicts with another client's Email
      const emailQueryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .where('LOWER(client.Email) = :trimmedPOCEmail', { trimmedPOCEmail });

      if (excludeClientId) {
        emailQueryBuilder.andWhere('client.Id != :excludeId', { excludeId: excludeClientId });
      }

      const existingClientWithEmailMatch = await emailQueryBuilder.getOne();
      if (existingClientWithEmailMatch) {
        errors.push(`POC Email '${pocEmail}' is already associated with another client as Email`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join('; '));
    }
  }

  private async checkDuplicatePhone(phone?: string, excludeClientId?: number): Promise<void> {
    if (!phone || !phone.trim()) {
      return;
    }

    const trimmedPhone = phone.trim();
    
    const phoneQueryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .where('client.Phone = :trimmedPhone', { trimmedPhone })
      .andWhere('client.Phone IS NOT NULL');

    if (excludeClientId) {
      phoneQueryBuilder.andWhere('client.Id != :excludeId', { excludeId: excludeClientId });
    }

    const existingClientWithPhone = await phoneQueryBuilder.getOne();
    if (existingClientWithPhone) {
      throw new BadRequestException(`Phone '${phone}' is already associated with another client`);
    }
  }

  async create(createClientDto: CreateClientDto, userEmail: string, userId: number, roleId: number) {
    // Check for duplicate emails
    await this.checkDuplicateEmails(createClientDto.Email, createClientDto.POCEmail);
    
    // Check for duplicate phone
    await this.checkDuplicatePhone(createClientDto.Phone);
    
    
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
    const savedClient = await this.clientRepository.save(client);
  
    if (roleId !== 1) {
      const user = await this.userRepository.findOne({
        where: { Id: userId },
      });

      if (user) {
        const assignedClientIds: number[] = user.assignedClients || [];
        
        if (!assignedClientIds.includes(savedClient.Id)) {
          assignedClientIds.push(savedClient.Id);
          user.assignedClients = assignedClientIds;
          await this.userRepository.save(user);
          this.logger.log(`Auto-assigned client ${savedClient.Id} to user ${userId}`);
        }
      }
    } else {
      this.logger.log(`Super admin created client ${savedClient.Id} - no assignment needed`);
    }

    return savedClient;
  }

  async findAll(userId: number) {
    this.logger.log('Finding all clients');
    const assignedClientIds = await this.getClientsForUser(userId);
    
    const whereCondition = assignedClientIds === null 
      ? {} 
      : assignedClientIds.length > 0 
        ? { Id: In(assignedClientIds) } 
        : { Id: -1 }; 
    
    const results = await this.clientRepository.find({
      where: whereCondition,
      order: { Name: 'ASC' },
    });
    return results;
  }

  async findOne(Id: number, userId: number) {
    this.logger.log(`Finding client with id: ${Id}`);
    const assignedClientIds = await this.getClientsForUser(userId);
    
    if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(Id)) {
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

    const client = await this.clientRepository.findOneBy({ Id });
    if (!client) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }

    const assignedClientIds = await this.getClientsForUser(userId);
   
    if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(Id)) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }

    // Only check for duplicate emails if they are actually being changed
    const currentEmail = client.Email?.trim().toLowerCase() || '';
    const currentPOCEmail = client.POCEmail?.trim().toLowerCase() || '';
    
    const emailToCheck = updateClientDto.Email !== undefined && 
      updateClientDto.Email?.trim().toLowerCase() !== currentEmail
      ? updateClientDto.Email 
      : undefined;
    
    const pocEmailToCheck = updateClientDto.POCEmail !== undefined && 
      updateClientDto.POCEmail?.trim().toLowerCase() !== currentPOCEmail
      ? updateClientDto.POCEmail 
      : undefined;

    if (emailToCheck !== undefined || pocEmailToCheck !== undefined) {
      await this.checkDuplicateEmails(emailToCheck, pocEmailToCheck, Id);
    }

    // Only check for duplicate phone if it is actually being changed
    const currentPhone = client.Phone?.trim() || '';
    const phoneToCheck = updateClientDto.Phone !== undefined && 
      updateClientDto.Phone?.trim() !== currentPhone
      ? updateClientDto.Phone
      : undefined;

    if (phoneToCheck !== undefined) {
      await this.checkDuplicatePhone(phoneToCheck, Id);
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
   
    if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(Id)) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }

    // Check if client exists
    const client = await this.clientRepository.findOneBy({ Id });
    if (!client) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }

    // Check for associated records
    const [hasEvents, hasProjects, hasProducts, hasOrders] = await Promise.all([
      this.clientEventRepository.findOne({ where: { ClientId: Id } }),
      this.projectRepository.findOne({ where: { ClientId: Id } }),
      this.productRepository.findOne({ where: { ClientId: Id } }),
      this.orderRepository.findOne({ where: { ClientId: Id } }),
    ]);

    const errorMessages: string[] = [];
    if (hasEvents) {
      errorMessages.push('events');
    }
    if (hasProjects) {
      errorMessages.push('projects');
    }
    if (hasProducts) {
      errorMessages.push('products');
    }
    if (hasOrders) {
      errorMessages.push('orders');
    }

    if (errorMessages.length > 0) {
      const errorMessage = `Cannot delete client. This client is associated with the: ${errorMessages.join(', ')}. Please remove these associations before deleting the client.`;
      throw new BadRequestException(errorMessage);
    }

    const result = await this.clientRepository.delete(Id);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${Id} not found`);
    }
    return { message: 'Client deleted successfully' };
  }
}