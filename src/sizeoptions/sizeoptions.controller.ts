import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SizeoptionsService } from './sizeoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSizeOptionDto } from './dto/create-sizeoptions.dto';
import { SizeOption } from './entities/sizeoptions.entity';
import { UpdateSizeOptionDto } from './dto/update-sizeoptions.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('sizeoptions')
@UseGuards(JwtAuthGuard)
export class SizeoptionsController {
  constructor(private readonly sizeoptionsService: SizeoptionsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() CreateSizeOptionDto: CreateSizeOptionDto, @CurrentUser() currentUser: any): Promise<SizeOption> {
    try {
      return this.sizeoptionsService.create(CreateSizeOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return this.sizeoptionsService.getAllSizeOptions();
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return this.sizeoptionsService.remove(id);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    try {
      return this.sizeoptionsService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateSizeOptionDto: UpdateSizeOptionDto, @CurrentUser() currentUser: any) {
    try {
      return this.sizeoptionsService.update(id, updateSizeOptionDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

}