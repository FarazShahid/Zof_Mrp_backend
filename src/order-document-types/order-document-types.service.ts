import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDocumentType } from './entities/order-document-type.entity';
import { CreateOrderDocumentTypeDto } from './dto/create-order-document-type.dto';
import { UpdateOrderDocumentTypeDto } from './dto/update-order-document-type.dto';

@Injectable()
export class OrderDocumentTypesService {
  constructor(
    @InjectRepository(OrderDocumentType)
    private readonly orderDocumentTypeRepository: Repository<OrderDocumentType>,
  ) {}

  async create(dto: CreateOrderDocumentTypeDto, userEmail: string): Promise<OrderDocumentType> {
    const existing = await this.orderDocumentTypeRepository.findOne({ where: { Name: dto.Name } });
    if (existing) {
      throw new BadRequestException(`Order document type with name "${dto.Name}" already exists.`);
    }

    return this.orderDocumentTypeRepository.save(
      this.orderDocumentTypeRepository.create({
        ...dto,
        CreatedBy: userEmail,
        UpdatedBy: userEmail,
      }),
    );
  }

  async findAll(): Promise<OrderDocumentType[]> {
    return this.orderDocumentTypeRepository.find({ order: { Id: 'ASC' } });
  }

  async findOne(id: number): Promise<OrderDocumentType> {
    const documentType = await this.orderDocumentTypeRepository.findOne({ where: { Id: id } });
    if (!documentType) {
      throw new NotFoundException(`Order document type with ID ${id} not found.`);
    }
    return documentType;
  }

  async update(id: number, dto: UpdateOrderDocumentTypeDto, userEmail: string): Promise<OrderDocumentType> {
    await this.findOne(id);

    if (dto.Name) {
      const existing = await this.orderDocumentTypeRepository.findOne({ where: { Name: dto.Name } });
      if (existing && existing.Id !== id) {
        throw new BadRequestException(`Order document type with name "${dto.Name}" already exists.`);
      }
    }

    await this.orderDocumentTypeRepository.update(id, {
      ...dto,
      UpdatedBy: userEmail,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const deleteResult = await this.orderDocumentTypeRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Order document type with ID ${id} not found.`);
    }
    return { message: 'Order document type has been deleted.' };
  }
}
