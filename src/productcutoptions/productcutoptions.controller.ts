
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductcutoptionsService } from './productcutoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductCutOptionDto } from './dto/create-product-cut-option.dto';
import { UpdateProductCutOptionDto } from './dto/update-product-cut-option.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product Cut Options')
@Controller('productcutoptions')
@UseGuards(JwtAuthGuard)
export class ProductcutoptionsController {
  constructor(private readonly productcutoptionsService: ProductcutoptionsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return this.productcutoptionsService.getAllSizeOptions();
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() CreateProductCutOptionDto: CreateProductCutOptionDto, @CurrentUser() currentUser: any) {
    try {
      return this.productcutoptionsService.create(CreateProductCutOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
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
    remove(@Param('id') id: string) {
      try {
        return this.productcutoptionsService.remove(+id);
      } catch (error) {
        throw error;
      }
    }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.productcutoptionsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
