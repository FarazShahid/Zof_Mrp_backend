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
        .leftJoin('productcategory', 'productcategory', 'product.ProductCategoryId = productcategory.Id')
        .leftJoin('fabrictype', 'fabrictype', 'product.FabricTypeId = fabrictype.Id')
        .select([
          'product.Id AS Id',
          'product.ProductCategoryId AS ProductCategoryId',
          'product.FabricTypeId AS FabricTypeId',
          'product.Name AS Name',
          'product.Description AS Description',
          'productcategory.Type AS ProductCategoryName',
          'fabrictype.Type AS FabricTypeName',
          'fabrictype.GSM AS FabricGSM',
          'fabrictype.Name AS FabricName',
        ])
        .getRawMany();
      return products.map((product) => ({
        Id: product.Id,
        Name: product.Name,
        ProductCategoryId: product.ProductCategoryId,
        ProductCategoryName: product.ProductCategoryName || "",
        FabricTypeId: product.FabricTypeId,
        FabricTypeName: product.FabricTypeName || "",
        FabricName: product.FabricName || "",
        FabricGSM: product.FabricGSM || "",
        Description: product.Description
      }));
    } catch {
      return []
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

  async getAvailableColorsByProductId(productId: number): Promise<any> {
    const availableColors = await this.productRepository.createQueryBuilder('product')
      .leftJoin('availablecoloroptions', 'colors', 'colors.ProductId = product.Id')
      .select([
        'colors.Id AS Id',
        'colors.ColorName AS ColorName',
        'colors.ImageId AS ImageId',
      ])
      .where('product.Id = :productId', { productId })
      .getRawMany();
  
    if (!availableColors || availableColors.length === 0) {
      return []
    }
  
    const response = availableColors.map((color) => ({
      Id: color.Id,
      ColorName: color.ColorName,
      ImageId: color.ImageId,
    }));
  
    return response;
  }
  
}
