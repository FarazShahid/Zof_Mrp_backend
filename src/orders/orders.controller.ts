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
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: any): Promise<any> {
    try {
      return this.ordersService.createOrder(createOrderDto, currentUser.email);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<any> {
    try {
      return this.ordersService.getAllOrders(paginationDto);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return this.ordersService.getOrdersByClientId(id);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto, 
    @Req() req
  ): Promise<any> {
    try {
      const userId = req.user.id; 
      return this.ordersService.updateOrder(id, updateOrderDto, userId);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return this.ordersService.deleteOrder(id);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  @Get('items/:id')
  async getOrderItems(@Param('id', ParseIntPipe) orderId: number): Promise<any> {
    try {
      return this.ordersService.getOrderItemsByOrderId(orderId);
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }

  @Get('get-edit/:id')
  async getOrdersEdit(@Param('id', ParseIntPipe) orderId: number): Promise<any> {
    try {
      return this.ordersService.getEditOrder(orderId);
    } catch (error) {
      console.error('Error fetching edit order:', error);
      throw error;
    }
  }
}
