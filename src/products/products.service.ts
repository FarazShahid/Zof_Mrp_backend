import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Validate required fields manually (if not using DTO validation in controller)
      const requiredFields = ['ProductCategoryId', 'FabricTypeId', 'Name', 'CreatedBy', 'UpdatedBy'];
      for (const field of requiredFields) {
        if (!createProductDto[field]) {
          throw new BadRequestException(`${field} is required`);
        }
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException(error.message || 'Error creating product');
    }
  }

  async getAllProducts(): Promise<any[]> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('fabrictype', 'fabric', 'fabric.Id = product.FabricTypeId')
        .leftJoin('productcategory', 'category', 'category.Id = product.ProductCategoryId')
        .select([
          'product.Id AS Id',
          'product.ProductCategoryId AS ProductCategoryId',
          'category.Type AS ProductCategoryName',
          'product.FabricTypeId AS FabricTypeId',
          'fabric.Type AS FabricType',
          'fabric.Name AS FabricName',
          'fabric.GSM AS GSM',
          'product.Name AS Name',
          'product.Description AS Description',
          'product.CreatedOn AS CreatedOn',
          'product.UpdatedOn AS UpdatedOn',
          'product.CreatedBy AS CreatedBy',
          'product.UpdatedBy AS UpdatedBy'
        ])
        .getRawMany();
  
      return products.map(product => ({
        Id: product.Id,
        ProductCategoryId: product.ProductCategoryId,
        ProductCategoryName: product.ProductCategoryName,
        FabricTypeId: product.FabricTypeId,
        FabricType: product.FabricType,
        FabricName: product.FabricName,
        GSM: product.GSM,
        Name: product.Name,
        Description: product.Description,
        CreatedBy: product.CreatedBy,
        UpdatedBy: product.UpdatedBy,
        CreatedOn: product.CreatedOn,
        UpdatedOn: product.UpdatedOn
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }  

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { Id: id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const requiredFields = ['ProductCategoryId', 'FabricTypeId', 'Name', 'UpdatedBy'];
    for (const field of requiredFields) {
      if (updateProductDto[field] === undefined || updateProductDto[field] === '') {
        throw new BadRequestException(`${field} is required`);
      }
    }

    await this.productRepository.update(id, {
      ...updateProductDto,
      UpdatedOn: new Date(),
    });

    return { message: `Product with ID ${id} has been updated successfully` };
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { Id: id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);

    return { message: `Product with ID ${id} has been deleted successfully` };
  }

  async getAvailableColorsByProductId(productId: number): Promise<any[]> {
    try {
      const availableColors = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('availablecoloroptions', 'colors', 'colors.ProductId = product.Id')
        .select([
          'colors.Id AS Id',
          'colors.ColorName AS ColorName',
          'colors.ImageId AS ImageId',
        ])
        .where('product.Id = :productId', { productId })
        .andWhere('colors.Id IS NOT NULL')
        .getRawMany();
  
      if (!availableColors || availableColors.length === 0) {
        return [];
      }
  
      return availableColors.map((color) => ({
        Id: color.Id,
        ColorName: color.ColorName,
        ImageId: color.ImageId,
      }));
    } catch (error) {
      console.error("Error fetching available colors:", error);
      return [];
    }
  }
  
  
}
