import { DataSource, EntityManager } from 'typeorm';
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto, ShipmentResponseDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShipmentCarrier } from 'src/shipment-carrier/entities/shipment-carrier.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentBox, ShipmentBoxItem } from './entities/shipment-box.entity';
import { ShipmentOrder } from './entities/shipment-order.entity';
import { OrderItem, OrderItemShipmentEnum } from 'src/orders/entities/order-item.entity';
import { OrderItemDetails } from 'src/orders/entities/order-item-details';
import { Order } from 'src/orders/entities/orders.entity';
import { User } from 'src/users/entities/user.entity';

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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private dataSource: DataSource

  ) { }

  private async getClientsForUser(userId: number): Promise<number[]> {

    const user = await this.userRepository.findOne({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const assignedClientIds: number[] = user.assignedClients || [];

    if (!assignedClientIds.length) {
      return [];
    }
    return assignedClientIds;
  }

  async create(createShipmentDto: CreateShipmentDto, createdBy: any, userId: number) {
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

    const assignedClientIds = await this.getClientsForUser(userId);

    const orderIds = new Set(createShipmentDto.OrderIds);
    const verifiedOrder = await this.orderRepository.findBy({ Id: In(Array.from(orderIds)) });
    if (verifiedOrder.length !== Array.from(orderIds).length) {
      throw new BadRequestException('Some Orders are invalid.');
    }

    if (assignedClientIds.length > 0) {
    const unauthorizedOrder = verifiedOrder.find(order => !assignedClientIds.includes(order.ClientId));
    if (unauthorizedOrder) {
      throw new ForbiddenException(
        `Order ${unauthorizedOrder.Id} is not accessible for this user`
      );
    }
  }

    const orderItemIds = new Set(
      boxes.flatMap(box => box.items?.map(it => it?.OrderItemId) ?? [])
    );
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
          ShipmentId: savedShipment.Id,
          BoxNumber: box.BoxNumber,
          Weight: box.Weight,
          OrderItemName: box.OrderItemName,
          ShipmentBoxItems: (box.items || []).map(it =>
            manager.getRepository(ShipmentBoxItem).create({
              OrderItemId: it.OrderItemId,
              OrderItemDescription: it.OrderItemDescription ?? null,
              Quantity: it.Quantity,
            })
          )
        })
      );

      await manager.getRepository(ShipmentBox).save(boxEntities);

      const affectedItemIds = [...new Set(
        boxes.flatMap(b => (b.items || []).map(it => it.OrderItemId)).filter((id): id is number => !!id)
      )];
      await this.recalcOrderItems(affectedItemIds, manager);

      // ✅ Recalc order-level shipping status from their items
      const affectedOrderIds = verifiedOrder.map(o => o.Id);
      await this.recalcOrders(affectedOrderIds, manager);
      return { id: savedShipment.Id };
    });
  }

  async findAll(userId: number): Promise<ShipmentResponseDto[]> {

    const assignedClientIds = await this.getClientsForUser(userId);

    const shipments = await this.shipmentRepository.find({
      relations: [
        'ShipmentCarrier',
        'Boxes',
        'Boxes.ShipmentBoxItems',
        'ShipmentOrders',
        'ShipmentOrders.Order',
        'ShipmentOrders.Order.Client'
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });

    const filteredShipments = shipments.filter(shipment => {
      if (assignedClientIds.length === 0) return true;
      return shipment.ShipmentOrders?.some(so => assignedClientIds.includes(so.Order?.ClientId));
    });

    return filteredShipments.map((shipmentItem) => ({
      Id: shipmentItem.Id,
      OrderIds: shipmentItem.ShipmentOrders?.map(so => so.OrderId) ?? [],
      Orders: shipmentItem.ShipmentOrders?.map(so => ({ Id: so.OrderId, OrderName: so.Order?.OrderName ?? '', OrderNumber: so.Order?.OrderNumber ?? '' })) ?? [],
      ShipmentCode: shipmentItem.ShipmentCode,
      TrackingId: shipmentItem.TrackingId,
      ShipmentDate: shipmentItem.ShipmentDate,
      ShipmentCost: shipmentItem.ShipmentCost,
      WeightUnit: shipmentItem.WeightUnit,
      TotalWeight: shipmentItem.TotalWeight,
      NumberOfBoxes: shipmentItem.NumberOfBoxes,
      ReceivedTime: shipmentItem.ReceivedTime,
      Boxes: shipmentItem.Boxes?.map(b => ({
        Id: b.Id,
        BoxNumber: b.BoxNumber,
        Weight: b.Weight,
        OrderItemName: b.OrderItemName,
        items: (b.ShipmentBoxItems || []).map(it => ({
          Id: it.Id,
          OrderItemId: it.OrderItemId,
          OrderItemDescription: it.OrderItemDescription,
          Quantity: it.Quantity,
        }))
      })) ?? [],
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

  async findOne(id: number, userId: number) {

    const assignedClientIds = await this.getClientsForUser(userId);

    const shippment = await this.shipmentRepository.findOne({
      where: { Id: id },
      relations: [
        'ShipmentCarrier',
        'Boxes',
        'Boxes.ShipmentBoxItems',
        'Boxes.ShipmentBoxItems.OrderItem',
        'Boxes.ShipmentBoxItems.OrderItem.product',
        'ShipmentOrders',
        'ShipmentOrders.Order',
      ],
      order: {
        ShipmentDate: 'DESC',
      },
    });
    if (!shippment) throw new NotFoundException(`Shipment with ${id} not found`)
    if (assignedClientIds.length > 0) {
      const hasAccess = shippment.ShipmentOrders?.every(
        so => assignedClientIds.includes(so.Order?.ClientId)
      );

      if (!hasAccess) {
        throw new ForbiddenException(`You don't have access to this shipment`);
      }
    }
  
    return {
      ShipmentCode: shippment?.ShipmentCode ?? '',
      TrackingId: shippment?.TrackingId ?? '',
      OrderNumber: shippment?.OrderNumber ?? '',
      OrderIds: shippment?.ShipmentOrders?.map(so => so.OrderId) ?? [],
      Orders: shippment?.ShipmentOrders?.map(so => ({ Id: so.OrderId, OrderName: so.Order?.OrderName ?? '', OrderNumber: so.Order?.OrderNumber ?? '' })) ?? [],
      ShipmentCarrierId: shippment?.ShipmentCarrier?.Id ?? null,
      ShipmentCarrierName: shippment?.ShipmentCarrier?.Name ?? 'Unknown',
      ShipmentDate: shippment?.ShipmentDate ?? '',
      ShipmentCost: shippment?.ShipmentCost ?? 0,
      TotalWeight: shippment?.TotalWeight ?? 0,
      NumberOfBoxes: shippment?.NumberOfBoxes ?? 0,
      WeightUnit: shippment?.WeightUnit ?? '',
      ReceivedTime: shippment?.ReceivedTime ?? '',
      Status: shippment?.Status ?? '',
      CreatedOn: shippment?.CreatedOn,
      CreatedBy: shippment?.CreatedBy,
      UpdatedOn: shippment?.UpdatedOn,
      UpdatedBy: shippment?.UpdatedBy,
      boxes: shippment?.Boxes.map(box => ({
        Id: box?.Id,
        BoxNumber: box?.BoxNumber,
        Weight: box?.Weight,
        OrderBoxDescription: box.OrderBoxDescription,
        OrderItemName: box?.OrderItemName ?? '',
        items: (box?.ShipmentBoxItems || []).map(it => ({
          Id: it.Id,
          OrderItemId: it.OrderItemId,
          OrderItemName: it.OrderItem?.product?.Name ?? '',
          OrderItemDescription: it.OrderItemDescription ?? '',
          Quantity: it.Quantity,
        }))
      })) ?? []
    }
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto, updatedBy: string, userId: number) {
    const existingShipment = await this.shipmentRepository.findOne({ where: { Id: id } });
    if (!existingShipment) throw new NotFoundException(`Shipment with ID ${id} not found`);

    const assignedClientIds = await this.getClientsForUser(userId);

    if (assignedClientIds.length > 0) {
      const hasAccess = existingShipment.ShipmentOrders.every(
        so => assignedClientIds.includes(so.Order?.ClientId)
      );
      if (!hasAccess) {
        throw new ForbiddenException(`You don't have access to update this shipment`);
      }
    }

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
          boxes.flatMap(b => (b.items || []).map(it => Number(it.OrderItemId)))
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
        const prevBoxes = await shipmentBoxRepo.find({ where: { ShipmentId: id }, relations: ['ShipmentBoxItems'] });
        const prevItemIds = prevBoxes
          .flatMap(b => b.ShipmentBoxItems?.map(it => it.OrderItemId) ?? [])
          .filter((x): x is number => !!x);

        // 2) Replace boxes
        await shipmentBoxRepo.delete({ ShipmentId: id });

        if (boxes.length > 0) {
          const newBoxes = boxes.map(box => shipmentBoxRepo.create({
            ShipmentId: id,
            BoxNumber: box.BoxNumber,
            Weight: box.Weight,
            OrderBoxDescription: box.OrderBoxDescription,
            OrderItemName: box.OrderItemName,
            ShipmentBoxItems: (box.items || []).map(it => manager.getRepository(ShipmentBoxItem).create({
              OrderItemId: it.OrderItemId,
              OrderItemDescription: it.OrderItemDescription ?? null,
              Quantity: it.Quantity,
            }))
          }));
          await shipmentBoxRepo.save(newBoxes);
        }

        // 3) Collect new item ids
        const newItemIds = boxes
          .flatMap(b => (b.items || []).map(it => it.OrderItemId))
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

  async remove(id: number, userId: number) {

    await this.findOne(id, userId);

    await this.dataSource.transaction(async manager => {
      const boxRepo = manager.getRepository(ShipmentBox);
      const soRepo = manager.getRepository(ShipmentOrder);

      // Grab affected IDs BEFORE deletion
      const boxes = await boxRepo.find({ where: { ShipmentId: id }, relations: ['ShipmentBoxItems'] });
      const affectedItemIds = [...new Set(
        boxes.flatMap(b => b.ShipmentBoxItems?.map(it => it.OrderItemId) ?? []).filter((x): x is number => !!x)
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
    const shippedRows = await manager.getRepository(ShipmentBoxItem)
      .createQueryBuilder('bi')
      .select('bi.OrderItemId', 'orderItemId')
      .addSelect('SUM(bi.Quantity)', 'shipped')
      .where('bi.OrderItemId IN (:...ids)', { ids: orderItemIds })
      .groupBy('bi.OrderItemId')
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


