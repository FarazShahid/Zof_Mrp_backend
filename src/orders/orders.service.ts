import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsPrintingOption } from './entities/order-item-printiing.option.entity';
import { CreateOrderDto } from './dto/create-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemsPrintingOption)
    private orderItemsPrintingOptionRepository: Repository<OrderItemsPrintingOption>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, createdBy: number): Promise<Order> {
    const { ClientId, OrderEventId, Description, OrderStatusId, Deadline, items } = createOrderDto;

    const newOrder = this.orderRepository.create({
      ClientId,
      OrderEventId,
      Description,
      OrderStatusId,
      Deadline,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
    });

    const savedOrder = await this.orderRepository.save(newOrder);

    if (items && items.length > 0) {
      const orderItems = items.map((item) => ({
        OrderId: savedOrder.Id,
        ProductId: item.ProductId,
        Description: item.Description,
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
        if (item.printingOptions && item.printingOptions.length > 0) {
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
        'clientstatus',
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
        'event.EventName AS EventName',
        'client.Name AS ClientName',
        'status.StatusName AS StatusName',
      ])
      .getRawMany();

    return orders.map((order) => ({
      Id: order.order_Id,
      Description: order.order_Description,
      OrderEventId: order.order_OrderEventId,
      ClientId: order.order_ClientId,
      OrderStatusId: order.order_OrderStatusId,
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
        'clientstatus',
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
        'event.EventName AS EventName',
        'client.Name AS ClientName',
        'status.StatusName AS StatusName',
      ])
      .where('order.ClientId = :clientId', { clientId })
      .getRawMany();
  
    if (!orders || orders.length === 0) {
      return [];
    }
  
    return orders.map((order) => ({
      Id: order.order_Id,
      Description: order.order_Description,
      OrderEventId: order.order_OrderEventId,
      ClientId: order.order_ClientId,
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

    const { ClientId, OrderEventId, Description, OrderStatusId, Deadline } = updateOrderDto;

    order.ClientId = ClientId ?? order.ClientId;
    order.OrderEventId = OrderEventId ?? order.OrderEventId;
    order.Description = Description ?? order.Description;
    order.OrderStatusId = OrderStatusId ?? order.OrderStatusId;
    order.Deadline = Deadline ?? order.Deadline;
    order.UpdatedBy = updatedBy;
    order.UpdatedOn = new Date();

    return this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { Id: id } });

    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderItemRepository.delete({ OrderId: id });
    await this.orderItemsPrintingOptionRepository.delete({ OrderItemId: id });

    await this.orderRepository.delete(id);
  }

  async getOrderItemsByOrderId(orderId: number): Promise<any> {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('product', 'product', 'orderItem.ProductId = product.Id') 
      .leftJoinAndSelect('orderItemPrintingOptions', 'printingOption', 'orderItem.Id = printingOption.OrderItemId') 
      .leftJoinAndSelect('printingoptions', 'printingoptions', 'printingOption.PrintingOptionId = printingoptions.Id') 
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
        'product.Name AS ProductName',
        'printingOption.Id AS PrintingOptionId',
        'printingOption.PrintingOptionId AS PrintingOptionId',
        'printingOption.Description AS PrintingOptionDescription',
        'printingoptions.Type AS PrintingOptionName',
      ])
      .where('orderItem.OrderId = :orderId', { orderId })
      .getRawMany();
  
    if (!orderItems || orderItems.length === 0) {
      throw new Error('No items found for the given order ID');
    }
  
    const formattedItems = orderItems.reduce((acc, item) => {
      const existingItem = acc.find(orderItem => orderItem.Id === item.Id);
      if (existingItem) {
        existingItem.printingOptions.push({
          PrintingOptionId: item.PrintingOptionId,
          PrintingOptionName: item.PrintingOptionName,
          Description: item.PrintingOptionDescription,
        });
      } else {
        acc.push({
          Id: item.Id,
          OrderId: item.OrderId,
          ProductId: item.ProductId,
          ProductName: item.ProductName || "",
          Description: item.Description,
          ImageId: item.ImageId,
          FileId: item.FileId,
          VideoId: item.VideoId,
          CreatedOn: item.CreatedOn,
          UpdatedOn: item.UpdatedOn,
          PrintingOptions: item.PrintingOptionId
            ? [
                {
                  PrintingOptionId: item.PrintingOptionId,
                  Description: item.PrintingOptionDescription,
                  PrintingOptionName: item.PrintingOptionName,
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
