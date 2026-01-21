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
import { InventoryUnitOfMeasuresService } from './inventory-unit-measures.service';
import { CreateInventoryUnitMeasuresDto } from './_/create-inventory-unit-measures.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Unit of Measures', 'unit-measures')
@UseInterceptors(AuditInterceptor)
export class UnitofMeasuresController {

  constructor(private readonly InventoryUnitOfMeasuresService: InventoryUnitOfMeasuresService) { }

  @HasRight(AppRightsEnum.AddUnitofMeasure)
  @Post()
  @ApiBody({ type: CreateInventoryUnitMeasuresDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new Unit of Measures')
  async create(
    @Body() createDto: CreateInventoryUnitMeasuresDto,
    @CurrentUser() user: ValidatedUser
  ) {
    try {
      const data = {
        ...createDto
      };
      return await this.InventoryUnitOfMeasuresService.create(data, user.email);
    } catch (error) {
      throw new BadRequestException(`Failed to create Unit of Measures: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewUnitofMeasure)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all Unit of Measures')
  async findAll() {
    try {
      return await this.InventoryUnitOfMeasuresService.findAll();
    } catch (error) {
      throw new BadRequestException(`Failed to get Unit of Measures: ${error.message}`);
    }
  }

  @HasRight(AppRightsEnum.ViewUnitofMeasure)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a Unit of Measures by id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventoryUnitOfMeasuresService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateUnitofMeasure)
  @Put(':id')
  @ApiBody({ type: CreateInventoryUnitMeasuresDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a Unit of Measures by id')
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
      return await this.InventoryUnitOfMeasuresService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteUnitofMeasure)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a Unit of Measures by id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.InventoryUnitOfMeasuresService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
