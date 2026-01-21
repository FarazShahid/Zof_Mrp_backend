import { Injectable, UnauthorizedException, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import axios from 'axios';

export interface UserWithoutPassword extends Omit<User, 'Password'> {}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: number;
    email: string;
    roleId: number | null;
    isActive: boolean;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async verify(token: string): Promise<boolean> {
    if (this.secretKey) {
      if (!token) throw new BadRequestException('No reCAPTCHA token provided');

      const url = `https://www.google.com/recaptcha/api/siteverify`;
      try {
        const response = await axios.post(
          url,
          null,
          {
            params: {
              secret: this.secretKey,
              response: token,
            },
          },
        );

        const data = response.data;

        if (!data.success) {
          throw new BadRequestException('reCAPTCHA verification failed');
        }
        return data.success;
      } catch (error) {
        throw new BadRequestException('Failed to verify reCAPTCHA');
      }
    }
  }

  async validateUser(email: string, password: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.userRepository.findOne({ where: { Email: email } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if(!user.isActive){
        throw new UnauthorizedException('User is Inactive. Please contact admin for activation.');
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

  async login(user: UserWithoutPassword, deviceInfo?: string, ipAddress?: string, userAgent?: string): Promise<LoginResponse> {
    try {
      const payload = {
        email: user.Email,
        sub: user.Id,
        roleId: user.roleId,
        isActive: user.isActive,
        userId: user.Id
      };

      // Generate access token (15 minutes)
      const accessToken = this.jwtService.sign(payload);

      // Generate refresh token (7 days)
      const refreshToken = this.generateRefreshToken();
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      // Store refresh token in database
      const refreshTokenEntity = this.refreshTokenRepository.create({
        tokenHash: refreshTokenHash,
        userId: user.Id,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastUsedAt: new Date(),
      });

      await this.refreshTokenRepository.save(refreshTokenEntity);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 900, // 15 minutes in seconds
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

  async refreshTokens(refreshToken: string, deviceInfo?: string, ipAddress?: string, userAgent?: string): Promise<RefreshTokenResponse> {
    try {
      // Find refresh token in database
      const refreshTokens = await this.refreshTokenRepository.find({
        where: { isRevoked: false },
        relations: ['user']
      });

      let validRefreshToken: RefreshToken | null = null;
      for (const token of refreshTokens) {
        const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isMatch) {
          validRefreshToken = token;
          break;
        }
      }

      if (!validRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if token is expired
      if (validRefreshToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Check if user is still active
      if (!validRefreshToken.user.isActive) {
        throw new UnauthorizedException('User is inactive');
      }

      // Generate new access token
      const payload = {
        email: validRefreshToken.user.Email,
        sub: validRefreshToken.user.Id,
        roleId: validRefreshToken.user.roleId,
        isActive: validRefreshToken.user.isActive,
        userId: validRefreshToken.user.Id
      };

      const newAccessToken = this.jwtService.sign(payload);

      // Generate new refresh token (token rotation)
      const newRefreshToken = this.generateRefreshToken();
      const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

      // Revoke old refresh token
      validRefreshToken.isRevoked = true;
      validRefreshToken.revokedAt = new Date();
      await this.refreshTokenRepository.save(validRefreshToken);

      // Store new refresh token
      const newRefreshTokenEntity = this.refreshTokenRepository.create({
        tokenHash: newRefreshTokenHash,
        userId: validRefreshToken.user.Id,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        lastUsedAt: new Date(),
      });

      await this.refreshTokenRepository.save(newRefreshTokenEntity);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: 900, // 15 minutes in seconds
      };
    } catch (error) {
      this.logger.error(`Error during token refresh: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      // Find and revoke refresh token
      const refreshTokens = await this.refreshTokenRepository.find({
        where: { isRevoked: false }
      });

      for (const token of refreshTokens) {
        const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
        if (isMatch) {
          token.isRevoked = true;
          token.revokedAt = new Date();
          await this.refreshTokenRepository.save(token);
          break;
        }
      }

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error(`Error during logout: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logoutAll(userId: number) {
    try {
      // Revoke all refresh tokens for user
      await this.refreshTokenRepository.update(
        { userId, isRevoked: false },
        { isRevoked: true, revokedAt: new Date() }
      );

      return { message: 'All sessions logged out successfully' };
    } catch (error) {
      this.logger.error(`Error during logout all: ${error.message}`, error.stack);
      throw error;
    }
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async cleanupExpiredTokens() {
    try {
      // Remove expired refresh tokens
      const result = await this.refreshTokenRepository
        .createQueryBuilder()
        .delete()
        .where('expiresAt < :now', { now: new Date() })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} expired refresh tokens`);
      return result.affected;
    } catch (error) {
      this.logger.error(`Error during token cleanup: ${error.message}`, error.stack);
      throw error;
    }
  }
}
