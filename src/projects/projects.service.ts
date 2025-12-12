import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async getClientsForUser(userId: number): Promise<number[] | null> {
    const user = await this.userRepository.findOne({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Super admin (roleId === 1) can access all clients
    if (user.roleId === 1) {
      return null;
    }

    const assignedClientIds: number[] = user.assignedClients || [];

    if (!assignedClientIds.length) {
      return [];
    }

    const validClientIds = assignedClientIds
      .filter((id) => {
        return id !== null && id !== undefined && !isNaN(Number(id)) && Number.isFinite(Number(id));
      })
      .map((id) => Number(id));

    return validClientIds;
  }

  async create(createProjectDto: CreateProjectDto, userEmail: string, userId: number, roleId: number): Promise<Project> {
    this.logger.log(`Creating project: ${JSON.stringify(createProjectDto)}, User: ${userEmail}`);

    // Validate client exists
    const client = await this.clientRepository.findOne({
      where: { Id: createProjectDto.ClientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${createProjectDto.ClientId} not found`);
    }

    // Authorization: Super admin can create for any client, regular users only for assigned clients
    if (roleId !== 1) {
      const assignedClientIds = await this.getClientsForUser(userId);
      
      if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(createProjectDto.ClientId)) {
        throw new BadRequestException(
          `You are not assigned to the client with ID ${createProjectDto.ClientId}`,
        );
      }
    }

    const project = this.projectRepository.create({
      Name: createProjectDto.Name,
      ClientId: createProjectDto.ClientId,
      Description: createProjectDto.Description,
      CreatedBy: userEmail,
      UpdatedBy: userEmail,
    });

    const savedProject = await this.projectRepository.save(project);
    this.logger.log(`Project created successfully with ID: ${savedProject.Id}`);
    
    return savedProject;
  }

  async findAll(userId: number): Promise<Project[]> {
    this.logger.log('Finding all projects');
    
    const assignedClientIds = await this.getClientsForUser(userId);

    const whereCondition =
      assignedClientIds === null
        ? {}
        : assignedClientIds.length > 0
          ? { ClientId: In(assignedClientIds) }
          : { ClientId: -1 }; // No assigned clients, return empty

    const projects = await this.projectRepository.find({
      where: whereCondition,
      relations: ['client'],
      order: { Name: 'ASC' },
    });

    return projects;
  }

  async findOne(id: number, userId: number): Promise<Project> {
    this.logger.log(`Finding project with id: ${id}`);

    const project = await this.projectRepository.findOne({
      where: { Id: id },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Authorization check
    const assignedClientIds = await this.getClientsForUser(userId);
    
    if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(project.ClientId)) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, userEmail: string, userId: number, roleId: number): Promise<Project> {
    this.logger.log(`Updating project with id: ${id}, data: ${JSON.stringify(updateProjectDto)}`);

    const project = await this.projectRepository.findOne({
      where: { Id: id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Authorization check
    if (roleId !== 1) {
      const assignedClientIds = await this.getClientsForUser(userId);
      
      if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(project.ClientId)) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
    }

    const updateData: any = {
      UpdatedBy: userEmail,
    };

    if (updateProjectDto.Name !== undefined) {
      updateData.Name = updateProjectDto.Name;
    }
    if (updateProjectDto.Description !== undefined) {
      updateData.Description = updateProjectDto.Description;
    }
    if (updateProjectDto.isArchived !== undefined) {
      updateData.isArchived = updateProjectDto.isArchived;
    }

    await this.projectRepository.update(id, updateData);
    
    return this.projectRepository.findOne({
      where: { Id: id },
      relations: ['client'],
    });
  }

  async remove(id: number, userId: number, roleId: number): Promise<{ message: string }> {
    this.logger.log(`Removing project with id: ${id}`);

    const project = await this.projectRepository.findOne({
      where: { Id: id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Authorization check
    if (roleId !== 1) {
      const assignedClientIds = await this.getClientsForUser(userId);
      
      if (assignedClientIds !== null && assignedClientIds.length > 0 && !assignedClientIds.includes(project.ClientId)) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
    }

    const result = await this.projectRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return { message: 'Project deleted successfully' };
  }
}

