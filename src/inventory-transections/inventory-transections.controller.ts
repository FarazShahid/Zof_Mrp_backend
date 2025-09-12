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

@ControllerAuthProtector('Inventory Transections', 'inventory-transections')
@UseInterceptors(AuditInterceptor)
export class InventoryTransectionController {

    constructor(private readonly inventoryTransectionService: inventoryTransectionService) { }

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
            return await this.inventoryTransectionService.create(data, user.email);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get all Inventory Transections')
    async findAll() {
        try {
            return await this.inventoryTransectionService.findAll();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get a Inventory Transection by id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.inventoryTransectionService.findOne(id);
        } catch (error) {
            throw error;
        }
    }

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
            return await this.inventoryTransectionService.update(id, updateData, user.email);
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @CommonApiResponses('Delete a Inventory Transection by id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.inventoryTransectionService.delete(id);
        } catch (error) {
            throw error;
        }
    }
}
