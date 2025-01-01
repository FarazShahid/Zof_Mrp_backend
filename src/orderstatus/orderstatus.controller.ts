import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OrderstatusService } from './orderstatus.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // JWT Guard

@Controller('orderstatuses')
@UseGuards(JwtAuthGuard) // Ensure that the endpoints are protected
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderstatusService) {}

  // Get all order statuses with emails of CreatedBy and UpdatedBy
  @Get()
  async findAll() {
    return this.orderStatusService.getAllOrderStatuses();
  }

  // Get a specific order status by ID
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.orderStatusService.getOrderStatusById(id);
  }
}
