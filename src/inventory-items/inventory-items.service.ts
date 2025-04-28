import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryItems } from './_/inventory-items.entity';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';

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
    @InjectRepository(UnitOfMeasures)
    private readonly inventoryUnitOfMeasuresRepository: Repository<UnitOfMeasures>,
  ) { }

  async create(
    data: {
      Name: string;
      SubCategoryId: number;
      UnitOfMeasureId: number;
      SupplierId: number;
      ReorderLevel?: number;
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

    const UnitOfMeasures = await this.inventoryUnitOfMeasuresRepository.findOne({
      where: { Id: data.UnitOfMeasureId },
      withDeleted: false,
    });
    if (!UnitOfMeasures) {
      throw new NotFoundException(`Unit Of Measures with id ${data.UnitOfMeasureId} not found`);
    }

    const lastItem = await this.inventoryItemsRepository.find({
      order: { Id: 'DESC' },
      take: 1,
      withDeleted: true
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
      Stock: 0,
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
      UnitOfMeasureId: savedItem.UnitOfMeasureId,
      UnitOfMeasureName: UnitOfMeasures.Name,
      UnitOfMeasureShortForm: UnitOfMeasures.ShortForm,
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
    const unitOfMeasureIds = items.map(it => it.UnitOfMeasureId);
    const subCategories = await this.inventorySubCategoriesRepository.find({
      where: { Id: In(subCategoryIds) },
      withDeleted: true,
    });
    const suppliers = await this.inventorySuppliersRepository.find({
      where: { Id: In(suppliersIds) },
      withDeleted: true,
    });

    const unitOfMeasures = await this.inventoryUnitOfMeasuresRepository.find({
      where: { Id: In(unitOfMeasureIds) },
      withDeleted: true,
    });

    const subCategoryMap = new Map(subCategories.map(cat => [cat.Id, cat.Name]));
    const suppliersMap = new Map(suppliers.map(sup => [sup.Id, sup.Name]));
    const unitOfMeasuresMap = new Map(unitOfMeasures.map(um => [um.Id, um]));

    return items.map(item => ({
      Id: item.Id,
      Name: item.Name,
      ItemCode: item.ItemCode,
      SubCategoryId: item.SubCategoryId,
      SubCategoryName: subCategoryMap.get(item.SubCategoryId) || null,
      UnitOfMeasureId: item.UnitOfMeasureId,
      UnitOfMeasureName: unitOfMeasuresMap.get(item.UnitOfMeasureId).Name || null,
      UnitOfMeasureShortForm: unitOfMeasuresMap.get(item.UnitOfMeasureId).ShortForm || null,
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

    const UnitOfMeasures = await this.inventoryUnitOfMeasuresRepository.findOne({
      where: { Id: inventoryItem.UnitOfMeasureId },
      withDeleted: true,
    });
    if (!UnitOfMeasures) {
      throw new NotFoundException(`Unit Of Measures with id ${inventoryItem.UnitOfMeasureId} not found`);
    }
    return {
      Id: inventoryItem.Id,
      Name: inventoryItem.Name,
      ItemCode: inventoryItem.ItemCode,
      SubCategoryId: inventoryItem.SubCategoryId,
      SubCategoryName: subCategory.Name || null,
      UnitOfMeasure: inventoryItem.UnitOfMeasureId,
      UnitOfMeasureName: UnitOfMeasures.Name,
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

      const { Name, ReorderLevel,  updatedBy } = data;

      const updateData: any = {};

      if (Name !== undefined) updateData.Name = Name;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();
      updateData.ReorderLevel = ReorderLevel;

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
