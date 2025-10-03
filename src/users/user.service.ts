import { Injectable, ConflictException, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AppRole } from 'src/roles-rights/roles.rights.entity';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AppRole)
    private roleRepository: Repository<AppRole>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  async createUser(data: any): Promise<any> {
    const { Email, firstName, lastName, Password, createdBy, roleId, assignedClients } = data;

    this.logger.log(`Creating user with email: ${Email}`);

    const existingUser = await this.userRepository.findOne({ where: { Email } });
    if (existingUser) {
      throw new ConflictException(['Email already in use']);
    }

    let roleName = null;

    if (roleId) {
      const existingRole = await this.roleRepository.findOne({ where: { id: roleId } });
      if (!existingRole) {
        throw new NotFoundException([`Role with ID ${roleId} not found`]);
      }
      roleName = existingRole.name;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    let clientIds: number[] = [];
    if (assignedClients && Array.isArray(assignedClients)) {
      clientIds = assignedClients.map((c) => c.clientId);
    }

    const newUser = this.userRepository.create({
      Email,
      firstName,
      lastName,
      Password: hashedPassword,
      roleId: roleId || null,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
      isActive: data.isActive !== undefined ? data.isActive : true,
      assignedClients: clientIds,
    });

    const savedUser = await this.userRepository.save(newUser);

    return { ...savedUser, roleId: roleId, roleName: roleName, Password: '****' };
  }

  async getAllUsers(): Promise<any[]> {
    this.logger.log('Finding all users');
    const users = await this.userRepository.find();
    const roles = await this.roleRepository.find();
    const clients = await this.clientRepo.find();

    const roleMap = new Map<number, string>();
    roles.forEach(role => roleMap.set(role.id, role.name));

    const clientMap = new Map<number, string>();
    clients.forEach(client => clientMap.set(client.Id, client.Name));

    return users.map(user => {
      const userWithoutPassword = { ...user, roleName: roleMap.get(user.roleId) || null, assignedClients: [] };
      userWithoutPassword.Password = '****';
      userWithoutPassword.assignedClients = (user.assignedClients || [])
        .map(clientId => ({
          clientId,
          name: clientMap.get(clientId) || null
        }))
        .filter(c => c.name);
      return userWithoutPassword;
    });
  }

  async getUserById(id: number): Promise<any> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { Id: id } });

    if (!user) {
      throw new NotFoundException([`User with ID ${id} not found`]);
    }

    const role = user.roleId
      ? await this.roleRepository.findOne({ where: { id: user.roleId } })
      : null;

    let assignedClients: { clientId: number; name: string }[] = [];
    if (user.assignedClients?.length) {
      const clients = await this.clientRepo.findBy({ Id: In(user.assignedClients) });
      assignedClients = clients.map(c => ({ clientId: c.Id, name: c.Name }));
    }

    const userWithoutPassword = {
      ...user,
      roleName: role ? role.name : null,
      assignedClients
    };

    // Mask password
    userWithoutPassword.Password = '****';
    return userWithoutPassword;
  }

  async updateUser(id: number, data: any): Promise<User> {
    const { Email, firstName, lastName, Password, isActive, updatedBy, assignedClients } = data;
    
    this.logger.log(`Updating user with id: ${id}, data: ${JSON.stringify({
      ...data,
      Password: Password ? '********' : undefined
    })}`);

    try {
      const user = await this.userRepository.findOne({ where: { Id: id } });

      if (!user) {
        throw new NotFoundException([`User with ID ${id} not found`]);
      }

      const role = await this.roleRepository.findOne({ where: { id: user.roleId } });
      const roleMap = new Map<number, string>();
      if (role) {
        roleMap.set(role.id, role.name);
      }

      if (Email) {
        const existingUser = await this.userRepository.findOne({
          where: { Email }
        });
        if (existingUser && existingUser.Id !== id) {
          throw new ConflictException([`Email ${Email} is already in use by another user`]);
        }

        user.Email = Email;
      }

      if (Password && Password.trim() !== '****') {
        this.logger.log(`Updating password for user with id: ${id}`);
        const saltRounds = 10;
        user.Password = await bcrypt.hash(Password, saltRounds);
      } else {
        this.logger.log(`No password update for user with id: ${id}`);
      }

      if (isActive !== undefined) {
        user.isActive = isActive;
      }

      if (data.roleId !== undefined) {
        if (data.roleId === null) {
          user.roleId = null;
        } else {
          const existingRole = await this.roleRepository.findOne({ where: { id: data.roleId } });
          if (!existingRole) {
            throw new NotFoundException([`Role with ID ${data.roleId} not found`]);
          }
          user.roleId = existingRole.id;
        }
      }
      let validClientIds: number[] = [];
      if (Array.isArray(assignedClients)) {
        validClientIds = (await this.clientRepo.findBy({ Id: In(assignedClients.map(c => c.clientId)) }))
          .map(c => c.Id);

        const invalidIds = assignedClients.filter(cId => !validClientIds.includes(cId.clientId));
        if (invalidIds.length > 0) {
          throw new BadRequestException([`Invalid client IDs: ${invalidIds.join(', ')}`]);
        }

        user.assignedClients = validClientIds;
      }

      user.UpdatedBy = updatedBy || 'system';
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      this.logger.log(`${user.UpdatedOn}`);

      const savedUser = await this.userRepository.save(user);
      
      const userWithoutPassword = { ...savedUser };
      userWithoutPassword.Password = '****';
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      throw new BadRequestException([`Failed to update user: ${error.message}`]);
    }
  }

  async deleteUser(id: number): Promise<void> {
    this.logger.log(`Deleting user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { Id: id } });

    if (!user) {
      throw new NotFoundException([`User with ID ${id} not found`]);
    }

    await this.userRepository.delete(id);
  }

  async getUserEmailById(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { Id: userId } });
    return user ? user.Email : null;
  }
}
