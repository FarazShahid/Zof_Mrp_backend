import {
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    BadRequestException,
    Logger,
    UseInterceptors,
} from '@nestjs/common';
import { inventoryTransectionService } from './inventory-transections.service';
import { CreateInventoryTransectionsDto } from './_/inventory-transections.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Inventory Transections', 'inventory-transections')
@UseInterceptors(AuditInterceptor)
export class InventoryTransectionController {

    constructor(private readonly inventoryTransectionService: inventoryTransectionService) { }

    @HasRight(AppRightsEnum.AddInventoryTransactions)
    @Post()
    @ApiBody({ type: CreateInventoryTransectionsDto })
    @HttpCode(HttpStatus.CREATED)
    @CommonApiResponses('Create a new Inventory Transection')
    async create(
        @Body() CreateInventoryTransectionsDto: CreateInventoryTransectionsDto,
        @CurrentUser() user: any
    ) {
        try {
            const data = {
                ...CreateInventoryTransectionsDto
            };
            return await this.inventoryTransectionService.create(data, user.email, user.userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @HasRight(AppRightsEnum.ViewInventoryTransactions)
    @Get()
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get all Inventory Transections')
    async findAll(@CurrentUser() user: any) {
        try {
            return await this.inventoryTransectionService.findAll(user.userId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @HasRight(AppRightsEnum.ViewInventoryTransactions)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get a Inventory Transection by id')
    async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
        try {
            return await this.inventoryTransectionService.findOne(id, user.userId);
        } catch (error) {
            throw error;
        }
    }

    @HasRight(AppRightsEnum.UpdateInventoryTransactions)
    @Put(':id')
    @ApiBody({ type: CreateInventoryTransectionsDto })
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Update an Inventory Transection by id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: any,
        @CurrentUser() user: any
    ) {
        try {
            return await this.inventoryTransectionService.update(id, updateData, user.email, user.userId);
        } catch (error) {
            throw error;
        }
    }

    @HasRight(AppRightsEnum.DeleteInventoryTransactions)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @CommonApiResponses('Delete a Inventory Transection by id')
    async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
        try {
            return await this.inventoryTransectionService.delete(id, user.userId);
        } catch (error) {
            throw error;
        }
    }
}
