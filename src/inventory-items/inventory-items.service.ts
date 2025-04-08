import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryItems } from './_/inventory-items.entity';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';

@Injectable()
export class inventoryItemService {

  constructor(
    @InjectRepository(InventoryItems)
    private readonly inventoryItemsRepository: Repository<InventoryItems>,
    @InjectRepository(InventorySubCategories)
    private readonly inventorySubCategoriesRepository: Repository<InventorySubCategories>,
    @InjectRepository(InventorySuppliers)
    private readonly inventorySuppliersRepository: Repository<InventorySuppliers>,
    @InjectRepository(InventoryCategories)
    private readonly inventoryCategoriesRepository: Repository<InventoryCategories>,
  ) { }

  async create(
    data: {
      Name: string;
      SubCategoryId: number;
      UnitOfMeasure: string;
      SupplierId: number;
      ReorderLevel?: number;
      Stock: number;
    },
    createdBy: string
  ) {
    const subCategory = await this.inventorySubCategoriesRepository.findOne({
      where: { Id: data.SubCategoryId },
      withDeleted: false,
    });
    if (!subCategory) {
      throw new NotFoundException(`Sub Category with id ${data.SubCategoryId} not found`);
    }

    const supplier = await this.inventorySuppliersRepository.findOne({
      where: { Id: data.SupplierId },
      withDeleted: false,
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${data.SupplierId} not found`);
    }

    const lastItem = await this.inventoryItemsRepository.find({
      order: { Id: 'DESC' },
      take: 1,
    });
    const lastId = lastItem.length > 0 ? lastItem[0].Id : 0;
    const newId = lastId + 1001;
    const category = await this.inventoryCategoriesRepository.findOne({
      where: { Id: subCategory.CategoryId },
      withDeleted: true,
    });
    if (!category) {
      throw new NotFoundException(`Category of given subcategory not found not found`);
    }
    const categoryCode = category.Name.substring(0, 3).toUpperCase();
    const subCategoryCode = subCategory.Name.substring(0, 3).toUpperCase();

    const itemCode = `${categoryCode}-${subCategoryCode}-${newId}`;

    const inventoryItem = this.inventoryItemsRepository.create({
      ...data,
      ItemCode: itemCode,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
    });

    const savedItem = await this.inventoryItemsRepository.save(inventoryItem);

    return {
      Id: savedItem.Id,
      Name: savedItem.Name,
      ItemCode: savedItem.ItemCode,
      SubCategoryId: savedItem.SubCategoryId,
      SubCategoryName: subCategory.Name || null,
      UnitOfMeasure: savedItem.UnitOfMeasure,
      SupplierId: savedItem.SupplierId,
      SupplierName: supplier.Name || null,
      ReorderLevel: savedItem.ReorderLevel,
      Stock: savedItem.Stock,
      CreatedBy: savedItem.CreatedBy,
      UpdatedBy: savedItem.UpdatedBy,
      CreatedOn: savedItem.CreatedOn,
      UpdatedOn: savedItem.UpdatedOn,
    };
  }

  async findAll() {

    const items = await this.inventoryItemsRepository.find();
    const subCategoryIds = items.map(it => it.SubCategoryId);
    const suppliersIds = items.map(it => it.SupplierId);
    const subCategories = await this.inventorySubCategoriesRepository.find({
      where: { Id: In(subCategoryIds) },
      withDeleted: true,
    });
    const suppliers = await this.inventorySuppliersRepository.find({
      where: { Id: In(suppliersIds) },
      withDeleted: true,
    });

    const subCategoryMap = new Map(subCategories.map(cat => [cat.Id, cat.Name]));
    const suppliersMap = new Map(suppliers.map(sup => [sup.Id, sup.Name]));

    return items.map(item => ({
      Id: item.Id,
      Name: item.Name,
      ItemCode: item.ItemCode,
      SubCategoryId: item.SubCategoryId,
      SubCategoryName: subCategoryMap.get(item.SubCategoryId) || null,
      UnitOfMeasure: item.UnitOfMeasure,
      SupplierId: item.SupplierId,
      SupplierName: suppliersMap.get(item.SupplierId) || null,
      ReorderLevel: item.ReorderLevel,
      Stock: item.Stock,
      CreatedBy: item.CreatedBy,
      UpdatedBy: item.UpdatedBy,
      CreatedOn: item.CreatedOn,
      UpdatedOn: item.UpdatedOn,
    }));
  }

  async findOne(Id: number) {
    const inventoryItem = await this.inventoryItemsRepository.findOne({ where: { Id } });
    if (!inventoryItem) {
      throw new NotFoundException(`Inventory Item with ID ${Id} not found`);
    }

    const subCategory = await this.inventorySubCategoriesRepository.findOne({
      where: { Id: inventoryItem.SubCategoryId },
      withDeleted: true,
    });
    if (!subCategory) {
      throw new NotFoundException(`Sub Category with id ${inventoryItem.SubCategoryId} not found`);
    }

    const supplier = await this.inventorySuppliersRepository.findOne({
      where: { Id: inventoryItem.SupplierId },
      withDeleted: true,
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with id ${inventoryItem.SupplierId} not found`);
    }
    return {
      Id: inventoryItem.Id,
      Name: inventoryItem.Name,
      ItemCode: inventoryItem.ItemCode,
      SubCategoryId: inventoryItem.SubCategoryId,
      SubCategoryName: subCategory.Name || null,
      UnitOfMeasure: inventoryItem.UnitOfMeasure,
      SupplierId: inventoryItem.SupplierId,
      SupplierName: supplier.Name || null,
      ReorderLevel: inventoryItem.ReorderLevel,
      Stock: inventoryItem.Stock,
      CreatedBy: inventoryItem.CreatedBy,
      UpdatedBy: inventoryItem.UpdatedBy,
      CreatedOn: inventoryItem.CreatedOn,
      UpdatedOn: inventoryItem.UpdatedOn,
    };
  }

  async update(Id: number, data: any) {
    try {
      const inventoryItem = await this.inventoryItemsRepository.findOne({ where: { Id } });
      if (!inventoryItem) {
        throw new NotFoundException(`Inventory Item with ID ${Id} not found`);
      }

      const { Name, updatedBy } = data;

      const updateData: any = {};

      if (Name !== undefined) updateData.Name = Name;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();

      await this.inventoryItemsRepository.update(Id, updateData);

      return this.inventoryItemsRepository.findOne({ where: { Id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Inventory Item: ${error.message}`);
    }
  }

  async delete(id: number) {
    const result = await this.inventoryItemsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory Item with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
