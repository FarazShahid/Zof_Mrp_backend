import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SizeoptionsService } from './sizeoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSizeOptionDto } from './dto/create-sizeoptions.dto';
import { SizeOption } from './entities/sizeoptions.entity';
import { UpdateSizeOptionDto } from './dto/update-sizeoptions.dto';

@Controller('sizeoptions')
@UseGuards(JwtAuthGuard)
export class SizeoptionsController {
  constructor(private readonly sizeoptionsService: SizeoptionsService) { }

  @Post()
  async create(@Body() CreateSizeOptionDto: CreateSizeOptionDto): Promise<SizeOption> {
    return this.sizeoptionsService.create(CreateSizeOptionDto);
  }

  @Get()
  async findAll() {
    return this.sizeoptionsService.getAllSizeOptions();
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.sizeoptionsService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sizeoptionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateSizeOptionDto: UpdateSizeOptionDto) {
    return this.sizeoptionsService.update(id, updateSizeOptionDto);
  }

}