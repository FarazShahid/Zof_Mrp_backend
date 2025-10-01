import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
  ) { }

  async create(data: Partial<ProductCategory>, userEmail: string): Promise<ProductCategory> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { Type: data.Type },
    });

    if (existingCategory) {
      throw new BadRequestException(`Category with this type already exists.`);
    }

    return await this.categoryRepository.save({
      ...data,
      CreatedBy: userEmail,
      UpdatedBy: userEmail,
    });
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({ where: { Id: id } });

    if (!category) {
      throw new NotFoundException(`Category not found.`);
    }

    return category;
  }

  async update(id: number, data: Partial<ProductCategory>, userEmail: string): Promise<ProductCategory> {
    if (data.Type) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { Type: data.Type },
      });

      if (existingCategory && existingCategory.Id !== id) {
        throw new BadRequestException(`Category with this type already exists.`);
      }
    }
    await this.categoryRepository.update(id, {
      ...data,
      UpdatedBy: userEmail
    });
    return this.findOne(id);
  }


  async remove(id: number): Promise<{ message: string }> {
    const deleteResult = await this.categoryRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Category not found.`);
    }

    return { message: `Category has been deleted.` };
  }

}
