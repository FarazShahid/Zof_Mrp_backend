import { Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ColorOptionService } from './coloroption.service';
import { CreateColorOptionDto } from './_/create-color-option.dto';
import { UpdateColorOptionDto } from './_/update-color-option.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';
import { CurrentUserData } from 'src/auth/auth.types';
@ControllerAuthProtector('Color Options', 'coloroption')
@UseInterceptors(AuditInterceptor)
export class ColorOptionController {
  constructor(private readonly colorOptionService: ColorOptionService) {}

  @HasRight(AppRightsEnum.AddProductDefinition)
  @Post()
  @ApiBody({ type: CreateColorOptionDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new color option')
  create(@Body() createColorOptionDto: CreateColorOptionDto, @CurrentUser() currentUser: CurrentUserData) {
    try {
      return this.colorOptionService.create(createColorOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all color options')
  findAll() {
    try {
      return this.colorOptionService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProductDefinition)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a color option by id')
  findOne(@Param('id') id: string) {
    try {
      return this.colorOptionService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateProductDefinition)
  @Put(':id')
  @ApiBody({ type: CreateColorOptionDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a color option by id')
  update(@Param('id') id: number, @Body() updateColorOptionDto: UpdateColorOptionDto, @CurrentUser() currentUser: CurrentUserData) {
    try {
      return this.colorOptionService.update(id, updateColorOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.DeleteProductDefinition)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a color option by id')
  remove(@Param('id') id: number) {
    try {
      return this.colorOptionService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
