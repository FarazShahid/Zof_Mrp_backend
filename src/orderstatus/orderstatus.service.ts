import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/orderstatus.entity';
import { UserService } from '../users/user.service'; // Assuming UserService is used to get user details

@Injectable()
export class OrderstatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    private userService: UserService, // Inject UserService
  ) {}

  // Get all order statuses along with user emails for CreatedBy and UpdatedBy
  async getAllOrderStatuses() {
    const orderStatuses = await this.orderStatusRepository.find();

    // Fetch user emails for CreatedBy and UpdatedBy
    for (const status of orderStatuses) {
      const createdByUser = await this.userService.getUserEmailById(Number(status.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(status.UpdatedBy));

      // Add emails to the response object
      status.CreatedBy = createdByUser ? createdByUser : '';
      status.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return orderStatuses;
  }

  // Get an order status by ID
  async getOrderStatusById(id: number) {
    const status = await this.orderStatusRepository.findOne({ where: { Id: id } });
    
    if (status) {
      const createdByUser = await this.userService.getUserEmailById(Number(status.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(status.UpdatedBy));

      // Add emails to the response object
      status.CreatedBy = createdByUser ? createdByUser : '';
      status.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return status;
  }
}
