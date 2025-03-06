import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PrintingoptionsService } from './printingoptions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePrintingOptionDto, UpdatePrintingOptionDto } from './dto/printing-option.dto';

@Controller('printingoptions')
@UseGuards(JwtAuthGuard)
export class PrintingoptionsController {
  constructor(private readonly printingOptionsService: PrintingoptionsService) {}

  @Get()
  async findAll() {
    return this.printingOptionsService.getAllPrintingOptions();
  }

  @Post()
  create(@Body() createPrintingOptionDto: CreatePrintingOptionDto) {
    return this.printingOptionsService.create(createPrintingOptionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.printingOptionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePrintingOption: UpdatePrintingOptionDto) {
    return this.printingOptionsService.update(+id, updatePrintingOption);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.printingOptionsService.remove(id);
  }
}
