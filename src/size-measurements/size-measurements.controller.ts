import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SizeMeasurementsService } from './size-measurements.service';
import { CreateSizeMeasurementDto } from './dto/create-size-measurement.dto';
import { UpdateSizeMeasurementDto } from './dto/update-size-measurement.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('size-measurements')
@UseGuards(JwtAuthGuard)
export class SizeMeasurementsController {
  constructor(private readonly sizeMeasurementsService: SizeMeasurementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSizeMeasurementDto: CreateSizeMeasurementDto, @CurrentUser() user: any) {
    try {
      return this.sizeMeasurementsService.create(createSizeMeasurementDto, user.email);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    try {
      return this.sizeMeasurementsService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    try {
      return this.sizeMeasurementsService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateSizeMeasurementDto: UpdateSizeMeasurementDto,
    @CurrentUser() user: any,
  ) {
    try {
      return this.sizeMeasurementsService.update(+id, updateSizeMeasurementDto, user.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    try {
      return this.sizeMeasurementsService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
} 