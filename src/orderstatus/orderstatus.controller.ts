import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderstatusService } from './orderstatus.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto/order-status.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';

@ApiTags('Order Statuses')

@Controller('orderstatuses')
@UseGuards(JwtAuthGuard)
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderstatusService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all order statuses')
  async findAll() {
    try {
      return this.orderStatusService.getAllOrderStatuses();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get an order status by id')
  async findOne(@Param('id') id: number) {
    try {
      return this.orderStatusService.getOrderStatusById(id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new order status')
  create(@Body() createOrderStatusDto: CreateOrderStatusDto, @CurrentUser() currentUser: any) {
    try {
      return this.orderStatusService.create(createOrderStatusDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update an order status by id')
  update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @CurrentUser() currentUser: any) {
    try {
      return this.orderStatusService.update(+id, updateOrderStatusDto, currentUser.email);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete an order status by id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return this.orderStatusService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}