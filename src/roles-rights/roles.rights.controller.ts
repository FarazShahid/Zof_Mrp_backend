import {
    Get,
    Post,
    Param,
    Body,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { RolesRightsService } from './roles.rights.service';
import { CurrentUserName, CurrentUserRoleId } from 'src/auth/current-user.decorator';  
import { AppRightsEnum } from './roles-rights.enum';
import { CreateRoleWithRightsDto } from './RolesRights.dto';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Roles & Rights', 'roles-rights')
export class RolesRightsController {
    constructor(private readonly rolesRightsService: RolesRightsService) { }

    @HasRight(AppRightsEnum.AddAdminSettings)
    @Post()
    @ApiBody({ type: CreateRoleWithRightsDto })
    @HttpCode(HttpStatus.CREATED)
    @CommonApiResponses('Create role and assign rights')
    async createRoleWithRights(
        @Body() dto: CreateRoleWithRightsDto,
        @CurrentUserName() currentUser: string
    ) {
        try {
            const response = await this.rolesRightsService.createRoleWithRights(dto, currentUser);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @HasRight(AppRightsEnum.ViewAdminSettings)
    @Get()
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get All roles rights')
    async getAllRoleRights() {
        try {
            const response = await this.rolesRightsService.getAllRolesRights();
            return response;
        } catch (error) {
            throw error;
        }
    }

    @HasRight(AppRightsEnum.ViewAdminSettings)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get rights of a role by role id')
    async getRights(@Param('id') id: number) {
        try {
            const response = await this.rolesRightsService.getRoleWithRightsById(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @HasRight(AppRightsEnum.UpdateAdminSettings)
    @Put(':id')
    @ApiBody({ type: CreateRoleWithRightsDto })
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Update rights of a role')
    async updateRights(
        @Param('id') id: number,
        @Body() dto: CreateRoleWithRightsDto,
        @CurrentUserName() currentUser: string
    ) {
        try {
            const response = await this.rolesRightsService.updateRoleWithRights(id, dto.name, dto.rightIds, currentUser);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @HasRight(AppRightsEnum.DeleteAdminSettings)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @CommonApiResponses('Delete all rights of a role')
    async deleteRights(@Param('id') id: number) {
        try {
            const response = await this.rolesRightsService.deleteRoleWithRights(id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Post("assigned-rights")
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get all Assigned rights')
    async getAllAssignedRights(@CurrentUserRoleId() CurrentUserRoleId: any): Promise<any> {
        try {
            const response = await this.rolesRightsService.getAssignedRights(CurrentUserRoleId);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
