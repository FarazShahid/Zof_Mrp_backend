import { Controller, Post, Body, Logger, HttpCode, HttpStatus, UseInterceptors, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/responses/login.response.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from './dto/refresh-token.dto';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Request } from 'express';
import { ValidatedUser } from './jwt.strategy';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(AuditInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // Security: Strict rate limiting on login endpoint (5 attempts per minute)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ type: LoginResponseDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Login a user')
  async login(@Body() body: { email: string; password: string; token: string }, @Req() req: Request) {
    try {
      await this.authService.verify(body.token);
      const user = await this.authService.validateUser(body.email, body.password);
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip || (req.socket?.remoteAddress) || 'Unknown IP';
      const result = await this.authService.login(user, deviceInfo, ipAddress, req.headers['user-agent']);
      return result;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Security: Rate limiting on refresh endpoint (10 attempts per minute)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ type: RefreshTokenResponseDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Refresh access token using refresh token')
  async refresh(@Body() body: RefreshTokenDto, @Req() req: Request) {
    try {
      const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
      const ipAddress = req.ip || (req.socket?.remoteAddress) || 'Unknown IP';
      const result = await this.authService.refreshTokens(
        body.refresh_token,
        deviceInfo,
        ipAddress,
        req.headers['user-agent']
      );
      return result;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('logout')
  @ApiBody({ type: RefreshTokenDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Logout user and revoke refresh token')
  async logout(@Body() body: RefreshTokenDto) {
    try {
      const result = await this.authService.logout(body.refresh_token);
      return result;
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Logout user from all devices')
  async logoutAll(@CurrentUser() user: ValidatedUser) {
    try {
      const result = await this.authService.logoutAll(user.userId);
      return result;
    } catch (error) {
      this.logger.error(`Logout all failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
