import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In  } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsPrintingOption } from './entities/order-item-printiing.option.entity';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrderItemDetails } from './entities/order-item-details';

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

  async getAllOrders(): Promise<any[]> {
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
        'order.Deadline',
        'order.OrderPriority AS OrderPriority',
        'order.OrderNumber  AS OrderNumber ',
        'order.OrderName AS OrderName',
        'order.ExternalOrderId AS ExternalOrderId',
        'event.EventName AS EventName',
        'client.Name AS ClientName',
        'status.StatusName AS StatusName',
      ])
      .getRawMany();
  
    return orders.map((order) => ({
      Id: order.order_Id,
      OrderName: order.OrderName,
      OrderNumber: order.OrderNumber,
      ExternalOrderId: order.ExternalOrderId,
      Description: order.order_Description,
      OrderEventId: order.order_OrderEventId,
      ClientId: order.order_ClientId,
      OrderStatusId: order.order_OrderStatusId,
      OrderPriority: order.OrderPriority || null,
      Deadline: order.order_Deadline,
      EventName: order.EventName || null,
      ClientName: order.ClientName || null,
      StatusName: order.StatusName || null,
    }));
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
      Id: order.order_Id,
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
    const order = await this.orderRepository.findOne({ where: { Id: id } });
  
    if (!order) {
      throw new Error('Order not found');
    }
  
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin(
        'orderitemsprintingoptions',
        'printingOption',
        'orderItem.Id = printingOption.OrderItemId',
      )
      .leftJoin(
        'printingoptions',
        'printingoptions',
        'printingOption.PrintingOptionId = printingoptions.Id',
      )
      .leftJoin(
        'orderitemdetails',
        'orderitemdetails',
        'orderItem.Id = orderitemdetails.OrderItemId',
      )
      .select([
        'orderItem.Id AS Id',
        'orderItem.OrderId AS OrderId',
        'orderItem.ProductId AS ProductId',
        'orderItem.Description AS Description',
        'orderItem.ImageId AS ImageId',
        'orderItem.FileId AS FileId',
        'orderItem.VideoId AS VideoId',
        'orderItem.OrderItemPriority AS OrderItemPriority',
        'printingOption.Id AS PrintingOptionId',
        'printingOption.PrintingOptionId AS PrintingOptionId',
        'printingOption.Description AS PrintingOptionDescription',
        'orderitemdetails.ColorOptionId AS ColorOptionId',
        'orderitemdetails.Id AS OrderItemDetailId',
        'orderitemdetails.Quantity AS OrderItemDetailQuanity',
        'orderitemdetails.Priority AS OrderItemDetailPriority'
      ])
      .where('orderItem.OrderId = :orderId', { orderId: id })
      .getRawMany();
  
      const formattedOrderItems = orderItems.reduce((acc, item) => {
        const existingItem = acc.find((orderItem) => orderItem.Id === item.Id);
      
        if (existingItem) {
          if (item.PrintingOptionId && !existingItem.printingOptions.some(po => po.PrintingOptionId === item.PrintingOptionId)) {
            existingItem.printingOptions.push({
              PrintingOptionId: item.PrintingOptionId,
              Description: item.PrintingOptionDescription,
            });
          }
      
          if (item.OrderItemDetailId && !existingItem.orderItemDetails.some(od => od.ColorOptionId === item.ColorOptionId)) {
            existingItem.orderItemDetails.push({
              ColorOptionId: item.ColorOptionId,
              Quantity: item.OrderItemDetailQuanity,
              Priority: item.OrderItemDetailPriority,
            });
          }
        } else {
          acc.push({
            Id: item.Id,
            ProductId: item.ProductId,
            Description: item.Description,
            OrderNumber: order.OrderNumber,
            OrderName: order.OrderName,
            ExternalOrderId: order.ExternalOrderId,
            OrderItemPriority: item.OrderItemPriority,
            ImageId: item.ImageId,
            FileId: item.FileId,
            VideoId: item.VideoId,
            printingOptions: item.PrintingOptionId
              ? [
                  {
                    PrintingOptionId: item.PrintingOptionId,
                    Description: item.PrintingOptionDescription,
                  },
                ]
              : [],
            orderItemDetails: item.OrderItemDetailId
              ? [
                  {
                    ColorOptionId: item.ColorOptionId,
                    Quantity: item.OrderItemDetailQuanity,
                    Priority: item.OrderItemDetailPriority,
                  },
                ]
              : [],
          });
        }
        return acc;
      }, []);
  
    const response = {
      ClientId: order.ClientId,
      OrderEventId: order.OrderEventId,
      OrderPriority: order.OrderPriority,
      Description: order.Description,
      OrderNumber: order.OrderNumber,
      OrderName: order.OrderName,
      ExternalOrderId: order.ExternalOrderId,
      OrderStatusId: order.OrderStatusId,
      Deadline: order.Deadline,
      items: formattedOrderItems,
    };
  
    return response;
  }

  async getOrderItemsByOrderId(orderId: number): Promise<any> {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('product', 'product', 'orderItem.ProductId = product.Id')
      .leftJoin('orderitemsprintingoptions', 'printingOption', 'orderItem.Id = printingOption.OrderItemId')
      .leftJoin('printingoptions', 'printingoptions', 'printingOption.PrintingOptionId = printingoptions.Id')
      .leftJoin('orderitemdetails', 'orderItemColor', 'orderItem.Id = orderItemColor.OrderItemId')
      .leftJoin('coloroption', 'colorOption', 'orderItemColor.ColorOptionId = colorOption.Id')
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
