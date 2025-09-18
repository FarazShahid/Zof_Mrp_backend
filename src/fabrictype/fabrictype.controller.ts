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
  Logger,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { FabricTypeService } from './fabrictype.service';
import { CreateFabricTypeDto } from './_/create-fabrictype.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';

@ControllerAuthProtector('Fabric Types', 'fabrictype')
@UseInterceptors(AuditInterceptor)
export class FabricTypeController {
  private readonly logger = new Logger(FabricTypeController.name);

  constructor(private readonly fabricTypeService: FabricTypeService) {}

  @Post()
  @ApiBody({ type: CreateFabricTypeDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new fabric type')
  async create(
    @Body() createFabricTypeDto: CreateFabricTypeDto,
    @CurrentUser() user: any
  ) {
    this.logger.log(`Creating fabric type: ${JSON.stringify(createFabricTypeDto)}, User: ${JSON.stringify(user)}`);
    try {
      const data = {
        ...createFabricTypeDto,
        createdBy: user.email 
      };
      
      return await this.fabricTypeService.create(data);
    } catch (error) {
      this.logger.error(`Error creating fabric type: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create fabric type: ${error.message}`);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all fabric types')
  async findAll() {
    this.logger.log('Getting all fabric types');
    try {
      return await this.fabricTypeService.findAll();
    } catch (error) {
      this.logger.error(`Error getting fabric types: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get fabric types: ${error.message}`);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a fabric type by id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Getting fabric type with id: ${id}`);
    try {
      return await this.fabricTypeService.findOne(id);
    } catch (error) {
      this.logger.error(`Error getting fabric type: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  @ApiBody({ type: CreateFabricTypeDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a fabric type by id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: any,
    @CurrentUser() user: any
  ) {
    this.logger.log(`Updating fabric type with id: ${id}, data: ${JSON.stringify(updateData)}, User: ${JSON.stringify(user)}`);
    try {
      const data = {
        ...updateData,
        updatedBy: user.email
      };
      return await this.fabricTypeService.update(id, data);
    } catch (error) {
      this.logger.error(`Error updating fabric type: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a fabric type by id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Deleting fabric type with id: ${id}`);
    try {
      return await this.fabricTypeService.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting fabric type: ${error.message}`, error.stack);
      throw error;
    }
  }
}
