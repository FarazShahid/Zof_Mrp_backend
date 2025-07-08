import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { CreateOrderDto } from 'src/orders/dto/create-orders.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';


@ControllerAuthProtector('Shipment', 'shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) { }

  @Post()
  @ApiBody({ type: CreateShipmentDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create new shipment')
  async create(@Body() createShipmentDto: CreateShipmentDto, @CurrentUser() currentUser: any) {
    return await this.shipmentService.create(createShipmentDto, currentUser.email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all shipments')
  async findAll() {
    return await this.shipmentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get shipment by id')
  findOne(@Param('id') id: string) {
    return this.shipmentService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateShipmentDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update shipment by id')
  update(@Param('id') id: string, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentService.update(+id, updateShipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete shipment by id')
  remove(@Param('id') id: string) {
    return this.shipmentService.remove(+id);
  }
}
