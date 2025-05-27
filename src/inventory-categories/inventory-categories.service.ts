import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryCategories } from './_/inventory-categories.entity';

@Injectable()
export class InventoryCategoryService {

  constructor(
    @InjectRepository(InventoryCategories)
    private readonly inventoryCategoryRepository: Repository<InventoryCategories>,
  ) { }

  async create(data: { Name: string }, createdBy: string) {
    const inventoryCategory = this.inventoryCategoryRepository.create({
      ...data,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    return this.inventoryCategoryRepository.save(inventoryCategory);
  }

  async findAll() {
    return this.inventoryCategoryRepository.find();
  }

  async findOne(Id: number) {
    const inventoryCategory = await this.inventoryCategoryRepository.findOne({ where: { Id } });
    if (!inventoryCategory) {
      throw new NotFoundException(`Inventory Category with ID ${Id} not found`);
    }
    return inventoryCategory;
  }

  async update(Id: number, data: any) {
    try {
      const inventoryCategory = await this.inventoryCategoryRepository.findOne({ where: { Id } });
      if (!inventoryCategory) {
        throw new NotFoundException(`Inventory Category with ID ${Id} not found`);
      }

      const { Name, updatedBy } = data;

      const updateData: any = {};

      if (Name !== undefined) updateData.Name = Name;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();

      await this.inventoryCategoryRepository.update(Id, updateData);

      return this.inventoryCategoryRepository.findOne({ where: { Id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Inventory Category: ${error.message}`);
    }
  }

  async delete(id: number) {
    const result = await this.inventoryCategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory Category with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
