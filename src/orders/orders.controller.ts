import {
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Req,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
  BadRequestException,
  Res,
  UseInterceptors
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, GetOrdersItemsDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { OrderStatusLogs } from './entities/order-status-log';
import { Response } from 'express';
import { OrderPdfService } from './order.pdf.service';
import { GenerateOrderPdfsDto } from './dto/order.pdf.dto';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { CreateQualityCheckDto } from './dto/create-checklist.dto';
import { ApiQuery } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { OrderQualityCheck } from './entities/order-checklist.entity';


@ControllerAuthProtector('Orders', 'orders')
@UseInterceptors(AuditInterceptor)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly pdfs: OrderPdfService
  ) { }

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new order')
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: any): Promise<any> {
    try {
      return this.ordersService.createOrder(createOrderDto, currentUser.email);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all orders')
  async findAll(): Promise<any> {
    try {
      return this.ordersService.getAllOrders();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }


  @Post('orders-items')
  @ApiBody({ type: GetOrdersItemsDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get multiple order items by order ids')
  async getOrderItemsByOrderIds(
    @Body() getOrdersItemsDto: GetOrdersItemsDto,
  ): Promise<any> {
    try {
      return this.ordersService.getOrderItemsByOrderIds(getOrdersItemsDto.orderIds);
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get an order by client id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return this.ordersService.getOrdersByClientId(id);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  @Put(':id')
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update an order by id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto, @CurrentUser() currentUser: any,
    @Req() req,
  ): Promise<any> {
    try {
      const userId = req.user.id;
      return this.ordersService.updateOrder(id, updateOrderDto, currentUser.email);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  @Post(':id/reorder')
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Reorders an existing order by ID')
  async reorderOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ): Promise<any> {
    return this.ordersService.reorder(id, currentUser.email);
  }


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete an order by id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      return this.ordersService.deleteOrder(id);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  @Get('order-status-log/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get order status log by order id')
  async getOrderStatusLog(@Param('id', ParseIntPipe) orderId: number): Promise<Omit<OrderStatusLogs, 'Id' | 'UpdatedOn'>[]> {
    try {
      return this.ordersService.getOrderStatusLog(orderId);
    } catch (error) {
      console.error('Error fetching order status logs:', error);
      throw error;
    }
  }

  @Get('items/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get order items by order id')
  async getOrderItems(@Param('id', ParseIntPipe) orderId: number): Promise<any> {
    try {
      return this.ordersService.getOrderItemsByOrderId(orderId);
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }

  @Get('get-edit/:id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get edit order by id')
  async getOrdersEdit(@Param('id', ParseIntPipe) orderId: number): Promise<any> {
    try {
      return this.ordersService.getEditOrder(orderId);
    } catch (error) {
      console.error('Error fetching edit order:', error);
      throw error;
    }
  }

  @Post('change-status:id/:statusId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Update order status by id using DELETE route')
  async updateStatusViaDelete(
    @Param('id', ParseIntPipe) id: number,
    @Param('statusId', ParseIntPipe) statusId: number
  ): Promise<void> {
    try {
      await this.ordersService.updateOrderStatus(id, statusId);
    } catch (error) {
      console.error('Error updating order status via DELETE route:', error);
      throw error;
    }
  }

  @Post('generate-download-pdf')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Generate and download order pdf')
  async getOrderPdfsZip(@Body() dto: GenerateOrderPdfsDto, @Res() res: Response) {
    const { file, filename } = await this.pdfs.generateOrderItemsZip(dto.orderId, dto.pdfType);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    file.getStream().pipe(res);
  }

  @Post(':id/qa-checklist')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create QA checklist entries for an orderItemId' })
  @ApiResponse({
    status: 201,
    description: 'QA checklist entries successfully created',
    type: CreateQualityCheckDto,
    isArray: true,
  })
  @ApiBody({
    description: 'List of QA checklist items to create',
    type: CreateQualityCheckDto,
    isArray: true,
    examples: {
      example1: {
        summary: 'Basic example',
        value: [
          {
            productId: 1,
            measurementId: 5,
            parameter: 'Length',
            expected: '100 cm',
            observed: '98 cm',
            remarks: 'Slightly short',
          },
          {
            productId: 1,
            measurementId: 6,
            parameter: 'Width',
            expected: '50 cm',
            observed: '50 cm',
            remarks: 'Perfect',
          },
        ],
      },
    },
  })
  @CommonApiResponses('Creates QA checklist entries for an order')
  async createQaChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Body() dtos: CreateQualityCheckDto[],
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    return this.ordersService.createManyChecklist(id, dtos, currentUser.email);
  }

  @Get(':id/qa-checklist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get QA checklist by orderItemId and optional filters' })
  @ApiResponse({ status: 200, description: 'List of QA checklist items for the order' })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: Number,
    description: 'Filter by productId (optional)',
    example: 45,
  })
  @ApiQuery({
    name: 'measurementId',
    required: false,
    type: Number,
    description: 'Filter by measurementId (optional)',
    example: 67,
  })
  @CommonApiResponses('Get QA checklist by orderItemId and optional productId or measurementId')
  async getQaChecklist(
    @Param('id', ParseIntPipe) orderItemId: number,
    @Query('productId') productId?: number,
    @Query('measurementId') measurementId?: number,
  ): Promise<any> {
    return this.ordersService.getQaChecklist(orderItemId, productId, measurementId);
  }

  @Get(':id/execute-qa-checklist')
  @HttpCode(HttpStatus.OK)
  async generateQaChecklist(
    @Param('id', ParseIntPipe) orderItemId: number,
    @CurrentUser() currentUser: any,
  ): Promise<OrderQualityCheck[]> {
    return this.ordersService.createChecklistForOrderItem(orderItemId, currentUser.email);
  }
}
