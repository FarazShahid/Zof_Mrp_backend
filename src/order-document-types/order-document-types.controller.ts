import { Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { OrderDocumentTypesService } from './order-document-types.service';
import { CreateOrderDocumentTypeDto } from './dto/create-order-document-type.dto';
import { UpdateOrderDocumentTypeDto } from './dto/update-order-document-type.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Order Document Types', 'order-document-types')
@UseInterceptors(AuditInterceptor)
export class OrderDocumentTypesController {
  constructor(private readonly orderDocumentTypesService: OrderDocumentTypesService) {}

  @HasRight(AppRightsEnum.AddOrders)
  @Post()
  @ApiBody({ type: CreateOrderDocumentTypeDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a new order document type')
  create(@Body() createDto: CreateOrderDocumentTypeDto, @CurrentUser() currentUser: any) {
    return this.orderDocumentTypesService.create(createDto, currentUser.email);
  }

  @HasRight(AppRightsEnum.ViewOrders)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all order document types')
  findAll() {
    return this.orderDocumentTypesService.findAll();
  }

  @HasRight(AppRightsEnum.ViewOrders)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get an order document type by id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderDocumentTypesService.findOne(id);
  }

  @HasRight(AppRightsEnum.UpdateOrders)
  @Put(':id')
  @ApiBody({ type: UpdateOrderDocumentTypeDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update an order document type by id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOrderDocumentTypeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.orderDocumentTypesService.update(id, updateDto, currentUser.email);
  }

  @HasRight(AppRightsEnum.DeleteOrders)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete an order document type by id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderDocumentTypesService.remove(id);
  }
}
