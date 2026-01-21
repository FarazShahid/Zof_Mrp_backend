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
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'yourAccessSecretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    console.log('JWT Payload:', payload);
    return { userId: payload.sub, email: payload.email, roleId: payload.roleId, isActive: payload.isActive };
  }
}
