import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, CurrentUserData } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'yourAccessSecretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserData> {
    console.log('JWT Payload:', payload);
    return { userId: payload.sub, email: payload.email, roleId: payload.roleId, isActive: payload.isActive };
  }
}
