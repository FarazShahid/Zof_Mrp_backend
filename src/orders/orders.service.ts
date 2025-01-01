import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, createdBy: number): Promise<Order> {
    const { ClientId, OrderEventId, Description, OrderStatusId, Deadline } = createOrderDto;

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

    return await this.orderRepository.save(newOrder);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async getOrderById(id: number): Promise<Order> {
    return await this.orderRepository.findOne({ where: { Id: id } });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto, updatedBy: number): Promise<Order> {
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
