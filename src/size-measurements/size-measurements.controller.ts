import { Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { SizeMeasurementsService } from './size-measurements.service';
import { CreateSizeMeasurementDto } from './dto/create-size-measurement.dto';
import { UpdateSizeMeasurementDto } from './dto/update-size-measurement.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { ApiQuery } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { HasRight } from 'src/auth/has-right-guard';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';

@ControllerAuthProtector('Size Measurements', 'size-measurements')
@UseInterceptors(AuditInterceptor)
export class SizeMeasurementsController {
  constructor(private readonly sizeMeasurementsService: SizeMeasurementsService) { }

  @HasRight(AppRightsEnum.AddProductDefinition)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateSizeMeasurementDto })
  @CommonApiResponses('Create a new size measurement')
  create(@Body() createSizeMeasurementDto: CreateSizeMeasurementDto, @CurrentUser() user: any) {
    try {
      return this.sizeMeasurementsService.create(createSizeMeasurementDto, user.email, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all size measurements')
  @ApiQuery({ name: 'CutOptionId', required: false, description: 'Filter by Cut Option' })
  @ApiQuery({ name: 'ClientId', required: false, description: 'Filter by Client Id' })
  @ApiQuery({ name: 'SizeOptionId', required: false, description: 'Filter by Size Option Id' })
  @ApiQuery({ name: 'ProductCategoryId', required: false, description: 'Filter by Product Category Id' })
  findAll(
    @CurrentUser() user: any,
    @Query('CutOptionId') CutOptionId?: number,
    @Query('ClientId') ClientId?: number,
    @Query('SizeOptionId') SizeOptionId?: number,
    @Query('ProductCategoryId') ProductCategoryId?: number,
  ) {
    try {
      return this.sizeMeasurementsService.findAll(CutOptionId, SizeOptionId, ClientId, ProductCategoryId, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a size measurement by id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    try {
      return this.sizeMeasurementsService.findOne(+id, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateProductDefinition)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a size measurement by id')
  update(
    @Param('id') id: string,
    @Body() updateSizeMeasurementDto: UpdateSizeMeasurementDto,
    @CurrentUser() user: any,
  ) {
    try {
      return this.sizeMeasurementsService.update(+id, updateSizeMeasurementDto, user.email, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteProductDefinition)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a size measurement by id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    try {
      return this.sizeMeasurementsService.remove(+id, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get('by-client/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get All measurement by client id')
  async findAllByClientId(@Param('id') id: string) {
    try {
      return await this.sizeMeasurementsService.findAllByClientId(+id);
    } catch (error) {
      throw error;
    }
  }
} 