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
import { inventoryItemService } from './inventory-items.service';
import { CreateInventoryItemDto } from './_/create-items-categories.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { UpdateInventoryItemDto } from './_/update-inventory-items.dto';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Inventory Items', 'inventory-items')
@UseInterceptors(AuditInterceptor)
export class InventoryItemController {

  constructor(private readonly inventoryItemService: inventoryItemService) { }

  @HasRight(AppRightsEnum.AddInventoryItems)
  @Post()
  @ApiBody({ type: CreateInventoryItemDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new Inventory Item')
  async create(
    @Body() CreateInventoryItemDto: CreateInventoryItemDto,
    @CurrentUser() user: any
  ) {
    try {
      const data = {
        ...CreateInventoryItemDto
      };
      return await this.inventoryItemService.create(data, user.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @HasRight(AppRightsEnum.ViewInventoryItems)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all Inventory Items')
  async findAll() {
    try {
      return await this.inventoryItemService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @HasRight(AppRightsEnum.ViewInventoryItems)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a Inventory Item by id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.inventoryItemService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateInventoryItems)
  @Put(':id')
  @ApiBody({ type: UpdateInventoryItemDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a Inventory Item by id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
    @CurrentUser() user: any
  ) {
    try {
      const data: UpdateInventoryItemDto = {
        ...updateData,
        updatedBy: user.email
      };
      return await this.inventoryItemService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteInventoryItems)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a Inventory Item by id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.inventoryItemService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
