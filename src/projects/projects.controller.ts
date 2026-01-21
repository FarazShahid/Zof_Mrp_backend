import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Put,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { ApiBody } from '@nestjs/swagger';
import { CommonApiResponses, CommonApiResponseModal } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { HasRight } from 'src/auth/has-right-guard';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { ApiQuery } from '@nestjs/swagger';

@ControllerAuthProtector('Projects', 'projects')
@UseInterceptors(AuditInterceptor)
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @HasRight(AppRightsEnum.AddClients) // Using AddClients right for now, can be updated when project-specific rights are added
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateProjectDto })
  @CommonApiResponseModal(CreateProjectDto)
  @CommonApiResponses('Create a new project')
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: ValidatedUser) {
    this.logger.log(`Creating project: ${JSON.stringify(createProjectDto)}, User: ${JSON.stringify(user)}`);
    try {
      return this.projectsService.create(createProjectDto, user.email, user.userId, user.roleId);
    } catch (error) {
      this.logger.error(`Error creating project: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create project: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewClients) // Using ViewClients right for now
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponseModal([CreateProjectDto])
  @CommonApiResponses('Get all projects')
  @ApiQuery({ name: 'clientId', required: false, type: Number, description: 'Client ID to filter projects', example: 1 })
  findAll(@CurrentUser() user: ValidatedUser, @Query('clientId') clientId?: number) {
    this.logger.log('Getting all projects');
    try {
      return this.projectsService.findAll(user.userId, clientId);
    } catch (error) {
      this.logger.error(`Error getting projects: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get projects: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewClients) // Using ViewClients right for now
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a project by id')
  findOne(@Param('id') id: string, @CurrentUser() user: ValidatedUser) {
    this.logger.log(`Getting project with id: ${id}`);
    try {
      return this.projectsService.findOne(+id, user.userId);
    } catch (error) {
      this.logger.error(`Error getting project: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get project: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.UpdateClients) // Using UpdateClients right for now
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: UpdateProjectDto })
  @CommonApiResponses('Update a project by id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: ValidatedUser
  ) {
    this.logger.log(`Updating project with id: ${id}, data: ${JSON.stringify(updateProjectDto)}, User: ${JSON.stringify(user)}`);
    try {
      return this.projectsService.update(+id, updateProjectDto, user.email, user.userId, user.roleId);
    } catch (error) {
      this.logger.error(`Error updating project: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to update project: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.DeleteClients) // Using DeleteClients right for now
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a project by id')
  remove(@Param('id') id: string, @CurrentUser() user: ValidatedUser) {
    this.logger.log(`Deleting project with id: ${id}`);
    try {
      return this.projectsService.remove(+id, user.userId, user.roleId);
    } catch (error) {
      this.logger.error(`Error deleting project: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to delete project: ${error.message}`);
    }
  }
}

