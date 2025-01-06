import { Injectable } from '@nestjs/common';
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

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async getAllProducts(): Promise<any[]> {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .select([
          'product.Id AS Id',
          'product.ProductCategoryId AS ProductCategoryId',
          'product.FabricTypeId AS FabricTypeId',
          'product.Name AS Name',
          'product.Description AS Description',
        ])
        .getRawMany();
  
      return products.map(product => ({
        Id: product.Id,
        ProductCategoryId: product.ProductCategoryId,
        FabricTypeId: product.FabricTypeId,
        Name: product.Name,
        Description: product.Description,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }  

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
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
