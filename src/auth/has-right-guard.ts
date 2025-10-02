import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';

export const HAS_RIGHT_KEY = 'rightId';

// ✅ Custom decorator
export const HasRight = (rightId: number) => {
  return applyDecorators(
    SetMetadata(HAS_RIGHT_KEY, rightId),
    UseGuards(HasRightGuard),
  );
};

@Injectable()
export class HasRightGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1️⃣ Get required right from decorator metadata
    const rightId = this.reflector.get<number>(
      HAS_RIGHT_KEY,
      context.getHandler(),
    );

    // If no right required, allow access
    if (!rightId) {
      return true;
    }

    // 2️⃣ Extract user from request (assuming JWT strategy populates request.user)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roleId) {
      throw new ForbiddenException('Unauthorized');
    }

    // 3️⃣ Optimized check: directly test existence instead of loading all rows
    const result = await this.dataSource.query(
      `
      SELECT 1
      FROM app_roles_rights
      WHERE roleId = ? AND rightId = ? AND deletedOn IS NULL
      LIMIT 1
      `,
      [user.roleId, rightId],
    );

    if (result.length === 0) {
      throw new ForbiddenException('You are not authorized to perform this action.');
    }

    return true;
  }
}
