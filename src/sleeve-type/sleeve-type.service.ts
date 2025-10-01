import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SleeveType } from './entities/sleeve-type.entity/sleeve-type.entity';
import { CreateSleeveTypeDto } from './dto/create-sleeve-type.dto/create-sleeve-type.dto';
import { UpdateSleeveTypeDto } from './dto/update-sleeve-type.dto/update-sleeve-type.dto';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Injectable()
export class SleeveTypeService {
  private readonly logger = new Logger(SleeveTypeService.name);

  constructor(
    @InjectRepository(SleeveType)
    private sleeveRepository: Repository<SleeveType>,

    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
  ) { }

  async create(data: CreateSleeveTypeDto, userEmail: string): Promise<any> {
    try {
      this.logger.log(`Creating sleeve type with data: ${JSON.stringify(data)}, createdBy: ${userEmail}`);

      const category = await this.categoryRepository.findOne({ where: { Id: data.productCategoryId } });
      if (!category) {
        throw new NotFoundException(`Product Category not found.`);
      }

      const newSleeve = this.sleeveRepository.create({
        SleeveTypeName: data.sleeveTypeName,
        productCategory: category,
        CreatedBy: userEmail,
        UpdatedBy: userEmail
      });

      const savedSleeve = await this.sleeveRepository.save(newSleeve);

      return {
        id: savedSleeve.Id,
        sleeveTypeName: savedSleeve.SleeveTypeName,
        CreatedOn: savedSleeve.CreatedOn,
        CreatedBy: savedSleeve.CreatedBy,
        UpdatedOn: savedSleeve.UpdatedOn,
        updatedBy: savedSleeve.UpdatedBy,
        productCategoryId: savedSleeve.productCategory.Id,
        categoryName: savedSleeve.productCategory.Type,
      };
    } catch (error) {
      this.logger.error(`Error creating sleeve type: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<any> {
    try {

      const result = await this.sleeveRepository
        .createQueryBuilder('sleeve')
        .leftJoin('productcategory', 'category', 'sleeve.productCategoryId = category.Id')
        .select([
          'sleeve.Id AS id',
          'sleeve.SleeveTypeName AS sleeveTypeName',
          'sleeve.ProductCategoryId AS productCategoryId',
          'category.Type AS categoryName',
          'sleeve.CreatedOn AS CreatedOn',
          'sleeve.CreatedBy AS CreatedBy',
          'sleeve.UpdatedOn AS UpdatedOn',
          'sleeve.UpdatedBy AS updatedBy'
        ])
        .orderBy('sleeve.CreatedOn', 'DESC')
        .getRawMany();

      return result.map(sleeve => ({
        id: sleeve.id,
        sleeveTypeName: sleeve.sleeveTypeName,
        productCategoryId: sleeve.productCategoryId,
        categoryName: sleeve.categoryName,
        CreatedOn: sleeve.CreatedOn,
        CreatedBy: sleeve.CreatedBy,
        UpdatedOn: sleeve.UpdatedOn,
        updatedBy: sleeve.updatedBy
      }));
    } catch (error) {
      this.logger.error(`Error fetching sleeve types: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      this.logger.log(`Finding sleeve type with id: ${id}`);

      const result = await this.sleeveRepository
        .createQueryBuilder('sleeve')
        .leftJoin('productcategory', 'category', 'sleeve.productCategoryId = category.Id')
        .select([
          'sleeve.Id AS id',
          'sleeve.SleeveTypeName AS sleeveTypeName',
          'sleeve.ProductCategoryId AS productCategoryId',
          'category.Type AS categoryName',
          'sleeve.CreatedOn AS CreatedOn',
          'sleeve.CreatedBy AS CreatedBy',
          'sleeve.UpdatedOn AS UpdatedOn',
          'sleeve.UpdatedBy AS updatedBy'
        ])
        .where('sleeve.Id = :id', { id })
        .getRawOne();

      if (!result) {
        throw new NotFoundException(`Sleeve Type not found.`);
      }

      return {
        id: result.id,
        sleeveTypeName: result.sleeveTypeName,
        productCategoryId: result.productCategoryId,
        categoryName: result.categoryName,
        CreatedOn: result.CreatedOn,
        CreatedBy: result.CreatedBy,
        UpdatedOn: result.UpdatedOn,
        updatedBy: result.updatedBy
      };
    } catch (error) {
      this.logger.error(`Error finding sleeve type: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, data: UpdateSleeveTypeDto, userEmail: string): Promise<any> {
    try {
      this.logger.log(`Updating sleeve type with id: ${id}, data: ${JSON.stringify(data)}, updatedBy: ${userEmail}`);

      const sleeve = await this.sleeveRepository.findOne({ where: { Id: id } });
      if (!sleeve) {
        throw new NotFoundException(`Sleeve Type not found.`);
      }

      if (data.sleeveTypeName) {
        const existingSleeve = await this.sleeveRepository.findOne({
          where: { SleeveTypeName: data.sleeveTypeName },
        });

        if (existingSleeve && existingSleeve.Id !== id) {
          throw new BadRequestException(`Sleeve Type "${data.sleeveTypeName}" already exists.`);
        }
      }

      if (data.productCategoryId) {
        const category = await this.categoryRepository.findOne({ where: { Id: data.productCategoryId } });
        if (!category) {
          throw new NotFoundException(`Product Category with ID ${data.productCategoryId} not found.`);
        }

        sleeve.productCategory = category;
      }

      sleeve.SleeveTypeName = data.sleeveTypeName || sleeve.SleeveTypeName;
      sleeve.UpdatedBy = userEmail;

      await this.sleeveRepository.save(sleeve);

      return this.findOne(id);
    } catch (error) {
      this.logger.error(`Error updating sleeve type: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing sleeve type with id: ${id}`);

      const sleeve = await this.sleeveRepository.findOne({ where: { Id: id } });
      if (!sleeve) {
        throw new NotFoundException(`Sleeve Type not found.`);
      }

      await this.sleeveRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting sleeve type: ${error.message}`, error.stack);
      throw error;
    }
  }
}
