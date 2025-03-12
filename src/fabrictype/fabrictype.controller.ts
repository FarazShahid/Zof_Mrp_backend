import { 
  Controller, 
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
  UseGuards
} from '@nestjs/common';
import { FabricTypeService } from './fabrictype.service';
import { CreateFabricTypeDto } from './_/create-fabrictype.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('fabrictype')
@UseGuards(JwtAuthGuard)
export class FabricTypeController {
  private readonly logger = new Logger(FabricTypeController.name);

  constructor(private readonly fabricTypeService: FabricTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createFabricTypeDto: CreateFabricTypeDto,
    @CurrentUser() user: any
  ) {
    this.logger.log(`Creating fabric type: ${JSON.stringify(createFabricTypeDto)}, User: ${JSON.stringify(user)}`);
    try {
      // Add the user's email as createdBy
      const data = {
        ...createFabricTypeDto,
        createdBy: user.email // JWT payload has lowercase 'email'
      };
      
      return await this.fabricTypeService.create(data);
    } catch (error) {
      this.logger.error(`Error creating fabric type: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create fabric type: ${error.message}`);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: any,
    @CurrentUser() user: any
  ) {
    this.logger.log(`Updating fabric type with id: ${id}, data: ${JSON.stringify(updateData)}, User: ${JSON.stringify(user)}`);
    try {
      // Add the user's email as updatedBy
      const data = {
        ...updateData,
        updatedBy: user.email // JWT payload has lowercase 'email'
      };
      
      return await this.fabricTypeService.update(id, data);
    } catch (error) {
      this.logger.error(`Error updating fabric type: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
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
