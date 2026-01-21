import { Get, Post, Param, Body, Put, Delete, Logger, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { HasRight } from 'src/auth/has-right-guard';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { ValidatedUser } from '../auth/jwt.strategy';

@ControllerAuthProtector('Users', 'users')
@UseInterceptors(AuditInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @HasRight(AppRightsEnum.AddUsers)
  @Post()
  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new user')
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: ValidatedUser): Promise<User> {
    try {
      this.logger.log(`Creating user: ${JSON.stringify({
        ...createUserDto,
        Password: '********'
      })}, User: ${JSON.stringify(currentUser)}`);

      const data = {
        ...createUserDto,
        createdBy: currentUser.email
      };

      return await this.userService.createUser(data);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewUsers)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all users')
  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Getting all users');
      return await this.userService.getAllUsers();
    } catch (error) {
      this.logger.error(`Error getting users: ${error.message}`, error.stack);
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewUsers)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a user by id')
  async findOne(@Param('id') id: number): Promise<User> {
    try {
      this.logger.log(`Getting user with id: ${id}`);
      return await this.userService.getUserById(id);
    } catch (error) {
      this.logger.error(`Error getting user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateUsers)
  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a user by id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: ValidatedUser
  ): Promise<User> {
    try {
      this.logger.log(`Updating user with id: ${id}, data: ${JSON.stringify({
        ...updateUserDto,
        Password: updateUserDto.Password ? '********' : undefined
      })}, User: ${JSON.stringify(currentUser)}`);

      const data = {
        ...updateUserDto,
        updatedBy: currentUser.email
      };

      return await this.userService.updateUser(id, data);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteUsers)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a user by id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      this.logger.log(`Deleting user with id: ${id}`);
      return await this.userService.deleteUser(id);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
