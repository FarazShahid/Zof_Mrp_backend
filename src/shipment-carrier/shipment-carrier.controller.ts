import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { CreateShipmentCarrierDto } from './dto/create-Shipment-carrier.dto';
import { UpdateShipmentCarrierDto } from './dto/update-Shipment-carrier.dto';
import { ShipmentCarrierService } from './shipment-carrier.service';
import { ApiBody } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';


@ControllerAuthProtector('Shipment Carrier', 'shipment-carrier')
@Controller('shipment-carrier')
export class ShipmentCarrierController {
  constructor(private readonly ShipmentCarrierService: ShipmentCarrierService) { }

  @Post()
  @ApiBody({ type: CreateShipmentCarrierDto })
  @HttpCode(HttpStatus.CREATED)
  @CommonApiResponses('Create a carrier')
  async create(
    @Body() createShipmentCarrierDto: CreateShipmentCarrierDto,
    @CurrentUser() user: any
  ) {
    return this.ShipmentCarrierService.create(createShipmentCarrierDto, user.email);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all carriers')
  async findAll() {
    return this.ShipmentCarrierService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get carrier id')
  async findOne(@Param('id') id: string) {
    return this.ShipmentCarrierService.findOne(+id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateShipmentCarrierDto })
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Update carrier by id')
  async update(
    @Param('id') id: string,
    @Body() updateShipmentCarrierDto: UpdateShipmentCarrierDto,
    @CurrentUser() user: any
  ) {
    return this.ShipmentCarrierService.update(+id, updateShipmentCarrierDto, user.email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete carrier by id')
  async remove(@Param('id') id: string) {
    return this.ShipmentCarrierService.remove(+id);
  }
}
