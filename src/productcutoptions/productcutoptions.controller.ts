
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProductcutoptionsService } from './productcutoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('productcutoptions')
@UseGuards(JwtAuthGuard)
export class ProductcutoptionsController {
  constructor(private readonly productcutoptionsService: ProductcutoptionsService) {}

  @Get()
  async findAll() {
    return this.productcutoptionsService.getAllSizeOptions();
  }

}
