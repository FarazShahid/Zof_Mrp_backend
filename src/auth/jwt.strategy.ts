import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  email: string;
  sub: number;
  roleId: number | null;
  isActive: boolean;
  userId: number;
}

export interface ValidatedUser {
  userId: number;
  email: string;
  roleId: number | null;
  isActive: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new Error(
        'CRITICAL SECURITY ERROR: JWT_ACCESS_SECRET environment variable is not configured. ' +
        'Application cannot start without a valid JWT secret.'
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    // Security: Removed console.log that was leaking JWT payload
    // JWT payload should never be logged in production
    return { userId: payload.sub, email: payload.email, roleId: payload.roleId, isActive: payload.isActive };
  }
}
