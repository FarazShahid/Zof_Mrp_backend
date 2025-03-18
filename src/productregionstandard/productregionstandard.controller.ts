import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductRegionStandardService } from './productregionstandard.service';
import { CreateProductRegionStandardDto } from './_/create-product-region-standard.dto';
import { UpdateProductRegionStandardDto } from './_/update-product-region-standard.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product Region Standards')
@Controller('product-region-standard')
@UseGuards(JwtAuthGuard)
export class ProductRegionStandardController {
  constructor(private readonly service: ProductRegionStandardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductRegionStandardDto, @CurrentUser() currentUser: any) {
    try {
      return this.service.create(dto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    try {
      return this.service.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    try {
      return this.service.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateProductRegionStandardDto, @CurrentUser() currentUser: any) {
    try {
      return this.service.update(id, dto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    try {
      return this.service.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
