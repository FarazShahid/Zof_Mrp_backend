
import { Body, Delete, Get, Param, Post, Put, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductcutoptionsService } from './productcutoptions.service';
import { CreateProductCutOptionDto } from './dto/create-product-cut-option.dto';
import { UpdateProductCutOptionDto } from './dto/update-product-cut-option.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
@ControllerAuthProtector('Product Cut Options', 'productcutoptions')
export class ProductcutoptionsController {
  constructor(private readonly productcutoptionsService: ProductcutoptionsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all product cut options')
  async findAll() {
    try {
      return this.productcutoptionsService.getAllSizeOptions();
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @ApiBody({ type: CreateProductCutOptionDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new product cut option')
  create(@Body() CreateProductCutOptionDto: CreateProductCutOptionDto, @CurrentUser() currentUser: any) {
    try {
      return this.productcutoptionsService.create(CreateProductCutOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiBody({ type: CreateProductCutOptionDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update a product cut option by id')
  update(@Param('id') id: number, @Body() UpdateProductCutOptionDto: UpdateProductCutOptionDto, @CurrentUser() currentUser: any) {
    try {
      return this.productcutoptionsService.update({
        ...UpdateProductCutOptionDto,
        Id: id
      }, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

   @Delete(':id')
   @HttpCode(HttpStatus.NO_CONTENT)
   @CommonApiResponses('Delete a product cut option by id')
    remove(@Param('id') id: string) {
      try {
        return this.productcutoptionsService.remove(+id);
      } catch (error) {
        throw error;
      }
    }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get a product cut option by id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.productcutoptionsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
