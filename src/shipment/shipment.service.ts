import { DataSource } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto, ShipmentResponseDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import { Order } from 'src/orders/entities/orders.entity';
import { In, Repository } from 'typeorm';
import { ShipmentCarrier } from 'src/shipment-carrier/entities/shipment-carrier.entity';
// import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Shipment } from './entities/shipment.entity';
// import { ShipmentDetail } from './entities/shipment-details';
import { ShipmentBox } from './entities/shipment-box.entity';
@Injectable()
export class ShipmentService {
  constructor(
    // @InjectRepository(Order)
    // private readonly orderRepository: Repository<Order>,

    @InjectRepository(ShipmentCarrier)
    private readonly shipmentCarrierRepository: Repository<ShipmentCarrier>,

    // @InjectRepository(OrderItem)
    // private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(ShipmentBox)
    private readonly shipmentBoxRepository: Repository<ShipmentBox>,

    // @InjectRepository(ShipmentDetail)
    // private readonly shipmentDetailRepository: Repository<ShipmentDetail>,

    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,

    private dataSource: DataSource

  ) { }
  async create(createShipmentDto: CreateShipmentDto, createdBy: any) {
    const {
      ShipmentCode,
      OrderNumber,
      ShipmentCarrierId,
      ShipmentDate,
      ShipmentCost,
      TotalWeight,
      NumberOfBoxes,
      WeightUnit,
      ReceivedTime,
      Status,
      boxes,
    } = createShipmentDto;

    // Validate order
    // const order = await this.orderRepository.findOne({ where: { Id: OrderId } });
    // if (!order) {
    //   throw new NotFoundException(`Order with ID ${OrderId} not found`);
    // }

    // Validate carrier
    const carrier = await this.shipmentCarrierRepository.findOne({ where: { Id: ShipmentCarrierId } });
    if (!carrier) {
      throw new NotFoundException(`Shipment Carrier with ID ${ShipmentCarrierId} not found`);
    }

    // Validate order items
    // const orderItemIds = ShipmentDetails.map(detail => detail.OrderItemId);

    // const foundOrderItems = await this.orderItemRepository.findBy({ Id: In(orderItemIds) });

    // const validItemIds = new Set(foundOrderItems.map(item => item.Id));

    // for (const detail of ShipmentDetails) {
    //   if (!validItemIds.has(detail.OrderItemId)) {
    //     throw new NotFoundException(`Order Item with ID ${detail.OrderItemId} not found`);
    //   }
    // }

    const shipment = this.shipmentRepository.create({
      ShipmentCode,
      ShipmentCost,
      TotalWeight,
      OrderNumber,
      ShipmentCarrierId,
      ShipmentDate: new Date(ShipmentDate),
      NumberOfBoxes,
      WeightUnit,
      ReceivedTime: new Date(ReceivedTime) || null,
      Status,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
    });

    const savedShipment = await this.shipmentRepository.save(shipment);

    // const shipmentDetailEntities = ShipmentDetails.map(detail =>
    //   this.shipmentDetailRepository.create({
    //     ShipmentId: savedShipment.Id,
    //     OrderItemId: detail.OrderItemId,
    //     Quantity: detail.Quantity,
    //     Size: detail.Size,
    //     ItemDetails: detail.ItemDetails,
    //   }),
    // );
    // await this.shipmentDetailRepository.save(shipmentDetailEntities);

    const boxEntities = boxes.map(box =>
      this.shipmentBoxRepository.create({
        ShipmentId: savedShipment.Id,
        BoxNumber: box.BoxNumber,
        Weight: box.Weight,
        Quantity: box.Quantity,
        OrderItem: box.OrderItem,
        OrderItemDescription: box.OrderItemDescription
      }),
    );
    await this.shipmentBoxRepository.save(boxEntities);
    return {
      id: shipment.Id
    };
  }

  async findAll(): Promise<ShipmentResponseDto[]> {
    const shipments = await this.shipmentRepository.find({
      relations: [
        'ShipmentCarrier',
        'Boxes'
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });

    return shipments.map((shipmentItem) => ({
      Id: shipmentItem.Id,
      ShipmentCode: shipmentItem.ShipmentCode,
      ShipmentDate: shipmentItem.ShipmentDate,
      ShipmentCost: shipmentItem.ShipmentCost,
      WeightUnit: shipmentItem.WeightUnit,
      TotalWeight: shipmentItem.TotalWeight,
      NumberOfBoxes: shipmentItem.NumberOfBoxes,
      ReceivedTime: shipmentItem.ReceivedTime,
      Status: shipmentItem.Status,
      ShipmentCarrierId: shipmentItem.ShipmentCarrier.Id,
      ShipmentCarrierName: shipmentItem.ShipmentCarrier.Name,
      OrderNumber: shipmentItem.OrderNumber,
      CreatedOn: shipmentItem.CreatedOn,
      UpdatedOn: shipmentItem.UpdatedOn,
      CreatedBy: shipmentItem.CreatedBy,
      UpdatedBy: shipmentItem.UpdatedBy,
    }))
  }

  async findOne(id: number) {
    const shippment = await this.shipmentRepository.findOne({
      where: { Id: id },
      relations: [
        'ShipmentCarrier',
        'Boxes'
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });
    if (!shippment) throw new NotFoundException(`Shipment with ${id} not found`)
    return shippment
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto, updatedBy: string) {
    const existingShipment = await this.shipmentRepository.findOne({ where: { Id: id } });
    if (!existingShipment) throw new NotFoundException(`Shipment with ID ${id} not found`);

    return await this.dataSource.transaction(async manager => {
      const {
        ShipmentCode,
        OrderNumber,
        ShipmentCarrierId,
        ShipmentDate,
        ShipmentCost,
        TotalWeight,
        NumberOfBoxes,
        WeightUnit,
        ReceivedTime,
        Status,
        boxes,
      } = updateShipmentDto;

      const shipmentRepo = manager.getRepository(Shipment);
      // const shipmentDetailRepo = manager.getRepository(ShipmentDetail);
      const shipmentBoxRepo = manager.getRepository(ShipmentBox);
      // const orderItemRepo = manager.getRepository(OrderItem);

      // Validate new OrderId
      // if (OrderId && OrderId !== existingShipment.OrderId) {
      //   const order = await this.orderRepository.findOne({ where: { Id: OrderId } });
      //   if (!order) throw new NotFoundException(`Order with ID ${OrderId} not found`);
      //   existingShipment.OrderId = OrderId;
      // }

      // Validate new CarrierId
      if (ShipmentCarrierId && ShipmentCarrierId !== existingShipment.ShipmentCarrierId) {
        const carrier = await this.shipmentCarrierRepository.findOne({ where: { Id: ShipmentCarrierId } });
        if (!carrier) throw new NotFoundException(`Carrier with ID ${ShipmentCarrierId} not found`);
        existingShipment.ShipmentCarrierId = ShipmentCarrierId;
      }

      // Update simple fields
      if (OrderNumber !== undefined) existingShipment.OrderNumber = OrderNumber;
      if (ShipmentCode !== undefined) existingShipment.ShipmentCode = ShipmentCode;
      if (ShipmentDate !== undefined) existingShipment.ShipmentDate = new Date(ShipmentDate);
      if (ShipmentCost !== undefined) existingShipment.ShipmentCost = ShipmentCost;
      if (TotalWeight !== undefined) existingShipment.TotalWeight = TotalWeight;
      if (NumberOfBoxes !== undefined) existingShipment.NumberOfBoxes = NumberOfBoxes;
      if (WeightUnit !== undefined) existingShipment.WeightUnit = WeightUnit;
      if (ReceivedTime !== undefined) existingShipment.ReceivedTime = ReceivedTime ? new Date(ReceivedTime) : null;
      if (Status !== undefined) existingShipment.Status = Status;
      existingShipment.UpdatedBy = updatedBy;

      await shipmentRepo.save(existingShipment);

      // Validate and Replace ShipmentDetails
      // if (ShipmentDetails && Array.isArray(ShipmentDetails)) {
      //   const orderItemIds = ShipmentDetails.map(d => d.OrderItemId);
      //   const foundItems = await orderItemRepo.findBy({ Id: In(orderItemIds) });

      //   if (foundItems.length !== orderItemIds.length) {
      //     throw new BadRequestException('Some OrderItemIds are invalid.');
      //   }

      //   const invalidItems = foundItems.filter(i => i.OrderId !== existingShipment.OrderId);
      //   if (invalidItems.length) {
      //     throw new BadRequestException(
      //       `OrderItemIds [${invalidItems.map(i => i.Id).join(', ')}] do not belong to Order ID ${existingShipment.OrderId}`
      //     );
      //   }

      //   await shipmentDetailRepo.delete({ ShipmentId: existingShipment.Id });

      //   const newDetails = ShipmentDetails.map(detail =>
      //     shipmentDetailRepo.create({
      //       ShipmentId: existingShipment.Id,
      //       OrderItemId: detail.OrderItemId,
      //       Quantity: detail.Quantity,
      //       Size: detail.Size,
      //       ItemDetails: detail.ItemDetails,
      //     })
      //   );
      //   await shipmentDetailRepo.save(newDetails);
      // }

      // Replace Boxes
      if (boxes && Array.isArray(boxes)) {
        await shipmentBoxRepo.delete({ ShipmentId: existingShipment.Id });
        const newBoxes = boxes.map(box =>
          shipmentBoxRepo.create({
            ShipmentId: existingShipment.Id,
            BoxNumber: box.BoxNumber,
            Weight: box.Weight,
            OrderItem: box.OrderItem,
            Quantity: box.Quantity,
            OrderItemDescription: box.OrderItemDescription,
          })
        );
        await shipmentBoxRepo.save(newBoxes);
      }
      return {
        id: existingShipment.Id
      };
    });
  }

  async remove(id: number) {
    await this.findOne(id)
    const deletedShipment = await this.shipmentRepository.delete(id)
    if (!deletedShipment) throw new InternalServerErrorException()
    return { message: 'Deleted successfully' }
  }
}
