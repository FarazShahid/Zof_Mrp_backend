
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductcutoptionsService } from './productcutoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductCutOptionDto } from './dto/create-product-cut-option.dto';
import { UpdateProductCutOptionDto } from './dto/update-product-cut-option.dto';

@Controller('productcutoptions')
@UseGuards(JwtAuthGuard)
export class ProductcutoptionsController {
  constructor(private readonly productcutoptionsService: ProductcutoptionsService) { }

  @Get()
  async findAll() {
    return this.productcutoptionsService.getAllSizeOptions();
  }

  @Post()
  create(@Body() CreateProductCutOptionDto: CreateProductCutOptionDto) {
    return this.productcutoptionsService.create(CreateProductCutOptionDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() UpdateProductCutOptionDto: UpdateProductCutOptionDto) {
    return this.productcutoptionsService.update({
      ...UpdateProductCutOptionDto,
      Id: id
    });
  }

   @Delete(':id')
    remove(@Param('id') id: string) {
      return this.productcutoptionsService.remove(+id);
    }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productcutoptionsService.findOne(id);
  }
}
