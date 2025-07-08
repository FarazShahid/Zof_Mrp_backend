import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryCategories } from './_/inventory-categories.entity';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';

@Injectable()
export class InventoryCategoryService {

  constructor(
    @InjectRepository(InventoryCategories)
    private readonly inventoryCategoryRepository: Repository<InventoryCategories>,

    @InjectRepository(InventorySubCategories)
    private readonly inventorySubCategoryRepository: Repository<InventorySubCategories>,

    @InjectRepository(InventoryItems)
    private readonly inventoryItemsRepoistory: Repository<InventoryItems>,


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
    const category = await this.inventoryCategoryRepository.findOne({ where: { Id: id } });
    if (!category) {
      throw new NotFoundException(`Inventory Category with ID ${id} not found`);
    }
    const hasSubCategories = await this.inventorySubCategoryRepository.count({
      where: { CategoryId: id },
    });
    if (hasSubCategories > 0) {
      throw new ConflictException(`Cannot delete category: it has subcategories`);
    }
    const usedInItems = await this.inventoryItemsRepoistory.count({
      where: { CategoryId: id },
    });
    const subCategories = await this.inventorySubCategoryRepository.find({
      where: { CategoryId: id },
    });
    const subCategoryIds = subCategories.map(sub => sub.Id);

    if (subCategoryIds.length > 0) {
      const usedSubCategoryItems = await this.inventoryItemsRepoistory.count({
        where: { SubCategoryId: In(subCategoryIds) },
      });

      if (usedSubCategoryItems > 0) {
        throw new ConflictException(
          `Cannot delete category: one or more of its subcategories are used in inventory items`
        );
      }
    }

    const result = await this.inventoryCategoryRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory Category with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
