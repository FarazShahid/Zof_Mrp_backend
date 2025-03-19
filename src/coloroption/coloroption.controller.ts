import { Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ColorOptionService } from './coloroption.service';
import { CreateColorOptionDto } from './_/create-color-option.dto';
import { UpdateColorOptionDto } from './_/update-color-option.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';

@ControllerAuthProtector('Color Options', 'coloroption')
export class ColorOptionController {
  constructor(private readonly colorOptionService: ColorOptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new color option')
  create(@Body() createColorOptionDto: CreateColorOptionDto, @CurrentUser() currentUser: any) {
    try {
      return this.colorOptionService.create(createColorOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a color option by id')
  update(@Param('id') id: number, @Body() updateColorOptionDto: UpdateColorOptionDto, @CurrentUser() currentUser: any) {
    try {
      return this.colorOptionService.update(id, updateColorOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

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
