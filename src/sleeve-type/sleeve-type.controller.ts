import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { SleeveTypeService } from './sleeve-type.service';
import { CreateSleeveTypeDto } from "./dto/create-sleeve-type.dto/create-sleeve-type.dto";
import { UpdateSleeveTypeDto } from './dto/update-sleeve-type.dto/update-sleeve-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Sleeve Types')
@Controller('sleeve-type')
@UseGuards(JwtAuthGuard)
export class SleeveTypeController {
  constructor(private readonly sleeveService: SleeveTypeService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateSleeveTypeDto, @CurrentUser() currentUser: any) {
    try {
      return this.sleeveService.create(createDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    try {
      return this.sleeveService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.sleeveService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSleeveTypeDto,
    @CurrentUser() currentUser: any
  ) {
    try {
      return this.sleeveService.update(id, updateDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.sleeveService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
