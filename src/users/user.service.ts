import { Injectable, ConflictException, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(data: any): Promise<User> {
    const { Email, Password, createdBy } = data;

    this.logger.log(`Creating user with email: ${Email}`);
    
    // Validate required fields for creation
    if (!Email) {
      throw new BadRequestException(['Email is required']);
    }
    
    if (!Password) {
      throw new BadRequestException(['Password is required for new users']);
    }
    
    const existingUser = await this.userRepository.findOne({ where: { Email } });
    if (existingUser) {
      throw new ConflictException(['Email already in use']);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const newUser = this.userRepository.create({
      Email,
      Password: hashedPassword,
      CreatedOn: String(new Date()),
      CreatedBy: createdBy || 'system',
      UpdatedOn: String(new Date()),
      UpdatedBy: createdBy || 'system',
      isActive: data.isActive !== undefined ? data.isActive : true
    });

    const savedUser = await this.userRepository.save(newUser);
    
    // Create a new object with password masked
    const userWithoutPassword = { ...savedUser };
    userWithoutPassword.Password = '';
    
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<User[]> {
    this.logger.log('Finding all users');
    const users = await this.userRepository.find();
    
    // Mask passwords
    return users.map(user => {
      const userWithoutPassword = { ...user };
      userWithoutPassword.Password = '';
      return userWithoutPassword;
    });
  }

  async getUserById(id: number): Promise<User> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userRepository.findOne({ where: { Id: id } });
    
    if (!user) {
      throw new NotFoundException([`User with ID ${id} not found`]);
    }

    // Mask password
    const userWithoutPassword = { ...user };
    userWithoutPassword.Password = '';
    return userWithoutPassword;
  }

  async updateUser(id: number, data: any): Promise<User> {
    const { Email, Password, isActive, updatedBy } = data;
    
    this.logger.log(`Updating user with id: ${id}, data: ${JSON.stringify({
      ...data,
      Password: Password ? '********' : undefined // Mask password in logs
    })}`);
    
    try {
      const user = await this.userRepository.findOne({ where: { Id: id } });

      if (!user) {
        throw new NotFoundException([`User with ID ${id} not found`]);
      }

      // Validate email format if provided
      if (Email) {
        // Check if email is valid
        if (!this.isValidEmail(Email)) {
          throw new BadRequestException([`Email: Please provide a valid email address`]);
        }
        
        // Check if email is already in use by another user
        const existingUser = await this.userRepository.findOne({ 
          where: { Email }
        });
        
        if (existingUser && existingUser.Id !== id) {
          throw new ConflictException([`Email ${Email} is already in use by another user`]);
        }
        
        user.Email = Email;
      }
      
      // Update password if provided (optional)
      if (Password && Password.trim() !== '') {
        this.logger.log(`Updating password for user with id: ${id}`);
        const saltRounds = 10;
        user.Password = await bcrypt.hash(Password, saltRounds);
      } else {
        this.logger.log(`No password update for user with id: ${id}`);
      }
      
      // Update isActive if provided
      if (isActive !== undefined) {
        user.isActive = isActive;
      }
      
      // Always update these fields
      user.UpdatedOn = String(new Date());
      user.UpdatedBy = updatedBy || 'system';

      const savedUser = await this.userRepository.save(user);
      
      // Mask password
      const userWithoutPassword = { ...savedUser };
      userWithoutPassword.Password = '';
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      
      // Re-throw the error with the original message to preserve the specific error type
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      // For any other errors, throw a BadRequestException with the error message
      throw new BadRequestException([`Failed to update user: ${error.message}`]);
    }
  }

  // Helper method to validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
