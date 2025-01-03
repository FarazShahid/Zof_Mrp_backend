import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SizeoptionsService } from './sizeoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sizeoptions')
@UseGuards(JwtAuthGuard)
export class SizeoptionsController {
  constructor(private readonly sizeoptionsService: SizeoptionsService) {}

  @Get()
  async findAll() {
    return this.sizeoptionsService.getAllSizeOptions();
  }

}
