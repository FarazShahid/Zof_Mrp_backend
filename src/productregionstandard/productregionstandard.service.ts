import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { ProductRegionStandard } from './_/product-region-standard.entity';
import { CreateProductRegionStandardDto } from './_/create-product-region-standard.dto';
import { UpdateProductRegionStandardDto } from './_/update-product-region-standard.dto';

@Injectable()
export class ProductRegionStandardService {
  constructor(
    @InjectRepository(ProductRegionStandard)
    private readonly productRegionStandardRepo: Repository<ProductRegionStandard>,
  ) {}

  async create(dto: CreateProductRegionStandardDto, createdBy: string): Promise<ProductRegionStandard> {

    const existingRegion = await this.productRegionStandardRepo.findOne({
      where: { Name: dto.Name },
    });
  
    if (existingRegion) {
      throw new BadRequestException('A product region with this name already exists.');
    }
    const newRegion = this.productRegionStandardRepo.create({
      ...dto,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
    });
    return this.productRegionStandardRepo.save({
      Id: newRegion.Id,
      Name: newRegion.Name,
      CreatedOn: newRegion.CreatedOn,
      CreatedBy: newRegion.CreatedBy,
      UpdatedOn: newRegion.UpdatedOn,
      UpdatedBy: newRegion.UpdatedBy,
    });
  }

  async findAll(): Promise<ProductRegionStandard[]> {
    return this.productRegionStandardRepo.find();
  }

  async findOne(id: number): Promise<ProductRegionStandard> {
    const region = await this.productRegionStandardRepo.findOne({ where: { Id: id } });
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    return region;
  }

  async update(id: number, dto: UpdateProductRegionStandardDto, updatedBy: string): Promise<ProductRegionStandard> {

    const existingRegion = await this.findOne(id);
    if (!existingRegion) {
      throw new NotFoundException('Product region not found.');
    }
  
    // Check if another product region already has the new name
    if (dto.Name) {
      const duplicateRegion = await this.productRegionStandardRepo.findOne({
        where: { Name: dto.Name, Id: Not(id) }, // Ensures we are not checking the same record
      });
  
      if (duplicateRegion) {
        throw new BadRequestException('A product region with this name already exists.');
      }
    }

    
    await this.productRegionStandardRepo.update(id, { ...dto, UpdatedBy: updatedBy, UpdatedOn: new Date() });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productRegionStandardRepo.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
  }
}
