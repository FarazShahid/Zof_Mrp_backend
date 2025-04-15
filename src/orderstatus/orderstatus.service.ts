import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from './entities/orderstatus.entity';
import { CreateOrderStatusDto, UpdateOrderStatusDto } from './dto/order-status.dto';

@Injectable()
export class OrderstatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
  ) {}

  async getAllOrderStatuses() {
    const orderStatuses = await this.orderStatusRepository.find();
    return orderStatuses;
  }

  async getOrderStatusById(id: number) {
    const status = await this.orderStatusRepository.findOne({ where: { Id: id } });
    return {
      Id: status.Id,
      Name: status.StatusName,
      Description: status.Description,
      CreatedOn: status.CreatedOn,
      CreatedBy: status.CreatedBy,
      UpdatedOn: status.UpdatedOn,
      UpdatedBy: status.UpdatedBy
    };
  }

  async create(data: CreateOrderStatusDto, createdBy: string): Promise<any> {
    const existingOrderStatus = await this.orderStatusRepository.findOne({ where: { StatusName: data.Name } });
    if (existingOrderStatus) {
      throw new BadRequestException(`Order Status Name already exists.`);
    }
    const newOrderStatus = this.orderStatusRepository.create({
      StatusName: data.Name,
      Description: data.Description,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    const saveOrderStatus = await this.orderStatusRepository.save(newOrderStatus);
    return {
      Id: saveOrderStatus.Id,
      Name: saveOrderStatus.StatusName,
      CreatedOn: saveOrderStatus.CreatedOn,
      CreatedBy: saveOrderStatus.CreatedBy,
      UpdatedOn: saveOrderStatus.UpdatedOn,
      UpdatedBy: saveOrderStatus.UpdatedBy
    };
  }

  async remove(id: number): Promise<void> {
    const orderStatus = await this.orderStatusRepository.findOne({ where: { Id: id } });

    if (!orderStatus) {
      throw new NotFoundException(`Order Status with ID ${id} not found`);
    }

    await this.orderStatusRepository.delete(id);
  }

  async update(id: number, data: UpdateOrderStatusDto, updatedBy: string): Promise<any> {
    const orderStatus = await this.getOrderStatusById(id);

    if (data.Name) {
      const existingPrintingOption = await this.orderStatusRepository.findOne({
        where: { StatusName: data.Name },
      });

      if (existingPrintingOption && existingPrintingOption.Id !== id) {
        throw new BadRequestException(`Order Status with name "${data.Name}" already exists.`);
      }
    }

    const savedOrderStatus = await this.orderStatusRepository.save({
      Id: id,
      StatusName: data.Name || orderStatus.Name,
      Description: data.Description || orderStatus.Description,
      CreatedBy: orderStatus.CreatedBy,
      CreatedOn: orderStatus.CreatedOn,
      UpdatedBy: updatedBy,
      UpdatedOn: new Date()
    });

    return {
      Id: savedOrderStatus.Id,
      Name: savedOrderStatus.StatusName,
      Description: savedOrderStatus.Description,
      CreatedOn: savedOrderStatus.CreatedOn,
      CreatedBy: savedOrderStatus.CreatedBy,
      UpdatedOn: savedOrderStatus.UpdatedOn,
      UpdatedBy: savedOrderStatus.UpdatedBy
    };
  }
}