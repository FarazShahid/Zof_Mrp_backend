import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FabricTypeService } from './fabrictype.service';
import { CreateFabricTypeDto } from './_/create-fabrictype.dto';
import { UpdateFabricTypeDto } from './_/update-fabrictype.dto';
@Controller('fabrictype')
export class FabricTypeController {
  constructor(private readonly fabricTypeService: FabricTypeService) {}

  @Post()
  create(@Body() createFabricTypeDto: CreateFabricTypeDto) {
    return this.fabricTypeService.create(createFabricTypeDto);
  }

  @Get()
  findAll() {
    return this.fabricTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.fabricTypeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateFabricTypeDto: UpdateFabricTypeDto) {
    return this.fabricTypeService.update(id, updateFabricTypeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.fabricTypeService.delete(id);
  }
}
