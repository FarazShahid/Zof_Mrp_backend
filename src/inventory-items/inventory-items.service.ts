import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryItems } from './_/inventory-items.entity';
import { InventorySubCategories } from 'src/inventory-sub-categories/_/inventory-sub-categories.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { InventoryCategories } from 'src/inventory-categories/_/inventory-categories.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
import { InventoryTransactions } from 'src/inventory-transections/_/inventory-transections.entity';

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
    @InjectRepository(InventoryTransactions)
    private readonly inventoryTransactionRepository: Repository<InventoryTransactions>,
  ) { }

  async create(
    data: {
      Name: string;
      SubCategoryId: number | null;
      CategoryId: number;
      UnitOfMeasureId: number;
      SupplierId: number;
      ReorderLevel?: number;
    },
    createdBy: string
  ) {


    let subCategory: any | null;

    const category = await this.inventoryCategoriesRepository.findOne({
      where: { Id: data.CategoryId },
      withDeleted: false,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${data.CategoryId} not found`);
    }

    if (data.SubCategoryId) {
      subCategory = await this.inventorySubCategoriesRepository.findOne({
        where: { Id: data.SubCategoryId },
        withDeleted: false,
      });

      if (!subCategory) {
        throw new NotFoundException(`Sub Category with id ${data.SubCategoryId} not found`);
      }

      if (subCategory.CategoryId !== data.CategoryId) {
        throw new BadRequestException(`Sub Category does not belong to the given Category`);
      }
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


    const categoryCode = category?.Name?.substring(0, 3)?.toUpperCase();
    // const subCategoryCode = subCategory?.Name?.substring(0, 3).toUpperCase() || "GEN";

    const itemCode = `${categoryCode}-${newId}`;

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
      Name: savedItem?.Name,
      ItemCode: savedItem.ItemCode,
      CategoryId: savedItem.CategoryId || null,
      CategoryName: category?.Name || null,
      SubCategoryId: savedItem.SubCategoryId,
      SubCategoryName: subCategory?.Name ?? null,
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

    const categoryIds = items
      .filter(it => it.CategoryId !== null)
      .map(it => it.CategoryId);

    const subCategoryIds = items
      .filter(it => it.SubCategoryId !== null)
      .map(it => it.SubCategoryId);

    const suppliersIds = items
      .filter(it => it.SupplierId !== null)
      .map(it => it.SupplierId);

    const unitOfMeasureIds = items
      .filter(it => it.UnitOfMeasureId !== null)
      .map(it => it.UnitOfMeasureId);


    const categories = await this.inventoryCategoriesRepository.find({
      where: { Id: In(categoryIds) },
      withDeleted: true,
    });

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

    const categoryMap = new Map(categories.map(cat => [cat.Id, cat.Name]))
    const subCategoryMap = new Map(subCategories.map(sub => [sub.Id, sub.Name]));
    const suppliersMap = new Map(suppliers.map(sup => [sup.Id, sup.Name]));
    const unitOfMeasuresMap = new Map(unitOfMeasures.map(um => [um.Id, um]));

    return items.map(item => ({
      Id: item.Id,
      Name: item.Name,
      ItemCode: item.ItemCode,
      CategoryId: item?.CategoryId || null,
      CategoryName: item?.CategoryId ? categoryMap.get(item?.CategoryId) || null : null,
      SubCategoryId: item.SubCategoryId,
      SubCategoryName: item?.SubCategoryId ? subCategoryMap.get(item.SubCategoryId) || null : null,
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

    const category = await this.inventoryCategoriesRepository.findOne({
      where: { Id: inventoryItem.CategoryId },
      withDeleted: true,
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${inventoryItem.CategoryId} not found`);
    }

    let subCategoryName: string | null = null;

    if (inventoryItem.SubCategoryId) {
      const subCategory = await this.inventorySubCategoriesRepository.findOne({
        where: { Id: inventoryItem.SubCategoryId },
        withDeleted: true,
      });

      if (!subCategory) {
        throw new NotFoundException(`Sub Category with id ${inventoryItem.SubCategoryId} not found`);
      }

      subCategoryName = subCategory.Name;
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
      CategoryId: inventoryItem?.CategoryId || null,
      CategoryName: category?.Name || null,
      SubCategoryId: inventoryItem?.SubCategoryId || null,
      SubCategoryName: subCategoryName || null,
      UnitOfMeasureId: inventoryItem.UnitOfMeasureId,
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

      const { CategoryId, SubCategoryId, updatedBy } = data;

      if (CategoryId !== inventoryItem?.CategoryId) {
        const category = await this.inventoryCategoriesRepository.findOne({ where: { Id: CategoryId } })
        if (!category) throw new BadRequestException(`Category Item with ID ${Id} not found`)
        inventoryItem.SubCategoryId = null
      }
      if (SubCategoryId) {
        const subCategory = await this.inventorySubCategoriesRepository.findOne({
          where: { Id: data.SubCategoryId },
          withDeleted: false,
        });
        if (!subCategory) {
          throw new NotFoundException(`Sub Category with id ${data.SubCategoryId} not found`);
        }

        if (subCategory.CategoryId !== data.CategoryId) {
          throw new BadRequestException(`Sub Category does not belong to the given Category`);
        }
      }

      const updateData: Partial<typeof inventoryItem> = {
        ...inventoryItem,
        Name: data.Name ?? inventoryItem.Name,
        ReorderLevel: data.ReorderLevel ?? inventoryItem.ReorderLevel,
        CategoryId: data.CategoryId,
        SubCategoryId: data?.SubCategoryId ?? null,
        UnitOfMeasureId: data.UnitOfMeasureId ?? inventoryItem.UnitOfMeasureId,
        SupplierId: data.SupplierId ?? inventoryItem.SupplierId,
        UpdatedBy: updatedBy,
        UpdatedOn: new Date(),
      };

      const updated = await this.inventoryItemsRepository.save({
        ...updateData,
        Id,
      });

      return updated;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Inventory Item: ${error.message}`);
    }
  }

  async delete(id: number) {
    const existingTransaction = await this.inventoryTransactionRepository.find(
      {
        where: { InventoryItemId: id },
        withDeleted: true,
      },
    );

    if (existingTransaction.length > 0) {
      throw new ConflictException('Cannot delete item: one or more transactions exist against this item.');
    }
    const result = await this.inventoryItemsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory Item with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
