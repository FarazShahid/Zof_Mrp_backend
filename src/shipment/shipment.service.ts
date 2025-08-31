import { DataSource, EntityManager } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto, ShipmentResponseDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShipmentCarrier } from 'src/shipment-carrier/entities/shipment-carrier.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentBox } from './entities/shipment-box.entity';
import { ShipmentOrder } from './entities/shipment-order.entity';
import { OrderItem, OrderItemShipmentEnum } from 'src/orders/entities/order-item.entity';
import { OrderItemDetails } from 'src/orders/entities/order-item-details';
import { Order } from 'src/orders/entities/orders.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(ShipmentCarrier)
    private readonly shipmentCarrierRepository: Repository<ShipmentCarrier>,

    // @InjectRepository(OrderItem)
    // private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(OrderItemDetails)
    private readonly orderItemDetailsRepository: Repository<OrderItemDetails>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,

    @InjectRepository(ShipmentOrder)
    private readonly shipmentOrderRepository: Repository<ShipmentOrder>,

    private dataSource: DataSource

  ) { }
  async create(createShipmentDto: CreateShipmentDto, createdBy: any) {
    const {
      ShipmentCode,
      TrackingId,
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

    if (boxes.length !== NumberOfBoxes) {
      throw new BadRequestException('NumberOfBoxes does not match boxes length.');
    }

    const carrier = await this.shipmentCarrierRepository.findOne({ where: { Id: ShipmentCarrierId } });
    if (!carrier) {
      throw new NotFoundException(`Shipment Carrier with ID ${ShipmentCarrierId} not found`);
    }

    const orderIds = new Set(createShipmentDto.OrderIds);
    const verifiedOrder = await this.orderRepository.findBy({ Id: In(Array.from(orderIds)) });
    if (verifiedOrder.length !== Array.from(orderIds).length) {
      throw new BadRequestException('Some Orders are invalid.');
    }

    const orderItemIds = new Set(boxes.map(box => box?.OrderItemId));
    const verifiedOrderItems = await this.orderItemRepository.findBy({ Id: In(Array.from(orderItemIds)) });
    if (verifiedOrderItems.length !== Array.from(orderItemIds).length) {
      throw new BadRequestException('Some Order Items are invalid.');
    }

    const verifiedOrderIds = new Set(verifiedOrder.map(o => o.Id));
    const badItem = verifiedOrderItems.find(orderItem => !verifiedOrderIds.has(orderItem.OrderId));
    if (badItem) {
      throw new BadRequestException(`OrderItem ${badItem.Id} does not belong to the provided orders.`);
    }

    return await this.dataSource.transaction(async (manager) => {
      const shipment = manager.getRepository(Shipment).create({
        ShipmentCode,
        TrackingId,
        ShipmentCost,
        TotalWeight,
        OrderNumber,
        ShipmentCarrierId,
        ShipmentDate: new Date(ShipmentDate),
        NumberOfBoxes,
        WeightUnit,
        ReceivedTime: ReceivedTime
          ? new Date(ReceivedTime)
          : null,
        Status,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });

      const savedShipment = await manager.getRepository(Shipment).save(shipment);
      if (!savedShipment) {
        throw new InternalServerErrorException('Failed to create shipment');
      }

      if (verifiedOrder.length > 0) {
        const shipmentOrder = manager.getRepository(ShipmentOrder).create(
          verifiedOrder.map(order => ({
            ShipmentId: savedShipment.Id,
            OrderId: order.Id
          }))
        );
        await manager.getRepository(ShipmentOrder).save(shipmentOrder);
      }

      const boxEntities = boxes.map(box =>
        manager.getRepository(ShipmentBox).create({
          OrderItemId: box.OrderItemId,
          ShipmentId: savedShipment.Id,
          BoxNumber: box.BoxNumber,
          Weight: box.Weight,
          Quantity: box.Quantity,
          OrderItemName: box.OrderItemName,
          OrderItemDescription: box.OrderItemDescription
        }),
      );

      await manager.getRepository(ShipmentBox).save(boxEntities);

      const affectedItemIds = [...new Set(
        boxes.map(b => b.OrderItemId).filter((id): id is number => !!id)
      )];
      await this.recalcOrderItems(affectedItemIds, manager);

      // ✅ Recalc order-level shipping status from their items
      const affectedOrderIds = verifiedOrder.map(o => o.Id);
      await this.recalcOrders(affectedOrderIds, manager);
      return { id: savedShipment.Id };
    });
  }

  async findAll(): Promise<ShipmentResponseDto[]> {
    const shipments = await this.shipmentRepository.find({
      relations: [
        'ShipmentCarrier',
        'Boxes',
        'Boxes.OrderItem',
        'ShipmentOrders',
        'ShipmentOrders.Order',
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });

    return shipments.map((shipmentItem) => ({
      Id: shipmentItem.Id,
      Orders: shipmentItem.ShipmentOrders?.map(so => ({ Id: so.OrderId, OrderName: so.Order?.OrderName ?? '', })) ?? [],
      ShipmentCode: shipmentItem.ShipmentCode,
      TrackingId: shipmentItem.TrackingId,
      ShipmentDate: shipmentItem.ShipmentDate,
      ShipmentCost: shipmentItem.ShipmentCost,
      WeightUnit: shipmentItem.WeightUnit,
      TotalWeight: shipmentItem.TotalWeight,
      NumberOfBoxes: shipmentItem.NumberOfBoxes,
      ReceivedTime: shipmentItem.ReceivedTime,
      Boxes: [...shipmentItem.Boxes],
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
        'Boxes',
        'Boxes.OrderItem',
        'ShipmentOrders',
        'ShipmentOrders.Order',
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });
    if (!shippment) throw new NotFoundException(`Shipment with ${id} not found`)
    return {
      ShipmentCode: shippment?.ShipmentCode ?? '',
      TrackingId: shippment?.TrackingId ?? '',
      OrderNumber: shippment?.OrderNumber ?? '',
      OrderIds: shippment?.ShipmentOrders?.map(so => so.OrderId) ?? [],
      ShipmentCarrierId: shippment?.ShipmentCarrierId ?? '',
      ShipmentDate: shippment?.ShipmentDate ?? '',
      ShipmentCost: shippment?.ShipmentCost ?? 0,
      TotalWeight: shippment?.TotalWeight ?? 0,
      NumberOfBoxes: shippment?.NumberOfBoxes ?? 0,
      WeightUnit: shippment?.WeightUnit ?? '',
      ReceivedTime: shippment?.ReceivedTime ?? '',
      Status: shippment?.Status ?? '',
      boxes: shippment?.Boxes.map(box => ({
        BoxNumber: box?.BoxNumber,
        Quantity: box?.Quantity,
        Weight: box?.Weight,
        OrderItemName: box?.OrderItemName ?? '',
      })) ?? []
    }
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto, updatedBy: string) {
    const existingShipment = await this.shipmentRepository.findOne({ where: { Id: id } });
    if (!existingShipment) throw new NotFoundException(`Shipment with ID ${id} not found`);

    return await this.dataSource.transaction(async manager => {
      const shipmentRepo = manager.getRepository(Shipment);
      const shipmentBoxRepo = manager.getRepository(ShipmentBox);
      const orderItemRepo = manager.getRepository(OrderItem);
      const orderRepo = manager.getRepository(Order);
      const shipmentOrderRepo = manager.getRepository(ShipmentOrder);

      const {
        OrderIds,
        ShipmentCode,
        TrackingId,
        OrderNumber,
        ShipmentCarrierId,
        ShipmentDate,
        ShipmentCost,
        TotalWeight,
        NumberOfBoxes,
        WeightUnit,
        ReceivedTime,
        Status,
        boxes, // expects [{ BoxNumber, Weight, Quantity, OrderItemId?, OrderItemName, OrderItemDescription? }]
      } = updateShipmentDto;

      // If boxes are provided, optionally ensure count matches NumberOfBoxes (when provided)
      if (boxes && Array.isArray(boxes) && NumberOfBoxes !== undefined && boxes.length !== NumberOfBoxes) {
        throw new BadRequestException('NumberOfBoxes does not match boxes length.');
      }

      // If carrier changed, validate new carrier
      if (ShipmentCarrierId && ShipmentCarrierId !== existingShipment.ShipmentCarrierId) {
        const carrier = await this.shipmentCarrierRepository.findOne({ where: { Id: ShipmentCarrierId } });
        if (!carrier) throw new NotFoundException(`Carrier with ID ${ShipmentCarrierId} not found`);
        existingShipment.ShipmentCarrierId = ShipmentCarrierId;
      }

      let newOrderIdSet: Set<number> | null = null;
      if (Array.isArray(OrderIds)) {
        newOrderIdSet = new Set<number>(OrderIds.map(Number));
        const verifiedOrder = await orderRepo.findBy({ Id: In([...newOrderIdSet]) });
        if (verifiedOrder.length !== newOrderIdSet.size) {
          throw new BadRequestException('Some Orders are invalid.');
        }
      }

      // Validate OrderItemIds (when boxes provided)
      if (Array.isArray(boxes) && boxes.length > 0) {
        const orderItemIds = [...new Set(
          boxes.filter(b => b?.OrderItemId != null).map(b => Number(b.OrderItemId))
        )];

        if (orderItemIds.length > 0) {
          const verifiedOrderItems = await orderItemRepo.findBy({ Id: In(orderItemIds) });
          if (verifiedOrderItems.length !== orderItemIds.length) {
            throw new BadRequestException('Some Order Items are invalid.');
          }

          // Ensure each OrderItem belongs to an Order linked to this shipment (new or current)
          // Determine allowed order ids for this shipment:
          let allowedOrderIds: Set<number>;
          if (newOrderIdSet) {
            allowedOrderIds = newOrderIdSet; // we are about to update links to these
          } else {
            const currentLinks = await shipmentOrderRepo.findBy({ ShipmentId: id });
            allowedOrderIds = new Set(currentLinks.map(l => l.OrderId));
          }

          const badItem = verifiedOrderItems.find(oi => !allowedOrderIds.has(oi.OrderId));
          if (badItem) {
            throw new BadRequestException(`OrderItem ${badItem.Id} (OrderId=${badItem.OrderId}) is not part of any linked order for this shipment.`);
          }
        }
      }

      // Apply field updates
      if (OrderNumber !== undefined) existingShipment.OrderNumber = OrderNumber;
      if (ShipmentCode !== undefined) existingShipment.ShipmentCode = ShipmentCode;
      if (TrackingId !== undefined) existingShipment.TrackingId = TrackingId;
      if (ShipmentDate !== undefined) existingShipment.ShipmentDate = new Date(ShipmentDate);
      if (ShipmentCost !== undefined) existingShipment.ShipmentCost = ShipmentCost;
      if (TotalWeight !== undefined) existingShipment.TotalWeight = TotalWeight;
      if (NumberOfBoxes !== undefined) existingShipment.NumberOfBoxes = NumberOfBoxes;
      if (WeightUnit !== undefined) existingShipment.WeightUnit = WeightUnit;
      if (ReceivedTime !== undefined) {
        existingShipment.ReceivedTime = ReceivedTime ? new Date(ReceivedTime) : null;
      }
      if (Status !== undefined) existingShipment.Status = Status;
      existingShipment.UpdatedBy = updatedBy;

      await shipmentRepo.save(existingShipment);

      const prevLinks = await shipmentOrderRepo.findBy({ ShipmentId: id });
      const prevOrderIdSet = new Set(prevLinks.map(l => l.OrderId));

      if (newOrderIdSet) {
        // Replace links
        await shipmentOrderRepo.delete({ ShipmentId: id });
        if (newOrderIdSet.size > 0) {
          await shipmentOrderRepo.insert(
            [...newOrderIdSet].map(oid => ({ ShipmentId: id, OrderId: oid }))
          );
        }
      }

      let affectedItemIds: number[] = [];
      if (Array.isArray(boxes)) {
        // 1) Collect previous item ids BEFORE delete (to handle removals)
        const prevBoxes = await shipmentBoxRepo.find({ where: { ShipmentId: id } });
        const prevItemIds = prevBoxes
          .map(b => b.OrderItemId)
          .filter((x): x is number => !!x);

        // 2) Replace boxes
        await shipmentBoxRepo.delete({ ShipmentId: id });

        if (boxes.length > 0) {
          await shipmentBoxRepo.insert(
            boxes.map(box => ({
              ShipmentId: id,
              BoxNumber: box.BoxNumber,
              Weight: box.Weight,
              Quantity: box.Quantity,
              OrderItemId: box.OrderItemId ?? null,
              OrderItemName: box.OrderItemName,
              OrderItemDescription: box.OrderItemDescription ?? null,
            }))
          );
        }

        // 3) Collect new item ids
        const newItemIds = boxes
          .map(b => b.OrderItemId)
          .filter((x): x is number => !!x);

        // 4) Union of old + new affected items
        affectedItemIds = [...new Set([...prevItemIds, ...newItemIds])];

        // 5) Recalc item shipping status
        if (affectedItemIds.length) {
          await this.recalcOrderItems(affectedItemIds, manager);
        }
      }

      // ===== Recalc order-level shipping status =====
      // Determine orders to recalc: union of (previous links) ∪ (current links) ∪ (orders owning affected items)
      const currentLinks = await shipmentOrderRepo.findBy({ ShipmentId: id });
      const currentOrderIdSet = new Set(currentLinks.map(l => l.OrderId));

      let affectedOrderIds: number[] = [
        ...new Set([
          ...prevOrderIdSet,
          ...currentOrderIdSet
        ].map(Number))
      ] as unknown as number[]; // ts appeasement

      if (affectedItemIds.length) {
        const affectedItems = await orderItemRepo.findBy({ Id: In(affectedItemIds) });
        const itemOrderIds = [...new Set(affectedItems.map(i => i.OrderId))];
        affectedOrderIds = [...new Set([...affectedOrderIds, ...itemOrderIds])];
      }

      if (affectedOrderIds.length) {
        await this.recalcOrders(affectedOrderIds, manager);
      }

      return { id: existingShipment.Id };
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.dataSource.transaction(async manager => {
      const boxRepo = manager.getRepository(ShipmentBox);
      const soRepo = manager.getRepository(ShipmentOrder);

      // Grab affected IDs BEFORE deletion
      const boxes = await boxRepo.find({ where: { ShipmentId: id } });
      const affectedItemIds = [...new Set(
        boxes.map(b => b.OrderItemId).filter((x): x is number => !!x)
      )];

      const links = await soRepo.findBy({ ShipmentId: id });
      const affectedOrderIds = [...new Set(links.map(so => so.OrderId))];

      // Delete children then shipment
      await soRepo.delete({ ShipmentId: id });
      await boxRepo.delete({ ShipmentId: id });
      const res = await manager.getRepository(Shipment).delete(id);
      if (!res.affected) throw new InternalServerErrorException('Failed to delete shipment');

      // ✅ Recalc after removal (sums reflect remaining boxes)
      await this.recalcOrderItems(affectedItemIds, manager);
      await this.recalcOrders(affectedOrderIds, manager);
    });

    return { message: 'Deleted successfully' };
  }

  private async recalcOrderItems(orderItemIds: number[], manager: EntityManager) {
    if (!orderItemIds?.length) return;

    // shipped per item (across ALL shipments)
    const shippedRows = await manager.getRepository(ShipmentBox)
      .createQueryBuilder('b')
      .select('b.OrderItemId', 'orderItemId')
      .addSelect('SUM(b.Quantity)', 'shipped')
      .where('b.OrderItemId IN (:...ids)', { ids: orderItemIds })
      .groupBy('b.OrderItemId')
      .getRawMany<{ orderItemId: string; shipped: string }>();

    const shippedMap = new Map<number, number>(
      shippedRows.map(r => [Number(r.orderItemId), Number(r.shipped)])
    );

    // required per item
    const reqRows = await manager.getRepository(OrderItemDetails)
      .createQueryBuilder('d')
      .select('d.OrderItemId', 'orderItemId')
      .addSelect('SUM(d.Quantity)', 'required')
      .where('d.OrderItemId IN (:...ids)', { ids: orderItemIds })
      .groupBy('d.OrderItemId')
      .getRawMany<{ orderItemId: string; required: string }>();

    const requiredMap = new Map<number, number>(
      reqRows.map(r => [Number(r.orderItemId), Number(r.required)])
    );

    const items = await manager.getRepository(OrderItem).findBy({ Id: In(orderItemIds) });

    for (const it of items) {
      const shipped = shippedMap.get(it.Id) ?? 0;
      const required = requiredMap.get(it.Id) ?? 0;
      console.log(shipped, required)
      // status rules (simple & robust)
      let status: OrderItemShipmentEnum;
      if (shipped <= 0) status = OrderItemShipmentEnum.PENDING;
      else if (required > 0 && shipped < required) status = OrderItemShipmentEnum.PARTIALLY_SHIPPED;
      else status = OrderItemShipmentEnum.SHIPPED;

      it.itemShipmentStatus = status;
    }
    await manager.getRepository(OrderItem).save(items);
  }


  private async recalcOrders(orderIds: number[], manager: EntityManager) {
    if (!orderIds?.length) return;

    const orderRepo = manager.getRepository(Order);
    const itemRepo = manager.getRepository(OrderItem);

    const [orders, items] = await Promise.all([
      orderRepo.findBy({ Id: In(orderIds) }),
      itemRepo.findBy({ OrderId: In(orderIds) }),
    ]);

    const byOrder = new Map<number, OrderItem[]>();
    for (const it of items) {
      const arr = byOrder.get(it.OrderId) ?? [];
      arr.push(it);
      byOrder.set(it.OrderId, arr);
    }

    for (const order of orders) {
      const arr = byOrder.get(order.Id) ?? [];
      const allShipped = arr.length > 0 && arr.every(i => i.itemShipmentStatus === OrderItemShipmentEnum.SHIPPED);
      const anyShipped = arr.some(i =>
        i.itemShipmentStatus === OrderItemShipmentEnum.SHIPPED ||
        i.itemShipmentStatus === OrderItemShipmentEnum.PARTIALLY_SHIPPED
      );

      const next: OrderItemShipmentEnum =
        allShipped ? OrderItemShipmentEnum.SHIPPED
          : anyShipped ? OrderItemShipmentEnum.PARTIALLY_SHIPPED
            : OrderItemShipmentEnum.PENDING;

      if (order.OrderShipmentStatus !== next) {
        order.OrderShipmentStatus = next;
      }
    }

    await orderRepo.save(orders);
  }

}


