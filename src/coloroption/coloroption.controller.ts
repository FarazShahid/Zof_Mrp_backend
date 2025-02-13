import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ColorOptionService } from './coloroption.service';
import { CreateColorOptionDto } from './_/create-color-option.dto';
import { UpdateColorOptionDto } from './_/update-color-option.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('coloroption')
@UseGuards(JwtAuthGuard)
export class ColorOptionController {
  constructor(private readonly colorOptionService: ColorOptionService) {}

  @Post()
  create(@Body() createColorOptionDto: CreateColorOptionDto) {
    return this.colorOptionService.create(createColorOptionDto);
  }

  @Get()
  findAll() {
    return this.colorOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.colorOptionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateColorOptionDto: UpdateColorOptionDto) {
    return this.colorOptionService.update(id, updateColorOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.colorOptionService.remove(id);
  }
}
