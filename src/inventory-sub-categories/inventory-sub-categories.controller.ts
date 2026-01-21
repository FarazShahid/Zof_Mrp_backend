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
import { InventorySubCategoryService } from './inventory-sub-categories.service';
import { CreateInventorySubCategoryDto } from './_/inventory-sub-categories.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Inventory Sub Categories', 'inventory-sub-categories')
@UseInterceptors(AuditInterceptor)
export class InventorySubCategoryController {

  constructor(private readonly InventorySubCategoryService: InventorySubCategoryService) { }

  @HasRight(AppRightsEnum.AddInventorySubCategory)
  @Post()
  @ApiBody({ type: CreateInventorySubCategoryDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new Inventory Sub Category')
  async create(
    @Body() CreateInventorySubCategoryDto: CreateInventorySubCategoryDto,
    @CurrentUser() user: ValidatedUser
  ) {
    try {
      const data = {
        ...CreateInventorySubCategoryDto
      };
      return await this.InventorySubCategoryService.create(data, user.email);
    } catch (error) {
      throw new BadRequestException(`Failed to create Inventory Sub Category: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewInventorySubCategory)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all Inventory Categories')
  async findAll() {
    try {
      return await this.InventorySubCategoryService.findAll();
    } catch (error) {
      throw new BadRequestException(`Failed to get Inventory Categories: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewInventorySubCategory)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a Inventory Categories by id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventorySubCategoryService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateInventorySubCategory)
  @Put(':id')
  @ApiBody({ type: CreateInventorySubCategoryDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a Inventory Sub Category by id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
    @CurrentUser() user: ValidatedUser
  ) {
    try {
      const data = {
        ...updateData,
        updatedBy: user.email
      };
      return await this.InventorySubCategoryService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteInventorySubCategory)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a Inventory Sub Category by id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventorySubCategoryService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
