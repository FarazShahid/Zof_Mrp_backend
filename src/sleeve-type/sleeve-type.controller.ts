import { Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { SleeveTypeService } from './sleeve-type.service';
import { CreateSleeveTypeDto } from "./dto/create-sleeve-type.dto/create-sleeve-type.dto";
import { UpdateSleeveTypeDto } from './dto/update-sleeve-type.dto/update-sleeve-type.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { HasRight } from 'src/auth/has-right-guard';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';

@ControllerAuthProtector('Sleeve Types', 'sleeve-type')
@UseInterceptors(AuditInterceptor)
export class SleeveTypeController {
  constructor(private readonly sleeveService: SleeveTypeService) { }

  @HasRight(AppRightsEnum.AddProductDefinition)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new sleeve type')
  create(@Body() createDto: CreateSleeveTypeDto, @CurrentUser() currentUser: ValidatedUser) {
    try {
      return this.sleeveService.create(createDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all sleeve types')
  findAll() {
    try {
      return this.sleeveService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a sleeve type by id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.sleeveService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateProductDefinition)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a sleeve type by id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSleeveTypeDto,
    @CurrentUser() currentUser: ValidatedUser
  ) {
    try {
      return this.sleeveService.update(id, updateDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteProductDefinition)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a sleeve type by id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.sleeveService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
