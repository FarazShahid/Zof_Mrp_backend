import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrderItem } from './entities/order-item.entity'; // Import the OrderItem entity

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, createdBy: number): Promise<Order> {
    const { ClientId, OrderEventId, Description, OrderStatusId, Deadline, items } = createOrderDto;

    // Step 1: Create the order
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

      await this.orderItemRepository.save(orderItems);
    }

    return savedOrder;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async getOrderById(id: number): Promise<Order> {
    return await this.orderRepository.findOne({ where: { Id: id } });
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
    await this.orderRepository.delete(id);
  }
}
