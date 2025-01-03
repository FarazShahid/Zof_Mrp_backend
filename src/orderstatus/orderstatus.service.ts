import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/orderstatus.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class OrderstatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    private userService: UserService,
  ) {}

  async getAllOrderStatuses() {
    const orderStatuses = await this.orderStatusRepository.find();

    for (const status of orderStatuses) {
      const createdByUser = await this.userService.getUserEmailById(Number(status.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(status.UpdatedBy));

      status.CreatedBy = createdByUser ? createdByUser : '';
      status.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return orderStatuses;
  }

  async getOrderStatusById(id: number) {
    const status = await this.orderStatusRepository.findOne({ where: { Id: id } });
    
    if (status) {
      const createdByUser = await this.userService.getUserEmailById(Number(status.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(status.UpdatedBy));

      status.CreatedBy = createdByUser ? createdByUser : '';
      status.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return status;
  }
}
