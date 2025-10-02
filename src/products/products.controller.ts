import { Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Patch, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { UpdateProductStatusDto } from './dto/update-status-dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Products', 'products')
@UseInterceptors(AuditInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @HasRight(AppRightsEnum.AddProduct)
  @Post()
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new product')
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    try {
      return this.productsService.create(createProductDto, user.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all products')
  @ApiQuery({ name: 'filter', required: false, description: 'Filter by unarchive products' })
  findAll(
    @Query('filter') filter?: string,
  ) {
    try {
      return this.productsService.getAllProducts(filter);
    } catch (error) {
      throw error;
    }
  }


  @HasRight(AppRightsEnum.ViewProduct)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a product by id')
  findOne(@Param('id') id: string) {
    try {
      return this.productsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateProduct)
  @Put(':id')
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a product by id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: any) {
    try {
      return this.productsService.update(+id, updateProductDto, user.email);
    } catch (error) {
      throw error;
    }
  }


  @HasRight(AppRightsEnum.DeleteProduct)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a product by id')
  remove(@Param('id') id: string) {
    try {
      return this.productsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ChangeProductStatus)
  @Patch('archive-status/:id')
  @ApiBody({ type: UpdateProductStatusDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update archived status of a product by its id')
  updateProductStatus(@Param('id') id: string, @Body() updateProductStatus: UpdateProductStatusDto, @CurrentUser() user: any) {
    try {
      return this.productsService.updateProductStatus(+id, updateProductStatus, user.email);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('available-printing-options/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get available printing options by product id')
  async getAvailablePrintingOptionsByProductId(@Param('id') productId: number): Promise<any> {
    try {
      return this.productsService.getAvailablePrintingOptionsByProductId(productId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('availablecolors/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get available colors by product id')
  async getAvailableColorsByProductId(@Param('id') productId: number): Promise<any> {
    try {
      return this.productsService.getAvailableColorsByProductId(productId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('cut-options/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get available cut options by product id')
  async getProductCutOptions(@Param('id') id: string) {
    try {
      return await this.productsService.getAvailableCutOptionsByProductId(+id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('sleeve-types/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get available sleeve types by product id')
  async getProductSleeveTypes(@Param('id') id: string) {
    try {
      return await this.productsService.getAvailableSleeveTypesByProductId(+id);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('available-sizes/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get available sleeve types by product id')
  async getAvailableSizes(@Param('id') id: string) {
    try {
      return await this.productsService.getAvailableSizesByProductId(+id);
    } catch (error) {
      throw error;
    }
  }
}
