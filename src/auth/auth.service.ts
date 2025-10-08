import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { Email: email } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if(!user.isActive){
        throw new UnauthorizedException('User is Inactive');
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user with email: ${email}`);
        throw new UnauthorizedException('Invalid password');
      }

      const { Password: _, ...result } = user;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      const payload = {
        email: user.Email,
        sub: user.Id,
        roleId: user.roleId,
        isActive: user.isActive,
        userId: user.Id
      }; 
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.Id,
          email: user.Email,
          roleId: user.roleId,
          isActive: user.isActive,
        }
      };
    } catch (error) {
      this.logger.error(`Error during login: ${error.message}`, error.stack);
      throw error;
    }
  }
}
