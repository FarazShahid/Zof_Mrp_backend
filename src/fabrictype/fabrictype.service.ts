import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FabricType } from './_/fabrictype.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { Product } from 'src/products/entities/product.entity';
@Injectable()
export class FabricTypeService {
  constructor(
    @InjectRepository(FabricType)
    private readonly fabricTypeRepository: Repository<FabricType>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(data: { type: string; name: string; gsm: number; CategoryId: number; createdBy: string }) {
    const fabric = this.fabricTypeRepository.create({
      Type: data.type,
      Name: data.name,
      GSM: data.gsm,
      CreatedBy: data.createdBy,
      CategoryId: data.CategoryId ?? null,
      CreatedOn: new Date(),
    });
    return this.fabricTypeRepository.save(fabric);
  }

  async findAll() {
    const response = await this.fabricTypeRepository.find();
    const CategoryIds = response.filter(e => e.CategoryId).map(e => e.CategoryId);
    const categories = await this.productCategoryRepository.find({
      where: { Id: In(CategoryIds) },
      withDeleted: true,
    });
    const categoryMap = new Map(categories.map(cat => [cat.Id, cat.Type]));
    return response.map(e => ({
      id: e.Id,
      name: e.Name,
      type: e.Type,
      gsm: e.GSM,
      categoryid: e.CategoryId,
      categoryName: categoryMap.get(e.CategoryId) ?? "N/A",
      createdOn: e.CreatedOn,
      createdBy: e.CreatedBy,
      updatedOn: e.UpdatedOn,
      updatedBy: e.UpdatedBy
    }));
  }

  async findOne(id: number) {
    const fabricType = await this.fabricTypeRepository.findOne({ where: { Id: id } });
    if (!fabricType) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }
    const category = await this.productCategoryRepository.findOne({
      where: { Id: fabricType.CategoryId },
      withDeleted: true,
    });

    return {
      id: fabricType.Id,
      name: fabricType.Name,
      type: fabricType.Type,
      gsm: fabricType.GSM,
      categoryid: fabricType.CategoryId,
      categoryName: category?.Type ?? "N/A",
      createdOn: fabricType.CreatedOn,
      createdBy: fabricType.CreatedBy,
      updatedOn: fabricType.UpdatedOn,
      updatedBy: fabricType.UpdatedBy
    };
  }

  async update(id: number, data: any) {
    try {
      const fabricType = await this.fabricTypeRepository.findOne({ where: { Id: id } });
      if (!fabricType) {
        throw new NotFoundException(`Fabric type with ID ${id} not found`);
      }

      const { type, name, gsm, updatedBy, CategoryId } = data;
      const updateData: any = {};

      if (type !== undefined) updateData.Type = type;
      if (name !== undefined) updateData.Name = name;
      if (gsm !== undefined) updateData.GSM = gsm;
      if (CategoryId !== undefined) updateData.CategoryId = CategoryId;

      updateData.UpdatedBy = updatedBy;
      updateData.UpdatedOn = new Date();

      await this.fabricTypeRepository.update(id, updateData);

      return this.fabricTypeRepository.findOne({ where: { Id: id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update fabric type: ${error.message}`);
    }
  }

  async delete(id: number) {
    // First check if the fabric type exists
    const fabricType = await this.fabricTypeRepository.findOne({ where: { Id: id } });
    if (!fabricType) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }

    // Check if any products are using this fabric type
    const productsUsingFabricType = await this.productRepository.find({
      where: { FabricTypeId: id }
    });

    if (productsUsingFabricType.length > 0) {
      throw new BadRequestException(
        `Fabric type "${fabricType.Name}" cannot be deleted because it is associated to products.`
      );
    }

    // If no products are using this fabric type, proceed with deletion
    const result = await this.fabricTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
