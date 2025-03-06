import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRegionStandard } from './_/product-region-standard.entity';
import { CreateProductRegionStandardDto } from './_/create-product-region-standard.dto';
import { UpdateProductRegionStandardDto } from './_/update-product-region-standard.dto';

@Injectable()
export class ProductRegionStandardService {
  constructor(
    @InjectRepository(ProductRegionStandard)
    private readonly productRegionStandardRepo: Repository<ProductRegionStandard>,
  ) {}

  async create(dto: CreateProductRegionStandardDto): Promise<ProductRegionStandard> {
    const newRegion = this.productRegionStandardRepo.create(dto);
    return this.productRegionStandardRepo.save(newRegion);
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

  async update(id: number, dto: UpdateProductRegionStandardDto): Promise<ProductRegionStandard> {
    await this.productRegionStandardRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productRegionStandardRepo.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
  }
}
