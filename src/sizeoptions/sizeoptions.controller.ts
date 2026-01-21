import { Body, Delete, Get, Param, Post, Put, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { SizeoptionsService } from './sizeoptions.service';
import { CreateSizeOptionDto } from './dto/create-sizeoptions.dto';
import { SizeOption } from './entities/sizeoptions.entity';
import { UpdateSizeOptionDto } from './dto/update-sizeoptions.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Size Options', 'sizeoptions')
@UseInterceptors(AuditInterceptor)
export class SizeoptionsController {
  constructor(private readonly sizeoptionsService: SizeoptionsService) { }

  @HasRight(AppRightsEnum.AddProductDefinition)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new size option')
  async create(@Body() CreateSizeOptionDto: CreateSizeOptionDto, @CurrentUser() currentUser: ValidatedUser): Promise<SizeOption> {
    try {
      return this.sizeoptionsService.create(CreateSizeOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all size options')
  async findAll() {
    try {
      return this.sizeoptionsService.getAllSizeOptions();
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteProductDefinition)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a size option by id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return this.sizeoptionsService.remove(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a size option by id')
  async findOne(@Param('id') id: number) {
    try {
      return this.sizeoptionsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateProductDefinition)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a size option by id')
  async update(@Param('id') id: number, @Body() updateSizeOptionDto: UpdateSizeOptionDto, @CurrentUser() currentUser: ValidatedUser) {
    try {
      return this.sizeoptionsService.update(id, updateSizeOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

}