import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasures } from './_/inventory-unit-measures.entity';

@Injectable()
export class InventoryUnitOfMeasuresService {

  constructor(
    @InjectRepository(UnitOfMeasures)
    private readonly inventoryUnitOfMeasuresRepository: Repository<UnitOfMeasures>,
  ) { }

  async create(
    data: {
      Name: string;
      ShortForm?: string | null;
    },
    createdBy: string
  ) {
    const inventorySupplier = this.inventoryUnitOfMeasuresRepository.create({
      ...data,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    const savedInventorySupplier = await this.inventoryUnitOfMeasuresRepository.save(inventorySupplier);
    return {
      Id: savedInventorySupplier.Id,
      Name: savedInventorySupplier.Name,
      ShortForm: savedInventorySupplier.ShortForm,
      CreatedBy: savedInventorySupplier.CreatedBy,
      UpdatedBy: savedInventorySupplier.UpdatedBy,
      CreatedOn: savedInventorySupplier.CreatedOn,
      UpdatedOn: savedInventorySupplier.UpdatedOn,
    };
  }

  async findAll() {
    const fetchedSuppliers = await this.inventoryUnitOfMeasuresRepository.find();
    return fetchedSuppliers.map(e => ({
      Id: e.Id,
      Name: e.Name,
      ShortForm: e.ShortForm,
      CreatedBy: e.CreatedBy,
      UpdatedBy: e.UpdatedBy,
      CreatedOn: e.CreatedOn,
      UpdatedOn: e.UpdatedOn,
    }));
  }

  async findOne(Id: number) {
    const inventorySupplier = await this.inventoryUnitOfMeasuresRepository.findOne({ where: { Id } });
    if (!inventorySupplier) {
      throw new NotFoundException(`Inventory Supplier with ID ${Id} not found`);
    }
    return {
      Id: inventorySupplier.Id,
      Name: inventorySupplier.Name,
      ShortForm: inventorySupplier.ShortForm,
      CreatedBy: inventorySupplier.CreatedBy,
      UpdatedBy: inventorySupplier.UpdatedBy,
      CreatedOn: inventorySupplier.CreatedOn,
      UpdatedOn: inventorySupplier.UpdatedOn,
    };
  }

  async update(Id: number, data: any) {
    try {
      const inventorySupplier = await this.inventoryUnitOfMeasuresRepository.findOne({ where: { Id } });
      if (!inventorySupplier) {
        throw new NotFoundException(`Inventory Supplier with ID ${Id} not found`);
      }

      const { Name, ShortForm, updatedBy } = data;

      const updateData: any = {};

      if (Name !== undefined) updateData.Name = Name;
      if (ShortForm !== undefined) updateData.ShortForm = ShortForm;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();

      await this.inventoryUnitOfMeasuresRepository.update(Id, updateData);
      const updatedInventorySupplier = await this.inventoryUnitOfMeasuresRepository.findOne({ where: { Id } });

      return {
        Id: updatedInventorySupplier.Id,
        Name: updatedInventorySupplier.Name,
        ShortForm: updatedInventorySupplier.ShortForm,
        CreatedBy: updatedInventorySupplier.CreatedBy,
        UpdatedBy: updatedInventorySupplier.UpdatedBy,
        CreatedOn: updatedInventorySupplier.CreatedOn,
        UpdatedOn: updatedInventorySupplier.UpdatedOn,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update Inventory Supplier: ${error.message}`);
    }
  }

  async delete(id: number) {
    const result = await this.inventoryUnitOfMeasuresRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory unit of measures with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
