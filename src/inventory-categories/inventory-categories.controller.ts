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
import { InventoryCategoryService } from './inventory-categories.service';
import { CreateInventoryCategoryDto } from './_/create-inventory-categories.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Inventory Categories', 'inventory-categories')
@UseInterceptors(AuditInterceptor)
export class InventoryCategoryController {

  constructor(private readonly InventoryCategoryService: InventoryCategoryService) { }

  @HasRight(AppRightsEnum.AddInventoryCategory)
  @Post()
  @ApiBody({ type: CreateInventoryCategoryDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new Inventory Category')
  async create(
    @Body() CreateInventoryCategoryDto: CreateInventoryCategoryDto,
    @CurrentUser() user: any
  ) {
    try {
      const data = {
        ...CreateInventoryCategoryDto
      };
      return await this.InventoryCategoryService.create(data, user.email);
    } catch (error) {
      throw new BadRequestException(`Failed to create Inventory Category: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewInventoryCategory)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all Inventory Categories')
  async findAll() {
    try {
      return await this.InventoryCategoryService.findAll();
    } catch (error) {
      throw new BadRequestException(`Failed to get Inventory Categories: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewInventoryCategory)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a Inventory Categories by id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventoryCategoryService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateInventoryCategory)
  @Put(':id')
  @ApiBody({ type: CreateInventoryCategoryDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a Inventory Category by id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
    @CurrentUser() user: any
  ) {
    try {
      const data = {
        ...updateData,
        updatedBy: user.email
      };
      return await this.InventoryCategoryService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteInventoryCategory)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a Inventory Category by id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventoryCategoryService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
