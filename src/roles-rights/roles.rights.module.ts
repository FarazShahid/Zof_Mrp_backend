import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRightsController } from './roles.rights.controller';
import { RolesRightsService } from './roles.rights.service';
import { AppRights, AppRole, AppRoleRight } from './roles.rights.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AppRights, AppRole, AppRoleRight, User])],
    providers: [RolesRightsService],
    controllers: [RolesRightsController]
})
export class RolesRightsModule { }