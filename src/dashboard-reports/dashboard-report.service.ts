import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from '../orders/entities/orders.entity';
import { Product } from '../products/entities/product.entity';
import { Shipment } from '../shipment/entities/shipment.entity';
import { Client } from '../clients/entities/client.entity';
import { OrderStatus } from '../orderstatus/entities/orderstatus.entity';
import { InventoryItems } from '../inventory-items/_/inventory-items.entity';
import { User } from '../users/entities/user.entity';
import { ShipmentStatus } from '../shipment/entities/shipment.entity';

@Injectable()
export class DashboardReportService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(InventoryItems)
    private inventoryItemsRepository: Repository<InventoryItems>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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

  // 1. Dashboard Widgets APIs
  async getDashboardWidgets(userId: number) {
    const assignedClientIds = await this.getClientsForUser(userId);

    // Total Orders
    let totalOrdersQuery = this.orderRepository.createQueryBuilder('order');
    if (assignedClientIds.length > 0) {
      totalOrdersQuery = totalOrdersQuery.where('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }
    const totalOrders = await totalOrdersQuery.getCount();

    // Total Products
    let totalProductsQuery = this.productRepository.createQueryBuilder('product');
    if (assignedClientIds.length > 0) {
      totalProductsQuery = totalProductsQuery.where('product.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }
    const totalProducts = await totalProductsQuery.getCount();

    // Total Shipments
    let totalShipmentsQuery = this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoin('shipment.ShipmentOrders', 'shipmentOrder')
      .leftJoin('shipmentOrder.Order', 'order');
    
    if (assignedClientIds.length > 0) {
      totalShipmentsQuery = totalShipmentsQuery.where('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }
    const totalShipments = await totalShipmentsQuery.getCount();

    // Total Clients
    let totalClientsQuery = this.clientRepository.createQueryBuilder('client');
    if (assignedClientIds.length > 0) {
      totalClientsQuery = totalClientsQuery.where('client.Id IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }
    const totalClients = await totalClientsQuery.getCount();

    return {
      totalOrders,
      totalProducts,
      totalShipments,
      totalClients,
    };
  }

  // 2. Order Summary and Status APIs
  async getOrderStatusSummary(userId: number) {
    const assignedClientIds = await this.getClientsForUser(userId);

    let query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.status', 'status')
      .select([
        'status.Id as statusId',
        'status.StatusName as statusName',
        'COUNT(order.Id) as count',
      ])
      .groupBy('status.Id, status.StatusName');

    if (assignedClientIds.length > 0) {
      query = query.where('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const statusSummary = await query.getRawMany();

    return statusSummary.map(item => ({
      statusId: item.statusId,
      statusName: item.statusName,
      count: parseInt(item.count),
    }));
  }

  async getOrderSummaryByMonth(userId: number, year: number = new Date().getFullYear()) {
    const assignedClientIds = await this.getClientsForUser(userId);

    // Orders created per month
    let createdQuery = this.orderRepository
      .createQueryBuilder('order')
      .select([
        'MONTH(order.CreatedOn) as month',
        'COUNT(order.Id) as createdCount',
      ])
      .where('YEAR(order.CreatedOn) = :year', { year })
      .groupBy('MONTH(order.CreatedOn)');

    if (assignedClientIds.length > 0) {
      createdQuery = createdQuery.andWhere('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const createdOrders = await createdQuery.getRawMany();

    // Orders shipped per month (assuming shipped status has specific ID)
    let shippedQuery = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.status', 'status')
      .select([
        'MONTH(order.CreatedOn) as month',
        'COUNT(order.Id) as shippedCount',
      ])
      .where('YEAR(order.CreatedOn) = :year', { year })
      .andWhere('status.StatusName LIKE :shippedStatus', { shippedStatus: '%Shipped%' })
      .groupBy('MONTH(order.CreatedOn)');

    if (assignedClientIds.length > 0) {
      shippedQuery = shippedQuery.andWhere('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const shippedOrders = await shippedQuery.getRawMany();

    // Create month data for all 12 months
    const monthData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const created = createdOrders.find(item => parseInt(item.month) === month);
      const shipped = shippedOrders.find(item => parseInt(item.month) === month);
      
      return {
        month,
        monthName: new Date(year, index).toLocaleString('default', { month: 'long' }),
        created: created ? parseInt(created.createdCount) : 0,
        shipped: shipped ? parseInt(shipped.shippedCount) : 0,
      };
    });

    return monthData;
  }

  async getLateOrders(userId: number) {
    const assignedClientIds = await this.getClientsForUser(userId);
    const currentDate = new Date();

    let query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.client', 'client')
      .leftJoin('order.status', 'status')
      .select([
        'order.Id as orderId',
        'order.OrderNumber as orderNumber',
        'order.OrderName as orderName',
        'order.Deadline as deadline',
        'client.Name as clientName',
        'status.StatusName as statusName',
        'DATEDIFF(:currentDate, order.Deadline) as daysLate',
      ])
      .where('order.Deadline < :currentDate', { currentDate })
      .andWhere('status.StatusName NOT LIKE :completedStatus', { completedStatus: '%Completed%' })
      .andWhere('status.StatusName NOT LIKE :shippedStatus', { shippedStatus: '%Shipped%' })
      .orderBy('order.Deadline', 'ASC');

    if (assignedClientIds.length > 0) {
      query = query.andWhere('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const lateOrders = await query.getRawMany();

    return lateOrders.map(order => ({
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      orderName: order.orderName,
      deadline: order.deadline,
      clientName: order.clientName,
      statusName: order.statusName,
      daysLate: parseInt(order.daysLate),
    }));
  }

  // 3. Top Clients API
  async getTopClients(userId: number, limit: number = 10) {
    const assignedClientIds = await this.getClientsForUser(userId);

    let query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.client', 'client')
      .select([
        'client.Id as clientId',
        'client.Name as clientName',
        'COUNT(order.Id) as orderCount',
        'SUM(CASE WHEN order.OrderStatusId = 1 THEN 1 ELSE 0 END) as pendingOrders',
        'SUM(CASE WHEN order.OrderStatusId > 1 THEN 1 ELSE 0 END) as completedOrders',
      ])
      .groupBy('client.Id, client.Name')
      .orderBy('orderCount', 'DESC')
      .limit(limit);

    if (assignedClientIds.length > 0) {
      query = query.where('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const topClients = await query.getRawMany();

    return topClients.map(client => ({
      clientId: client.clientId,
      clientName: client.clientName,
      orderCount: parseInt(client.orderCount),
      pendingOrders: parseInt(client.pendingOrders),
      completedOrders: parseInt(client.completedOrders),
    }));
  }

  // 4. Shipments Dashboard APIs
  async getShipmentsSummary(userId: number) {
    const assignedClientIds = await this.getClientsForUser(userId);

    let query = this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoin('shipment.ShipmentOrders', 'shipmentOrder')
      .leftJoin('shipmentOrder.Order', 'order')
      .select([
        'COUNT(shipment.Id) as totalShipments',
        'SUM(CASE WHEN shipment.Status = :inTransit THEN 1 ELSE 0 END) as inTransit',
        'SUM(CASE WHEN shipment.Status = :delivered THEN 1 ELSE 0 END) as delivered',
        'SUM(CASE WHEN shipment.Status = :damaged THEN 1 ELSE 0 END) as damaged',
        'SUM(CASE WHEN shipment.Status = :cancelled THEN 1 ELSE 0 END) as cancelled',
      ])
      .setParameters({
        inTransit: ShipmentStatus.IN_TRANSIT,
        delivered: ShipmentStatus.DELIVERED,
        damaged: ShipmentStatus.DAMAGED,
        cancelled: ShipmentStatus.CANCELLED,
      });

    if (assignedClientIds.length > 0) {
      query = query.where('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const summary = await query.getRawOne();

    // Calculate on-time delivered (assuming delivered shipments are on-time)
    const onTimeDelivered = summary.delivered || 0;

    return {
      totalShipments: parseInt(summary.totalShipments) || 0,
      inTransit: parseInt(summary.inTransit) || 0,
      delivered: parseInt(summary.delivered) || 0,
      damaged: parseInt(summary.damaged) || 0,
      cancelled: parseInt(summary.cancelled) || 0,
      onTimeDelivered,
    };
  }

  // 5. Stock Level Dashboard APIs
  async getStockLevels(userId: number) {
    // Note: Inventory items are shared across all clients, no client filtering applied
    const query = this.inventoryItemsRepository
      .createQueryBuilder('inventory')
      .select([
        'inventory.Id as itemId',
        'inventory.Name as itemName',
        'inventory.ItemCode as itemCode',
        'inventory.Stock as currentStock',
        'inventory.ReorderLevel as reorderLevel',
        'CASE ' +
        'WHEN inventory.Stock IS NULL OR inventory.Stock = 0 THEN "Out of Stock" ' +
        'WHEN inventory.Stock <= inventory.ReorderLevel THEN "Low Stock" ' +
        'WHEN inventory.Stock <= (inventory.ReorderLevel * 1.5) THEN "Near Low" ' +
        'ELSE "High in Stock" ' +
        'END as stockLevel',
      ])
      .where('inventory.DeletedAt IS NULL');

    const stockItems = await query.getRawMany();

    // Group by stock level
    const stockLevels = {
      'High in Stock': stockItems.filter(item => item.stockLevel === 'High in Stock'),
      'Near Low': stockItems.filter(item => item.stockLevel === 'Near Low'),
      'Low Stock': stockItems.filter(item => item.stockLevel === 'Low Stock'),
      'Out of Stock': stockItems.filter(item => item.stockLevel === 'Out of Stock'),
    };

    return {
      summary: {
        highInStock: stockLevels['High in Stock'].length,
        nearLow: stockLevels['Near Low'].length,
        lowStock: stockLevels['Low Stock'].length,
        outOfStock: stockLevels['Out of Stock'].length,
      },
      details: stockLevels,
    };
  }

  // 6. Top Products API
  async getTopProducts(userId: number, limit: number = 10) {
    const assignedClientIds = await this.getClientsForUser(userId);

    let query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.orderItems', 'orderItem')
      .leftJoin('orderItem.product', 'product')
      .leftJoin('order.client', 'client')
      .select([
        'product.Id as productId',
        'product.Name as productName',
        'COUNT(DISTINCT order.Id) as orderCount',
        'COUNT(orderItem.Id) as itemCount',
        'SUM(orderItemDetail.Quantity) as totalQuantity',
      ])
      .leftJoin('orderItem.orderItemDetails', 'orderItemDetail')
      .groupBy('product.Id, product.Name')
      .orderBy('orderCount', 'DESC')
      .limit(limit);

    if (assignedClientIds.length > 0) {
      query = query.where('order.ClientId IN (:...assignedClientIds)', {
        assignedClientIds,
      });
    }

    const topProducts = await query.getRawMany();

    return topProducts.map(product => ({
      productId: product.productId,
      productName: product.productName,
      orderCount: parseInt(product.orderCount),
      itemCount: parseInt(product.itemCount),
      totalQuantity: parseInt(product.totalQuantity) || 0,
    }));
  }
}
