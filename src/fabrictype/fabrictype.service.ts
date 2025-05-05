import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FabricType } from './_/fabrictype.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
@Injectable()
export class FabricTypeService {
  constructor(
    @InjectRepository(FabricType)
    private readonly fabricTypeRepository: Repository<FabricType>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(data: { type: string; name: string; gsm: number; CategoryId: number; createdBy: string }) {
    const fabric = this.fabricTypeRepository.create({
      ...data,
      CategoryId: data.CategoryId ?? null,
      createdOn: new Date(),
    });
    return this.fabricTypeRepository.save(fabric);
  }

  async findAll() {
    const response = await this.fabricTypeRepository.find();
    const CategoryIds = response.filter(e => e.CategoryId).map(e => e.CategoryId);
    const categories = await this.productCategoryRepository.find({
          where: { id: In(CategoryIds) },
          withDeleted: true,
        });
    const categoryMap = new Map(categories.map(cat => [cat.id, cat.type]));
    return response.map(e=>({
      id: e.id,
      name: e.name,
      type: e.type,
      gsm: e.gsm,
      categoryid: e.CategoryId,
      categoryName: categoryMap.get(e.CategoryId) ?? "N/A",
      createdOn: e.createdOn,
      createdBy: e.createdBy,
      updatedOn: e.updatedOn,
      updatedBy: e.updatedBy
    }));
  }

  async findOne(id: number) {
    const fabricType = await this.fabricTypeRepository.findOne({ where: { id } });
    if (!fabricType) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }
    const category = await this.productCategoryRepository.findOne({
      where: { id: fabricType.CategoryId },
      withDeleted: true,
    });

    return {
      id: fabricType.id,
      name: fabricType.name,
      type: fabricType.type,
      gsm: fabricType.gsm,
      categoryid: fabricType.CategoryId,
      categoryName: category?.type ?? "N/A",
      createdOn: fabricType.createdOn,
      createdBy: fabricType.createdBy,
      updatedOn: fabricType.updatedOn,
      updatedBy: fabricType.updatedBy
    };
  }

  async update(id: number, data: any) {    
    try {
      const fabricType = await this.fabricTypeRepository.findOne({ where: { id } });
      if (!fabricType) {
        throw new NotFoundException(`Fabric type with ID ${id} not found`);
      }

      const { type, name, gsm, updatedBy, CategoryId } = data;
      const updateData: any = {};
      
      if (type !== undefined) updateData.type = type;
      if (name !== undefined) updateData.name = name;
      if (gsm !== undefined) updateData.gsm = gsm;
      if (CategoryId !== undefined) updateData.CategoryId = CategoryId;
      
      updateData.updatedBy = updatedBy;
      updateData.updatedOn = new Date();

      await this.fabricTypeRepository.update(id, updateData);
      
      return this.fabricTypeRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update fabric type: ${error.message}`);
    }
  }

  async delete(id: number) {
    const result = await this.fabricTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
