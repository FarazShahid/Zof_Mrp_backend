import { Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Patch, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ValidatedUser } from 'src/auth/jwt.strategy';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { UpdateProductStatusDto } from './dto/update-status-dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ControllerAuthProtector('Products', 'products')
@UseInterceptors(AuditInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @HasRight(AppRightsEnum.AddProduct)
  @Post()
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new product')
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: ValidatedUser) {
    try {
      return this.productsService.create(createProductDto, user.email, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all products')
  @ApiQuery({ name: 'filter', required: false, description: 'Filter by unarchive products' })
  @ApiQuery({ name: 'projectId', required: false, type: Number, description: 'Project ID to filter products', example: 1 })
  findAll(
    @CurrentUser() user: ValidatedUser,
    @Query('filter') filter?: string,
    @Query('projectId') projectId?: number,
  ) {
    try {
      return this.productsService.getAllProducts(user.userId, filter, projectId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('client/:clientId')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all products by client ID')
  async getProductsByClientId(
    @Param('clientId') clientId: string,
    @CurrentUser() user: ValidatedUser,
  ) {
    try {
      return await this.productsService.getProductsByClientId(+clientId, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewProduct)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a product by id')
  findOne(@Param('id') id: string, @CurrentUser() user: ValidatedUser) {
    try {
      return this.productsService.findOne(+id, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.UpdateProduct)
  @Put(':id')
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a product by id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: ValidatedUser) {
    try {
      return this.productsService.update(+id, updateProductDto, user.email, user.userId);
    } catch (error) {
      throw error;
    }
  }


  @HasRight(AppRightsEnum.DeleteProduct)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete a product by id')
  remove(@Param('id') id: string, @CurrentUser() user: ValidatedUser) {
    try {
      return this.productsService.remove(+id, user.userId);
    } catch (error) {
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ChangeProductStatus)
  @Patch('archive-status/:id')
  @ApiBody({ type: UpdateProductStatusDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update archived status of a product by its id')
  updateProductStatus(@Param('id') id: string, @Body() updateProductStatus: UpdateProductStatusDto, @CurrentUser() user: ValidatedUser) {
    try {
      return this.productsService.updateProductStatus(+id, updateProductStatus, user.email, user.userId);
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

  @HasRight(AppRightsEnum.ViewProduct)
  @Get('with-attachments/all')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get paginated products with their attachments and client information')
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'searchQuery', required: false, type: String, description: 'Search query for product name or description', example: 'shirt' })
  @ApiQuery({ name: 'clientId', required: false, type: Number, description: 'Client ID to filter products', example: 1 })
  @ApiQuery({ name: 'productId', required: false, type: Number, description: 'Product ID to filter products', example: 1 })
  async getProductsWithAttachments(
    @CurrentUser() user: ValidatedUser,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const page = paginationDto.page || 1;
      const limit = paginationDto.limit || 10;
      const searchQuery = paginationDto.searchQuery || undefined;
      const clientId = paginationDto.clientId || undefined;
      const productId = paginationDto.productId || undefined;
      return await this.productsService.getProductsWithAttachments(
        user.userId,
        page,
        limit,
        clientId,
        productId,
        searchQuery
      );
    } catch (error) {
      throw error;
    }
  }
}
