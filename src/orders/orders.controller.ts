import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req): Promise<any> {
    const userId = req.user.id;
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  @Get()
  async findAll(): Promise<any> {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.ordersService.getOrdersByClientId(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto, @Req() req): Promise<any> {
    const userId = req.user.id; 
    return this.ordersService.updateOrder(id, updateOrderDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ordersService.deleteOrder(id);
  }

  @Get('items/:id')
  async getOrderItems(@Param('id') orderId: number): Promise<any> {
    return this.ordersService.getOrderItemsByOrderId(orderId);
  }

  @Get('get-edit/:id')
  async getOrdersEdit(@Param('id') orderId: number): Promise<any> {
    return this.ordersService.getEditOrder(orderId);
  }
}
