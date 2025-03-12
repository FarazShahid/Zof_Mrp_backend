import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Body, 
  Put, 
  Delete, 
  UseGuards, 
  Req, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode,
  Query
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req): Promise<any> {
    const userId = req.user.id;
    return this.ordersService.createOrder(createOrderDto, userId);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<any> {
    return this.ordersService.getAllOrders(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.ordersService.getOrdersByClientId(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto, 
    @Req() req
  ): Promise<any> {
    const userId = req.user.id; 
    return this.ordersService.updateOrder(id, updateOrderDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.deleteOrder(id);
  }

  @Get('items/:id')
  async getOrderItems(@Param('id', ParseIntPipe) orderId: number): Promise<any> {
    return this.ordersService.getOrderItemsByOrderId(orderId);
  }

  @Get('get-edit/:id')
  async getOrdersEdit(@Param('id', ParseIntPipe) orderId: number): Promise<any> {
    return this.ordersService.getEditOrder(orderId);
  }
}
