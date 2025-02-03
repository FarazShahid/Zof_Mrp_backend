import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FabricType } from './_/fabrictype.entity';

@Injectable()
export class FabricTypeService {
  constructor(
    @InjectRepository(FabricType)
    private readonly fabricTypeRepository: Repository<FabricType>,
  ) {}

  async create(data: { type: string; name: string; gsm: number; createdBy: string }) {
    const fabric = this.fabricTypeRepository.create(data);
    return this.fabricTypeRepository.save(fabric);
  }

  async findAll() {
    return this.fabricTypeRepository.find();
  }

  async findOne(id: number) {
    return this.fabricTypeRepository.findOne({ where: { id } });
  }

  async update(id: number, data: { type?: string; name?: string; gsm?: number; updatedBy: string }) {
    await this.fabricTypeRepository.update(id, { ...data, updatedOn: new Date() });
    return this.fabricTypeRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    const result = await this.fabricTypeRepository.delete(id);
    if (result.affected === 0) {
      return { message: 'No record found with this ID' };
    }
    return { message: 'Deleted successfully' };
  }
}
