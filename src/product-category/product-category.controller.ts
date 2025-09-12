import { Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
@ControllerAuthProtector('Product Categories', 'product-category')
@UseInterceptors(AuditInterceptor)
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  @Post()
  @ApiBody({ type: CreateProductCategoryDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new product category')
  create(@Body() createDto: CreateProductCategoryDto, @CurrentUser() currentUser: any) {
    try {
      return this.categoryService.create(createDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all product categories')
  findAll() {
    try {
      return this.categoryService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a product category by id')
  findOne(@Param('id') id: number) {
    try {
      return this.categoryService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiBody({ type: CreateProductCategoryDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a product category by id')
  update(@Param('id') id: number, @Body() updateDto: UpdateProductCategoryDto, @CurrentUser() currentUser: any) {
    try {
      return this.categoryService.update(id, updateDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a product category by id')
  remove(@Param('id') id: number) {
    try {
      return this.categoryService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
