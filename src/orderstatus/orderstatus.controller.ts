import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderstatusService } from './orderstatus.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto/order-status.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order Statuses')

@Controller('orderstatuses')
@UseGuards(JwtAuthGuard)
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderstatusService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      return this.orderStatusService.getAllOrderStatuses();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    try {
      return this.orderStatusService.getOrderStatusById(id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderStatusDto: CreateOrderStatusDto, @CurrentUser() currentUser: any) {
    try {
      return this.orderStatusService.create(createOrderStatusDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @CurrentUser() currentUser: any) {
    try {
      return this.orderStatusService.update(+id, updateOrderStatusDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return this.orderStatusService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}