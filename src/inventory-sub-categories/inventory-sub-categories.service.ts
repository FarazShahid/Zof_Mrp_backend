import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { InventorySubCategories } from './_/inventory-sub-categories.entity';
import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';

@Injectable()
export class InventorySubCategoryService {
 
  constructor(
    @InjectRepository(InventorySubCategories)
    private readonly inventorySubCategoryRepository: Repository<InventorySubCategories>,
    @InjectRepository(InventoryCategories)
  private readonly inventoryCategoryRepository: Repository<InventoryCategories>,
  ) {}

  async create(data: { Name: string, CategoryId: number }, createdBy: string) {
    const inventoryCategory = await this.inventoryCategoryRepository.findOne({
      where: { Id: data.CategoryId },
      withDeleted: true,
    });
    
    if (!inventoryCategory) {
      throw new BadRequestException('Category does not exist.');
    }
    const inventorySubCategory = this.inventorySubCategoryRepository.create({
      ...data,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    const savedRecord = await this.inventorySubCategoryRepository.save(inventorySubCategory);
    return {
      ...savedRecord,
      CategoryName: inventoryCategory.Name 
    };
  }

  async findAll() {
    const subCategories = await this.inventorySubCategoryRepository.find();

    const categoryIds = subCategories.map(sub => sub.CategoryId);
  
    const categories = await this.inventoryCategoryRepository.find({
      where: { Id: In(categoryIds) },
      withDeleted: true,
    });
  
    const categoryMap = new Map(categories.map(cat => [cat.Id, cat.Name]));
  
    return subCategories.map(sub => ({
      Id: sub.Id,
      Name: sub.Name,
      CategoryId: sub.CategoryId,
      CategoryName: categoryMap.get(sub.CategoryId) || null,
    }));
  }

  async findOne(Id: number) {
    const inventorySubCategory = await this.inventorySubCategoryRepository.findOne({ where: { Id } });
    if (!inventorySubCategory) {
      throw new NotFoundException(`Inventory Sub Category with ID ${Id} not found`);
    }

    const inventoryCategory = await this.inventoryCategoryRepository.findOne({
      where: { Id: inventorySubCategory.CategoryId },
      withDeleted: true,
    });
    
    if (!inventoryCategory) {
      throw new BadRequestException('Category does not exist.');
    }
    return {
      ...inventorySubCategory,
      CategoryName: inventoryCategory.Name 
    };
  }

  async update(Id: number, data: any) {
    try {
      const inventoryCategory = await this.inventorySubCategoryRepository.findOne({ where: { Id } });
      if (!inventoryCategory) {
        throw new NotFoundException(`Inventory Sub Category with ID ${Id} not found`);
      }

      const { Name, CategoryId, updatedBy } = data;

      const updateData: any = {};

      if (Name !== undefined) updateData.Name = Name;
      if (CategoryId !== undefined) updateData.CategoryId = CategoryId;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();

      await this.inventorySubCategoryRepository.update(Id, updateData);

      return this.inventorySubCategoryRepository.findOne({ where: { Id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Inventory Sub Category: ${error.message}`);
    }
  }

  async delete(id: number) {
    const result = await this.inventorySubCategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory Sub Category with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
