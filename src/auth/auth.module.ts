import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuditModule } from 'src/audit-logs/audit.module';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET') || 'yourAccessSecretKey',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    AuditModule
  ],
  providers: [AuthService, JwtStrategy, ScheduledTasksService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
