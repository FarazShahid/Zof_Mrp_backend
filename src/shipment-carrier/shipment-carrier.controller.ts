import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put, UseInterceptors } from '@nestjs/common';
import { CreateShipmentCarrierDto } from './dto/create-shipment-carrier.dto';
import { UpdateShipmentCarrierDto } from './dto/update-shipment-carrier.dto';
import { ShipmentCarrierService } from './shipment-carrier.service';
import { ApiBody } from '@nestjs/swagger';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { HasRight } from 'src/auth/has-right-guard';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';


@ControllerAuthProtector('Shipment Carrier', 'shipment-carrier')
@Controller('shipment-carrier')
@UseInterceptors(AuditInterceptor)
export class ShipmentCarrierController {
  constructor(private readonly ShipmentCarrierService: ShipmentCarrierService) { }

  @HasRight(AppRightsEnum.AddCarriers)
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

  @HasRight(AppRightsEnum.ViewCarriers)
  @Get()
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all carriers')
  async findAll() {
    return this.ShipmentCarrierService.findAll();
  }

  @HasRight(AppRightsEnum.ViewCarriers)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get carrier id')
  async findOne(@Param('id') id: string) {
    return this.ShipmentCarrierService.findOne(+id);
  }

  @HasRight(AppRightsEnum.UpdateCarriers)
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

  @HasRight(AppRightsEnum.DeleteCarriers)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CommonApiResponses('Delete carrier by id')
  async remove(@Param('id') id: string) {
    return this.ShipmentCarrierService.remove(+id);
  }
}
