import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SleeveType } from './entities/sleeve-type.entity/sleeve-type.entity';
import { CreateSleeveTypeDto } from './dto/create-sleeve-type.dto/create-sleeve-type.dto';
import { UpdateSleeveTypeDto } from './dto/update-sleeve-type.dto/update-sleeve-type.dto';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Injectable()
export class SleeveTypeService {
  constructor(
    @InjectRepository(SleeveType)
    private sleeveRepository: Repository<SleeveType>,

    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
  ) {}

  async create(data: CreateSleeveTypeDto): Promise<any> {
    const category = await this.categoryRepository.findOne({ where: { id: data.productCategoryId } });
    if (!category) {
      throw new NotFoundException(`Product Category not found.`);
    }
  
    const existingSleeve = await this.sleeveRepository.findOne({ where: { sleeveTypeName: data.sleeveTypeName } });
    if (existingSleeve) {
      throw new BadRequestException(`Sleeve Type already exists.`);
    }
  
    const newSleeve = this.sleeveRepository.create({
      sleeveTypeName: data.sleeveTypeName,
      productCategory: category,
      createdBy: data.createdBy,
    });
  
    const savedSleeve = await this.sleeveRepository.save(newSleeve);

    return {
      id: savedSleeve.id,
      sleeveTypeName: savedSleeve.sleeveTypeName,
      createdOn: savedSleeve.createdOn,
      createdBy: savedSleeve.createdBy,
      updatedOn: savedSleeve.updatedOn,
      updatedBy: savedSleeve.updatedBy,
      productCategoryId: savedSleeve.productCategory.id,
      categoryName: savedSleeve.productCategory.type, 
    };
  }

  async findAll(): Promise<any[]> {
    const sleeves = await this.sleeveRepository.find({ relations: ['productCategory'] });
  
    return sleeves.map((sleeve) => ({
      id: sleeve.id,
      sleeveTypeName: sleeve.sleeveTypeName,
      productCategoryId: sleeve.productCategory.id,
      categoryName: sleeve.productCategory.type,
      createdOn: sleeve.createdOn,
      createdBy: sleeve.createdBy,
      updatedOn: sleeve.updatedOn,
      updatedBy: sleeve.updatedBy,
    }));
  }

  async findOne(id: number): Promise<any> {
    const sleeve = await this.sleeveRepository.findOne({
      where: { id },
      relations: ['productCategory'],
    });
  
    if (!sleeve) {
      throw new NotFoundException(`Sleeve Type not found.`);
    }
  
    return {
      id: sleeve.id,
      sleeveTypeName: sleeve.sleeveTypeName,
      productCategoryId: sleeve.productCategory.id,
      categoryName: sleeve.productCategory.type,
      createdOn: sleeve.createdOn,
      createdBy: sleeve.createdBy,
      updatedOn: sleeve.updatedOn,
      updatedBy: sleeve.updatedBy,
    };
  }

  async update(id: number, data: UpdateSleeveTypeDto): Promise<SleeveType> {
    const sleeve = await this.findOne(id);
  
    if (data.sleeveTypeName) {
      const existingSleeve = await this.sleeveRepository.findOne({
        where: { sleeveTypeName: data.sleeveTypeName },
      });
  
      if (existingSleeve && existingSleeve.id !== id) {
        throw new BadRequestException(`Sleeve Type "${data.sleeveTypeName}" already exists.`);
      }
    }
  
    if (data.productCategoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: data.productCategoryId } });
      if (!category) {
        throw new NotFoundException(`Product Category with ID ${data.productCategoryId} not found.`);
      }
    
      sleeve.productCategory = category;
    }
  
    sleeve.sleeveTypeName = data.sleeveTypeName || sleeve.sleeveTypeName;
  
    await this.sleeveRepository.save(sleeve); 
  
    return this.findOne(id);
  }
  
  async remove(id: number): Promise<{ message: string }> {
    const sleeve = await this.findOne(id);
    await this.sleeveRepository.delete(id);
    return { message: `Sleeve Type has been deleted.` };
  }
}
