import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrderstatusService } from './orderstatus.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
}
