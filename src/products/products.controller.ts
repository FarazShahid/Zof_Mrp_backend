import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    try {
      return this.productsService.create(createProductDto, user.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    try {
      return this.productsService.getAllProducts();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    try {
      return this.productsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: any) {
    try {
      return this.productsService.update(+id, updateProductDto, user.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      return this.productsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }

  @Get('availablecolors/:id')
  @HttpCode(HttpStatus.OK)
  async getAvailableColorsByProductId(@Param('id') productId: number): Promise<any> {
    try {
      return this.productsService.getAvailableColorsByProductId(productId);
    } catch (error) {
      throw error;
    }
  }

  @Get('cut-options/:id')
  @HttpCode(HttpStatus.OK)
  async getProductCutOptions(@Param('id') id: string) {
    try {
      return await this.productsService.getAvailableCutOptionsByProductId(+id);
    } catch (error) {
      throw error;
    }
  }

  @Get('size-measurements/:id')
  @HttpCode(HttpStatus.OK)
  async getProductSizeMeasurements(@Param('id') id: string) {
    try {
      return await this.productsService.getAvailableSizeMeasurementsByProductId(+id);
    } catch (error) {
      throw error;
    }
  }
}
