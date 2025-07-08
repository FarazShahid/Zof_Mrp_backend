import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/orders.entity';
import { In, Repository } from 'typeorm';
import { ShipmentCarrier } from 'src/shipment-carrier/entities/shipment-carrier.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentDetail } from './entities/shipment-details';
import { ShipmentBox } from './entities/shippment-box.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(ShipmentCarrier)
    private readonly shipmentCarrierRepository: Repository<ShipmentCarrier>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(ShipmentBox)
    private readonly shipmentBoxRepository: Repository<ShipmentBox>,

    @InjectRepository(ShipmentDetail)
    private readonly shipmentDetailRepository: Repository<ShipmentDetail>,

    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>

  ) { }
  async create(createShipmentDto: CreateShipmentDto, createdBy: any) {
    const {
      ShipmentCode,
      OrderId,
      ShipmentCarrierId,
      ShipmentDate,
      ShipmentCost,
      TotalWeight,
      NumberOfBoxes,
      WeightUnit,
      ReceivedTime,
      Status,
      ShipmentDetails,
      boxes,
    } = createShipmentDto;

    // Validate order
    const order = await this.orderRepository.findOne({ where: { Id: OrderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${OrderId} not found`);
    }

    // Validate carrier
    const carrier = await this.shipmentCarrierRepository.findOne({ where: { Id: ShipmentCarrierId } });
    if (!carrier) {
      throw new NotFoundException(`Shipment Carrier with ID ${ShipmentCarrierId} not found`);
    }

    // Validate order items
    const orderItemIds = ShipmentDetails.map(detail => detail.OrderItemId);

    const foundOrderItems = await this.orderItemRepository.findBy({ Id: In(orderItemIds) });

    const validItemIds = new Set(foundOrderItems.map(item => item.Id));

    for (const detail of ShipmentDetails) {
      if (!validItemIds.has(detail.OrderItemId)) {
        throw new NotFoundException(`Order Item with ID ${detail.OrderItemId} not found`);
      }
    }

    const shipment = this.shipmentRepository.create({
      ShipmentCode,
      OrderId,
      ShipmentCarrierId,
      ShipmentDate: new Date(ShipmentDate),
      ShipmentCost,
      TotalWeight,
      NumberOfBoxes,
      WeightUnit,
      ReceivedTime: ReceivedTime ? new Date(ReceivedTime) : null,
      Status,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
    });

    const savedShipment = await this.shipmentRepository.save(shipment);

    const shipmentDetailEntities = ShipmentDetails.map(detail =>
      this.shipmentDetailRepository.create({
        ShipmentId: savedShipment.Id,
        OrderItemId: detail.OrderItemId,
        Quantity: detail.Quantity,
        Size: detail.Size,
        ItemDetails: detail.ItemDetails,
      }),
    );
    await this.shipmentDetailRepository.save(shipmentDetailEntities);

    const boxEntities = boxes.map(box =>
      this.shipmentBoxRepository.create({
        ShipmentId: savedShipment.Id,
        BoxNumber: box.BoxNumber,
        Weight: box.Weight,
      }),
    );

    await this.shipmentBoxRepository.save(boxEntities);
    return { message: 'Shipment created successfully' };
  }

  async findAll(): Promise<Shipment[]> {
    const shippments = await this.shipmentRepository.find({
      relations: [
        'ShipmentCarrier',
        'Boxes',
        'ShipmentDetails',
        'ShipmentDetails.OrderItem',
        'Order',
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });

    return shippments
  }
  async findOne(id: number) {
    const shippment = await this.shipmentRepository.findOne({
      where: { Id: id },
      relations: [
        'ShipmentCarrier',
        'Boxes',
        'ShipmentDetails',
        'ShipmentDetails.OrderItem',
        'Order',
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });
    if (!shippment) throw new NotFoundException(`Shipment with ${id} not found`)
  }

  update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return `This action updates a #${id} shipment`;
  }

  async remove(id: number) {
    await this.findOne(id)
    const deletedShipment = await this.shipmentRepository.delete(id)
    if (!deletedShipment) throw new InternalServerErrorException()
    return { message: 'Deleted successfully' }
  }
}
