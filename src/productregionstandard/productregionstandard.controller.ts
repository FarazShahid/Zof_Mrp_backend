import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductRegionStandardService } from './productregionstandard.service';
import { CreateProductRegionStandardDto } from './_/create-product-region-standard.dto';
import { UpdateProductRegionStandardDto } from './_/update-product-region-standard.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';

@ControllerAuthProtector('Product Region Standards', 'product-region-standard')
export class ProductRegionStandardController {
  constructor(private readonly service: ProductRegionStandardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new product region standard')
  create(@Body() dto: CreateProductRegionStandardDto, @CurrentUser() currentUser: any) {
    try {
      return this.service.create(dto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all product region standards')
  findAll() {
    try {
      return this.service.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a product region standard by id')
  findOne(@Param('id') id: number) {
    try {
      return this.service.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a product region standard by id')
  update(@Param('id') id: number, @Body() dto: UpdateProductRegionStandardDto, @CurrentUser() currentUser: any) {
    try {
      return this.service.update(id, dto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a product region standard by id')
  remove(@Param('id') id: number) {
    try {
      return this.service.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
