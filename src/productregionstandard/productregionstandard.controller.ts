import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ProductRegionStandardService } from './productregionstandard.service';
import { CreateProductRegionStandardDto } from './_/create-product-region-standard.dto';
import { UpdateProductRegionStandardDto } from './_/update-product-region-standard.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product-region-standard')
@UseGuards(JwtAuthGuard)
export class ProductRegionStandardController {
  constructor(private readonly service: ProductRegionStandardService) {}

  @Post()
  create(@Body() dto: CreateProductRegionStandardDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProductRegionStandardDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
