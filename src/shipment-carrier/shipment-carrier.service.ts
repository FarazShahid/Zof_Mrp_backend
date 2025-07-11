import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShipmentCarrierDto } from './dto/create-shipment-carrier.dto';
import { UpdateShipmentCarrierDto } from './dto/update-shipment-carrier.dto';
import { ShipmentCarrier } from './entities/shipment-carrier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from 'src/shipment/entities/shipment.entity';

@Injectable()
export class ShipmentCarrierService {
  constructor(
    @InjectRepository(ShipmentCarrier)
    private readonly carrierRepo: Repository<ShipmentCarrier>,

    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>
  ) { }
  async create(createShipmentCarrierDto: CreateShipmentCarrierDto, createdBy: any) {
    const existingCareer = await this.carrierRepo.findOne({ where: { Name: createShipmentCarrierDto.Name } })
    if (existingCareer) throw new ConflictException("Carrier with this name already exists")
    const newCarrier = this.carrierRepo.create({
      ...createShipmentCarrierDto,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    })
    if (!newCarrier) throw new InternalServerErrorException()
    const savedCarrier = await this.carrierRepo.save(newCarrier)
    if (!savedCarrier) throw new InternalServerErrorException()

    return savedCarrier
  }

  async findAll() {
    return await this.carrierRepo.find({
      order: { CreatedOn: 'DESC' },
    });
  }

  async findOne(id: number) {
    const carrier = await this.carrierRepo.findOne({ where: { Id: id } });
    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }
    return carrier;
  }

  async update(id: number, updateShipmentCarrierDto: UpdateShipmentCarrierDto, updatedBy: string) {
    const carrier = await this.carrierRepo.findOne({ where: { Id: id } });

    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    const updatedCarrier = this.carrierRepo.merge(carrier, {
      ...updateShipmentCarrierDto,
      UpdatedBy: updatedBy,
    });

    return await this.carrierRepo.save(updatedCarrier);
  }

  async remove(id: number) {
    const carrier = await this.carrierRepo.findOne({ where: { Id: id } });
    if (!carrier) {
      throw new NotFoundException(`Carrier with ID ${id} not found`);
    }

    const relatedShipment= await this.shipmentRepo.findOne({
      where: {ShipmentCarrierId: id}
    })

    if(relatedShipment){
      throw new BadRequestException(
      'Cannot delete carrier. Shipments are still associated.'
    );
    }

    await this.carrierRepo.delete(id);
    return { message: `Carrier with ID ${id} has been deleted` };
  }
}
