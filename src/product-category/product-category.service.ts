import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(data: Partial<ProductCategory>): Promise<ProductCategory> {
    return await this.categoryRepository.save(data);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<ProductCategory> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<ProductCategory>): Promise<ProductCategory> {
    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
