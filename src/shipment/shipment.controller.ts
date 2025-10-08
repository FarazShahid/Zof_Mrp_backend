import { Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { CreateOrderDto } from 'src/orders/dto/create-orders.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';


@ControllerAuthProtector('Shipment', 'shipment')
@UseInterceptors(AuditInterceptor)
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) { }

  @HasRight(AppRightsEnum.AddShipment)
  @Post()
  @ApiBody({ type: CreateShipmentDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create new shipment')
  async create(@Body() createShipmentDto: CreateShipmentDto, @CurrentUser() currentUser: any) {
    return await this.shipmentService.create(createShipmentDto, currentUser.email, currentUser.userId);
  }

  @HasRight(AppRightsEnum.ViewShipment)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all shipments')
  async findAll(@CurrentUser() currentUser: any) {
    return await this.shipmentService.findAll(currentUser.userId);
  }

  @HasRight(AppRightsEnum.ViewShipment)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get shipment by id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.shipmentService.findOne(+id, currentUser.userId);
  }

  @HasRight(AppRightsEnum.UpdateShipment)
  @Patch(':id')
  @ApiBody({ type: UpdateShipmentDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update shipment by id')
  update(@Param('id') id: string, @Body() updateShipmentDto: UpdateShipmentDto, @CurrentUser() currentUser: any) {
    return this.shipmentService.update(+id, updateShipmentDto, currentUser.email, currentUser.userId);
  }

  @HasRight(AppRightsEnum.DeleteShipment)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete shipment by id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.shipmentService.remove(+id, currentUser.userId);
  }
}
