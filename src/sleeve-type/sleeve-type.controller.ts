import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SleeveTypeService } from './sleeve-type.service';
import { CreateSleeveTypeDto } from "./dto/create-sleeve-type.dto/create-sleeve-type.dto";
import { UpdateSleeveTypeDto } from './dto/update-sleeve-type.dto/update-sleeve-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sleeve-type')
@UseGuards(JwtAuthGuard)
export class SleeveTypeController {
  constructor(private readonly sleeveService: SleeveTypeService) {}

  @Post()
  create(@Body() createDto: CreateSleeveTypeDto) {
    return this.sleeveService.create(createDto);
  }

  @Get()
  findAll() {
    return this.sleeveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sleeveService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSleeveTypeDto) {
    return this.sleeveService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sleeveService.remove(id);
  }
}
