import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventorySuppliers } from './_/inventory-suppliers.entity';

@Injectable()
export class InventorySupplierService {

  constructor(
    @InjectRepository(InventorySuppliers)
    private readonly inventorySuppliersRepository: Repository<InventorySuppliers>,
  ) { }

  async create(
    data: {
      Name: string;
      CompleteAddress?: string | null;
      City?: string | null;
      State?: string | null;
      Country?: string | null;
      Phone?: string | null;
      Email?: string | null;
    },
    createdBy: string
  ){
    const inventorySupplier = this.inventorySuppliersRepository.create({
      ...data,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    const savedInventorySupplier = await this.inventorySuppliersRepository.save(inventorySupplier);
    return {
      Id: savedInventorySupplier.Id,
      Name: savedInventorySupplier.Name,
      Email: savedInventorySupplier.Email,
      Phone: savedInventorySupplier.Phone,
      Country: savedInventorySupplier.Country,
      State: savedInventorySupplier.State,
      City: savedInventorySupplier.City,
      CompleteAddress: savedInventorySupplier.CompleteAddress,
      CreatedBy: savedInventorySupplier.CreatedBy,
      UpdatedBy: savedInventorySupplier.UpdatedBy,
      CreatedOn: savedInventorySupplier.CreatedOn,
      UpdatedOn: savedInventorySupplier.UpdatedOn,
    };
  }

  async findAll() {
    const fetchedSuppliers = await this.inventorySuppliersRepository.find();
    return fetchedSuppliers.map(e => ({
      Id: e.Id,
      Name: e.Name,
      Phone: e.Phone,
      Country: e.Country,
      State: e.State,
      City: e.City,
      CompleteAddress: e.CompleteAddress,
      CreatedBy: e.CreatedBy,
      UpdatedBy: e.UpdatedBy,
      CreatedOn: e.CreatedOn,
      UpdatedOn: e.UpdatedOn,
    }));
  }

  async findOne(Id: number) {
    const inventorySupplier = await this.inventorySuppliersRepository.findOne({ where: { Id } });
    if (!inventorySupplier) {
      throw new NotFoundException(`Inventory Supplier with ID ${Id} not found`);
    }
    return {
      Id: inventorySupplier.Id,
      Name: inventorySupplier.Name,
      Phone: inventorySupplier.Phone,
      Country: inventorySupplier.Country,
      State: inventorySupplier.State,
      City: inventorySupplier.City,
      CompleteAddress: inventorySupplier.CompleteAddress,
      CreatedBy: inventorySupplier.CreatedBy,
      UpdatedBy: inventorySupplier.UpdatedBy,
      CreatedOn: inventorySupplier.CreatedOn,
      UpdatedOn: inventorySupplier.UpdatedOn,
    };
  }

  async update(Id: number, data: any) {
    try {
      const inventorySupplier = await this.inventorySuppliersRepository.findOne({ where: { Id } });
      if (!inventorySupplier) {
        throw new NotFoundException(`Inventory Supplier with ID ${Id} not found`);
      }

      const { Name, updatedBy } = data;

      const updateData: any = {};

      if (Name !== undefined) updateData.Name = Name;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();

      await this.inventorySuppliersRepository.update(Id, updateData);
      const updatedInventorySupplier = await this.inventorySuppliersRepository.findOne({ where: { Id } });

      return {
        Id: updatedInventorySupplier.Id,
        Name: updatedInventorySupplier.Name,
        Phone: updatedInventorySupplier.Phone,
        Country: updatedInventorySupplier.Country,
        State: updatedInventorySupplier.State,
        City: updatedInventorySupplier.City,
        CompleteAddress: updatedInventorySupplier.CompleteAddress,
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
    const result = await this.inventorySuppliersRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory Supplier with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
