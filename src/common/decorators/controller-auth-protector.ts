import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';

export const ControllerAuthProtector = (ApiTag: string, controllerName: string) => applyDecorators(
    ApiTags(ApiTag),
    Controller(controllerName),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('JWT-auth')
)