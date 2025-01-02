import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrintingoptionsService } from './printingoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('printingoptions')
@UseGuards(JwtAuthGuard)
export class PrintingoptionsController {
  constructor(private readonly printingOptionsService: PrintingoptionsService) {}

  @Get()
  async findAll() {
    return this.printingOptionsService.getAllPrintingOptions();
  }
}
