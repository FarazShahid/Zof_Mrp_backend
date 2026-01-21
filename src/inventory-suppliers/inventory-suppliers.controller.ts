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
  UseInterceptors,
} from '@nestjs/common';
import { InventorySupplierService } from './inventory-suppliers.service';
import { CreateInventorySuppliersDto } from './_/create-inventory-suppliers.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';
import { CurrentUserData } from 'src/auth/auth.types';

@ControllerAuthProtector('Inventory Supplier', 'inventory-suppliers')
@UseInterceptors(AuditInterceptor)
export class InventorySupplierController {

  constructor(private readonly InventorySupplierService: InventorySupplierService) { }

  @HasRight(AppRightsEnum.AddSuppliers)
  @Post()
  @ApiBody({ type: CreateInventorySuppliersDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new Inventory Supplier')
  async create(
    @Body() CreateInventorySuppliersDto: CreateInventorySuppliersDto,
    @CurrentUser() user: CurrentUserData
  ) {
    try {
      const data = {
        ...CreateInventorySuppliersDto
      };
      return await this.InventorySupplierService.create(data, user.email);
    } catch (error) {
      throw new BadRequestException(`Failed to create Inventory Supplier: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewSuppliers)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all Inventory Suppliers')
  async findAll() {
    try {
      return await this.InventorySupplierService.findAll();
    } catch (error) {
      throw new BadRequestException(`Failed to get Inventory Suppliers: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewSuppliers)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a Inventory Supplier by id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventorySupplierService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateSuppliers)
  @Put(':id')
  @ApiBody({ type: CreateInventorySuppliersDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a Inventory Supplier by id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: CreateInventorySuppliersDto,
    @CurrentUser() user: CurrentUserData
  ) {
    try {
      const data = {
        ...updateData,
        updatedBy: user.email
      };
      return await this.InventorySupplierService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteSuppliers)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a Inventory Supplier by id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventorySupplierService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
