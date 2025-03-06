import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrderstatusService } from './orderstatus.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto/order-status.dto';

@Controller('orderstatuses')
@UseGuards(JwtAuthGuard)
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderstatusService) {}

  @Get()
  async findAll() {
    return this.orderStatusService.getAllOrderStatuses();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.orderStatusService.getOrderStatusById(id);
  }

  @Post()
  create(@Body() createOrderStatusDto: CreateOrderStatusDto) {
    return this.orderStatusService.create(createOrderStatusDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderStatusService.update(+id, updateOrderStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.orderStatusService.remove(id);
  }
}