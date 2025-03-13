import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Logger, BadRequestException, HttpCode, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() currentUser: any): Promise<User> {
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

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Getting all users');
      return await this.userService.getAllUsers();
    } catch (error) {
      this.logger.error(`Error getting users: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number): Promise<User> {
    try {
      this.logger.log(`Getting user with id: ${id}`);
      return await this.userService.getUserById(id);
    } catch (error) {
      this.logger.error(`Error getting user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
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
