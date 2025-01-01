import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { Email, Password, isActive } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { Email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const newUser = this.userRepository.create({
      Email,
      Password: hashedPassword,
      isActive: isActive ?? true,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
        ...savedUser,
        Password: ''
    };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users; 
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { Id: id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      ...user,
      Password: ''
    }; 
  }

  async updateUser(id: number, updateUserDto: CreateUserDto): Promise<User> {
    const { Email, Password, isActive } = updateUserDto;
    const user = await this.userRepository.findOne({ where: { Id: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (Password) {
      const saltRounds = 10;
      user.Password = await bcrypt.hash(Password, saltRounds);
    }
    if (Email) {
      user.Email = Email;
    }
    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { Id: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }

  async getUserEmailById(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { Id: userId } });
    return user ? user.Email : null;
  }

}
