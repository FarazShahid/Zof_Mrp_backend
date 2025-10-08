import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRightsController } from './roles.rights.controller';
import { RolesRightsService } from './roles.rights.service';
import { AppRights, AppRole, AppRoleRight } from './roles.rights.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AppRights, AppRole, AppRoleRight])],
    providers: [RolesRightsService],
    controllers: [RolesRightsController]
})
export class RolesRightsModule { }