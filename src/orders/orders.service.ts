import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In  } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsPrintingOption } from './entities/order-item-printiing.option.entity';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrderItemDetails } from './entities/order-item-details';
import { DataSource } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemsPrintingOption)
    private orderItemsPrintingOptionRepository: Repository<OrderItemsPrintingOption>,
    @InjectRepository(OrderItemDetails)
    private orderItemDetailRepository: Repository<OrderItemDetails>,
    private dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, createdBy: number): Promise<Order> {
    const { ClientId, OrderEventId, Description, OrderStatusId, Deadline, OrderPriority,ExternalOrderId,OrderName,OrderNumber, items } = createOrderDto;
  
    const newOrder = this.orderRepository.create({
      ClientId,
      OrderEventId,
      Description,
      OrderStatusId,
      Deadline,
      OrderPriority,
      ExternalOrderId,
      OrderName,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
    });
  
    const savedOrder = await this.orderRepository.save(newOrder);
  
    if (Array.isArray(items) && items.length > 0) {
      
      const orderItems = items.map((item) => ({
        OrderId: savedOrder.Id,
        ProductId: item.ProductId,
        Description: item.Description,
        OrderItemPriority: item.OrderItemPriority || 0,
        ImageId: item.ImageId,
        FileId: item.FileId,
        VideoId: item.VideoId,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
      }));
  
      const savedOrderItems = await this.orderItemRepository.save(orderItems);
  
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
  
        if (Array.isArray(item.orderItemDetails) && item.ProductId) {
          const orderItemDetails = item.orderItemDetails.map((option) => ({
            OrderItemId: savedOrderItems[i].Id,
            ColorOptionId: option.ColorOptionId,
            Quantity: option.Quantity,
            Priority: option.Priority,
            CreatedBy: createdBy,
            UpdatedBy: createdBy,
            CreatedOn: new Date(),
            UpdatedOn: new Date(),
          }));
          await this.orderItemDetailRepository.save(orderItemDetails);
        }
  
        if (Array.isArray(item.printingOptions) && item.printingOptions.length > 0) {
          const printingOptions = item.printingOptions.map((option) => ({
            OrderItemId: savedOrderItems[i].Id,
            PrintingOptionId: option.PrintingOptionId,
            Description: option.Description,
          }));
  
          await this.orderItemsPrintingOptionRepository.save(printingOptions);
        }
      }
    }
  
    return savedOrder;
  }  

  async getAllOrders(paginationDto?: PaginationDto): Promise<any> {
    try {
      const { page = 1, limit = 10 } = paginationDto || {};
      const skip = (page - 1) * limit;

      const result = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('client', 'client', 'order.ClientId = client.Id')
        .leftJoin('clientevent', 'event', 'order.OrderEventId = event.Id')
        .leftJoin('orderstatus', 'status', 'order.OrderStatusId = status.Id')
        .select([
          'order.Id AS Id',
          'order.ClientId AS ClientId',
          'client.Name AS ClientName',
          'order.OrderEventId AS OrderEventId',
          'event.EventName AS EventName',
          'order.Description AS Description',
          'order.OrderStatusId AS OrderStatusId',
          'status.StatusName AS StatusName',
          'order.Deadline AS Deadline',
          'order.OrderPriority AS OrderPriority',
          'order.OrderNumber AS OrderNumber',
          'order.OrderName AS OrderName',
          'order.ExternalOrderId AS ExternalOrderId',
          'order.CreatedOn AS CreatedOn',
          'order.UpdatedOn AS UpdatedOn'
        ])
        .orderBy('order.CreatedOn', 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany();

      const total = await this.orderRepository
        .createQueryBuilder('order')
        .getCount();

      const formattedOrders = result.map(order => ({
        Id: order.Id,
        ClientId: order.ClientId,
        ClientName: order.ClientName,
        OrderEventId: order.OrderEventId,
        EventName: order.EventName,
        Description: order.Description,
        OrderStatusId: order.OrderStatusId,
        StatusName: order.StatusName,
        Deadline: order.Deadline,
        OrderPriority: order.OrderPriority,
        OrderNumber: order.OrderNumber,
        OrderName: order.OrderName,
        ExternalOrderId: order.ExternalOrderId,
        CreatedOn: order.CreatedOn,
        UpdatedOn: order.UpdatedOn
      }));

      return {
        data: formattedOrders,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      throw error;
    }
  }
  

  async getOrdersByClientId(clientId: number): Promise<any[]> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndMapOne(
        'order.EventName',
        'clientevent',
        'event',
        'order.OrderEventId = event.Id',
      )
      .leftJoinAndMapOne(
        'order.ClientName',
        'client',
        'client',
        'order.ClientId = client.Id',
      )
      .leftJoinAndMapOne(
        'order.StatusName',
        'orderstatus',
        'status',
        'order.OrderStatusId = status.Id',
      )
      .select([
        'order.Id',
        'order.Description',
        'order.OrderEventId',
        'order.ClientId',
        'order.OrderStatusId',
        'order.OrderPriority AS OrderPriority',
        'order.Deadline',
        'order.OrderNumber  AS OrderNumber ',
        'order.OrderName AS OrderName',
        'order.ExternalOrderId AS ExternalOrderId',
        'event.EventName AS EventName',
        'client.Name AS ClientName',
        'status.StatusName AS StatusName',
      ])
      .where('order.ClientId = :clientId', { clientId })
      .orderBy('order.Deadline', 'ASC')
      .getRawMany();
  
    if (!orders || orders.length === 0) {
      return [];
    }
  
    return orders.map((order) => ({
      Id: order.Id,
      OrderName: order.OrderName,
      OrderNumber: order.OrderNumber,
      ExternalOrderId: order.ExternalOrderId,
      Description: order.order_Description,
      OrderEventId: order.order_OrderEventId,
      ClientId: order.order_ClientId,
      OrderPriority: order.OrderPriority,
      OrderStatusId: order.order_OrderStatusId,
      Deadline: order.order_Deadline,
      EventName: order.EventName || null,
      ClientName: order.ClientName || null,
      StatusName: order.StatusName || null,
    }));
  }
   
  async updateOrder(id: number, updateOrderDto: any, updatedBy: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { Id: id } });
  
    if (!order) {
      throw new Error('Order not found');
    }
  
    const { ClientId, OrderEventId, Description, OrderStatusId, Deadline, items, OrderPriority, ExternalOrderId,OrderName,OrderNumber } =
      updateOrderDto;
  
    order.ClientId = ClientId ?? order.ClientId;
    order.OrderEventId = OrderEventId ?? order.OrderEventId;
    order.Description = Description ?? order.Description;
    order.OrderStatusId = OrderStatusId ?? order.OrderStatusId;
    order.Deadline = Deadline ?? order.Deadline;
    order.OrderPriority = OrderPriority ?? order.OrderPriority;
    order.UpdatedBy = updatedBy;
    order.UpdatedOn = new Date();
    order.ExternalOrderId = ExternalOrderId;
    order.OrderName = OrderName;
  
    const updatedOrder = await this.orderRepository.save(order);
  
    if (Array.isArray(items) && items.length > 0) {

      const existingOrderItems = await this.orderItemRepository.find({ where: { OrderId: id } });
      const existingOrderItemIds = existingOrderItems.map((item) => item.Id);
  
      if (existingOrderItemIds.length > 0) {
        await this.orderItemsPrintingOptionRepository.delete({
          OrderItemId: In(existingOrderItemIds),
        });
  
        await this.orderItemDetailRepository.delete({
          OrderItemId: In(existingOrderItemIds),
        });
      }
  
      await this.orderItemRepository.delete({ OrderId: id });
  
      const newOrderItems = items.map((item) => ({
        OrderId: id,
        ProductId: item.ProductId,
        Description: item.Description,
        ImageId: item.ImageId,
        FileId: item.FileId,
        VideoId: item.VideoId,
        CreatedBy: updatedBy,
        UpdatedBy: updatedBy,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        OrderItemPriority: item.OrderItemPriority,
      }));
  
      const savedOrderItems = await this.orderItemRepository.save(newOrderItems);
  
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
  
        if (Array.isArray(item.printingOptions) && item.printingOptions.length > 0) {
          const printingOptions = item.printingOptions.map((option) => ({
            OrderItemId: savedOrderItems[i].Id,
            PrintingOptionId: option.PrintingOptionId,
            Description: option.Description,
          }));
  
          await this.orderItemsPrintingOptionRepository.save(printingOptions);
        }

        if (Array.isArray(item.orderItemDetails) && item.ProductId) {
          const orderItemDetails = item.orderItemDetails.map((option) => ({
            OrderItemId: savedOrderItems[i].Id,
            ColorOptionId: option.ColorOptionId,
            Quantity: option.Quantity,
            Priority: option.Priority,
            CreatedBy: updatedBy,
            UpdatedBy: updatedBy,
            CreatedOn: new Date(),
            UpdatedOn: new Date(),
          }));
          try {
            await this.orderItemDetailRepository.save(orderItemDetails);
          } catch (error) {
            console.error('Error saving color option:', error);
            throw new Error('Failed to save color options for order item');
          }
        }
      }
    }
  
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { Id: id } });
  
    if (!order) {
      throw new Error('Order not found');
    }
  
    const orderItems = await this.orderItemRepository.find({ where: { OrderId: id } });
    const orderItemIds = orderItems.map((item) => item.Id);
  
    if (orderItemIds.length > 0) {
      await this.orderItemsPrintingOptionRepository.delete({
        OrderItemId: In(orderItemIds),
      });
  
      await this.orderItemDetailRepository.delete({
        OrderItemId: In(orderItemIds),
      });
    }
  
    await this.orderItemRepository.delete({ OrderId: id });
  
    await this.orderRepository.delete(id);
  }
  

  async getEditOrder(id: number): Promise<any> {
    try {
      // Get order with related data using query builder
      const orderData = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('client', 'client', 'order.ClientId = client.Id')
        .leftJoin('clientevent', 'event', 'order.OrderEventId = event.Id')
        .leftJoin('orderstatus', 'status', 'order.OrderStatusId = status.Id')
        .select([
          'order.Id AS Id',
          'order.ClientId AS ClientId',
          'client.Name AS ClientName',
          'order.OrderEventId AS OrderEventId',
          'event.EventName AS EventName',
          'order.Description AS Description',
          'order.OrderStatusId AS OrderStatusId',
          'status.StatusName AS StatusName',
          'order.Deadline AS Deadline',
          'order.OrderPriority AS OrderPriority',
          'order.OrderNumber AS OrderNumber',
          'order.OrderName AS OrderName',
          'order.ExternalOrderId AS ExternalOrderId'
        ])
        .where('order.Id = :id', { id })
        .getRawOne();
    
      if (!orderData) {
        throw new Error('Order not found');
      }
    
      // Get order items with related data using query builder
      const orderItemsData = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoin('product', 'product', 'orderItem.ProductId = product.Id')
        .leftJoin('orderitemsprintingoptions', 'printingOption', 'orderItem.Id = printingOption.OrderItemId')
        .leftJoin('printingoptions', 'printingoptions', 'printingOption.PrintingOptionId = printingoptions.Id')
        .leftJoin('orderitemdetails', 'orderItemDetail', 'orderItem.Id = orderItemDetail.OrderItemId')
        .leftJoin('coloroption', 'colorOption', 'orderItemDetail.ColorOptionId = colorOption.Id')
        .select([
          'orderItem.Id AS Id',
          'orderItem.ProductId AS ProductId',
          'product.Name AS ProductName',
          'orderItem.Description AS Description',
          'orderItem.OrderItemPriority AS OrderItemPriority',
          'orderItem.ImageId AS ImageId',
          'orderItem.FileId AS FileId',
          'orderItem.VideoId AS VideoId',
          'printingOption.Id AS PrintingOptionId',
          'printingOption.Description AS PrintingOptionDescription',
          'printingoptions.Type AS PrintingOptionName',
          'orderItemDetail.Id AS OrderItemDetailId',
          'orderItemDetail.ColorOptionId AS ColorOptionId',
          'colorOption.Name AS ColorOptionName',
          'orderItemDetail.Quantity AS Quantity',
          'orderItemDetail.Priority AS Priority'
        ])
        .where('orderItem.OrderId = :orderId', { orderId: id })
        .getRawMany();
    
      // Process order items to group printing options and color options
      const processedItems = [];
      const itemMap = new Map();
    
      for (const item of orderItemsData) {
        if (!itemMap.has(item.Id)) {
          // Create new item entry
          const newItem = {
            Id: item.Id,
            ProductId: item.ProductId,
            ProductName: item.ProductName || 'Unknown Product',
            Description: item.Description,
            OrderNumber: orderData.OrderNumber,
            OrderName: orderData.OrderName,
            ExternalOrderId: orderData.ExternalOrderId,
            OrderItemPriority: item.OrderItemPriority,
            ImageId: item.ImageId,
            FileId: item.FileId,
            VideoId: item.VideoId,
            printingOptions: [],
            orderItemDetails: []
          };
          
          itemMap.set(item.Id, newItem);
          processedItems.push(newItem);
        }
        
        const currentItem = itemMap.get(item.Id);
        
        // Add printing option if it exists and is not already added
        if (item.PrintingOptionId && !currentItem.printingOptions.some(po => po.PrintingOptionId === item.PrintingOptionId)) {
          currentItem.printingOptions.push({
            PrintingOptionId: item.PrintingOptionId,
            PrintingOptionName: item.PrintingOptionName,
            Description: item.PrintingOptionDescription
          });
        }
        
        // Add color option if it exists and is not already added
        if (item.ColorOptionId && !currentItem.orderItemDetails.some(od => od.ColorOptionId === item.ColorOptionId)) {
          currentItem.orderItemDetails.push({
            ColorOptionId: item.ColorOptionId,
            ColorOptionName: item.ColorOptionName || 'Unknown Color',
            Quantity: item.Quantity,
            Priority: item.Priority
          });
        }
      }
    
      // Return formatted order with related data
      return {
        Id: orderData.Id,
        ClientId: orderData.ClientId,
        ClientName: orderData.ClientName || 'Unknown Client',
        OrderEventId: orderData.OrderEventId,
        EventName: orderData.EventName || 'Unknown Event',
        OrderPriority: orderData.OrderPriority,
        Description: orderData.Description,
        OrderNumber: orderData.OrderNumber,
        OrderName: orderData.OrderName,
        ExternalOrderId: orderData.ExternalOrderId,
        OrderStatusId: orderData.OrderStatusId,
        StatusName: orderData.StatusName || 'Unknown Status',
        Deadline: orderData.Deadline,
        items: processedItems
      };
    } catch (error) {
      console.error('Error in getEditOrder:', error);
      throw error;
    }
  }

  async getOrderItemsByOrderId(orderId: number): Promise<any> {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('product', 'product', 'orderItem.ProductId = product.Id')
      .leftJoin('orderitemsprintingoptions', 'printingOption', 'orderItem.Id = printingOption.OrderItemId')
      .leftJoin('printingoptions', 'printingoptions', 'printingOption.PrintingOptionId = printingoptions.Id')
      .leftJoin('orderitemdetails', 'orderItemColor', 'orderItem.Id = orderItemColor.OrderItemId')
      .leftJoin('availablecoloroptions', 'availablecoloroptions', 'orderItemColor.ColorOptionId = colorOption.Id')
      .leftJoin('coloroption', 'colorOption', 'availablecoloroptions.colorId = colorOption.Id')
      .select([
        'orderItem.Id AS Id',
        'orderItem.OrderId AS OrderId',
        'orderItem.ProductId AS ProductId',
        'orderItem.Description AS Description',
        'orderItem.ImageId AS ImageId',
        'orderItem.FileId AS FileId',
        'orderItem.VideoId AS VideoId',
        'orderItem.CreatedOn AS CreatedOn',
        'orderItem.UpdatedOn AS UpdatedOn',
        'orderItem.OrderItemPriority AS OrderItemPriority',
        'product.Name AS ProductName',
        'printingOption.Id AS PrintingOptionId',
        'printingOption.PrintingOptionId AS PrintingOptionId',
        'printingOption.Description AS PrintingOptionDescription',
        'printingoptions.Type AS PrintingOptionName',
        'orderItemColor.ColorOptionId AS ColorOptionId',
        'colorOption.Name AS ColorName',
        'orderItemColor.Quantity AS OrderItemDetailQuanity',
        'orderItemColor.Priority AS OrderItemDetailPriority'
      ])
      .where('orderItem.OrderId = :orderId', { orderId })
      .getRawMany();
  
    if (!orderItems || orderItems.length === 0) {
      return [];
    }
  
    const formattedItems = orderItems.reduce((acc, item) => {
      const existingItem = acc.find(orderItem => orderItem.Id === item.Id);
  
      if (existingItem) {
        if (item.PrintingOptionId && !existingItem.printingOptions.some(po => po.PrintingOptionId === item.PrintingOptionId)) {
          existingItem.printingOptions.push({
            PrintingOptionId: item.PrintingOptionId,
            PrintingOptionName: item.PrintingOptionName,
            Description: item.PrintingOptionDescription,
          });
        }
  
        if (item.ColorOptionId && !existingItem.colors.some(c => c.ColorOptionId === item.ColorOptionId)) {
          existingItem.colors.push({
            ColorOptionId: item.ColorOptionId,
            ColorName: item.ColorName,
            Quantity: item.OrderItemDetailQuanity,
            Priority: item.OrderItemDetailPriority,
          });
        }
      } else {
        acc.push({
          Id: item.Id,
          OrderId: item.OrderId,
          ProductId: item.ProductId,
          ProductName: item.ProductName || "",
          Description: item.Description,
          OrderItemPriority: item.OrderItemPriority || 0,
          ImageId: item.ImageId,
          FileId: item.FileId,
          VideoId: item.VideoId,
          CreatedOn: item.CreatedOn,
          UpdatedOn: item.UpdatedOn,
          printingOptions: item.PrintingOptionId
            ? [
                {
                  PrintingOptionId: item.PrintingOptionId,
                  PrintingOptionName: item.PrintingOptionName,
                  Description: item.PrintingOptionDescription,
                },
              ]
            : [],
          colors: item.ColorOptionId
            ? [
                {
                  ColorOptionId: item.ColorOptionId,
                  ColorName: item.ColorName,
                  Quantity: item.OrderItemDetailQuanity,
                  Priority: item.OrderItemDetailPriority,
                },
              ]
            : [],
        });
      }
  
      return acc;
    }, []);
  
    return formattedItems;
  }
}
