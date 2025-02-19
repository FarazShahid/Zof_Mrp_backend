import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, DataSource } from 'typeorm';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
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
  
      const savedProduct = await this.productRepository.save(newProduct);
  
      // If either productColors or productDetails exist, run them in a transaction
      if (
        (createProductDto.productColors && createProductDto.productColors.length > 0) ||
        (createProductDto.productDetails && createProductDto.productDetails.length > 0)
      ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
  
        try {
          // Insert product colors if provided
          if (createProductDto.productColors && createProductDto.productColors.length > 0) {
            for (const color of createProductDto.productColors) {
              await queryRunner.query(
                `INSERT INTO availablecoloroptions (colorId, ProductId, ImageId, CreatedOn, CreatedBy, UpdatedOn, UpdatedBy) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  color.colorId,
                  savedProduct.Id,
                  color.ImageId,
                  new Date(),
                  createProductDto.CreatedBy,
                  new Date(),
                  createProductDto.UpdatedBy,
                ]
              );
            }
          }
  
          // Insert product details if provided
          if (createProductDto.productDetails && createProductDto.productDetails.length > 0) {
            for (const detail of createProductDto.productDetails) {
              await queryRunner.query(
                `INSERT INTO productdetails 
                (ProductId, ProductCutOptionId, ProductSizeMeasurementId, CreatedOn, CreatedBy, UpdatedOn, UpdatedBy, ProductRegionId, SleeveTypeId) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  savedProduct.Id,
                  detail.ProductCutOptionId,
                  detail.ProductSizeMeasurementId,
                  new Date(),
                  createProductDto.CreatedBy,
                  new Date(),
                  createProductDto.UpdatedBy,
                  detail.ProductRegionId,
                  detail.SleeveTypeId,
                ]
              );
            }
          }
  
          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new Error('Failed to insert color options and/or product details');
        } finally {
          await queryRunner.release();
        }
      }
  
      return savedProduct;
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

  async findOne(id: number): Promise<any> {
    const product = await this.productRepository.findOne({ where: { Id: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    const productColors = await this.dataSource.query(
      `SELECT * FROM availablecoloroptions WHERE ProductId = ?`,
      [id]
    );
  
    const productDetails = await this.dataSource.query(
      `SELECT * FROM productdetails WHERE ProductId = ?`,
      [id]
    );
  
    return {
      ...product,
      productColors,
      productDetails,
    };
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
  
    const { productColors, productDetails, ...productData } = updateProductDto;
  
    await this.productRepository.update(id, {
      ...productData,
      UpdatedOn: new Date(),
    });
  
    if (
      (productColors && Array.isArray(productColors)) ||
      (productDetails && Array.isArray(productDetails))
    ) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
        if (productColors && Array.isArray(productColors)) {
          const existingColors: { Id: number }[] = await queryRunner.query(
            `SELECT Id FROM availablecoloroptions WHERE ProductId = ?`,
            [id]
          );
          const updatedColorIds = productColors.filter((c) => c.Id).map((c) => c.Id);
          const colorsToRemove = existingColors.filter((c) => !updatedColorIds.includes(c.Id));
          if (colorsToRemove.length > 0) {
            const idsToRemove = colorsToRemove.map((c) => c.Id).join(',');
            await queryRunner.query(`DELETE FROM availablecoloroptions WHERE Id IN (${idsToRemove})`);
          }
          for (const color of productColors) {
            if (color.Id) {
              await queryRunner.query(
                `UPDATE availablecoloroptions 
                 SET colorId = ?, ImageId = ?, UpdatedOn = ?, UpdatedBy = ? 
                 WHERE Id = ?`,
                [
                  color.colorId,
                  color.ImageId,
                  new Date(),
                  updateProductDto.UpdatedBy,
                  color.Id,
                ]
              );
            } else {
              await queryRunner.query(
                `INSERT INTO availablecoloroptions 
                  (ProductId, colorId, ImageId, CreatedOn, CreatedBy, UpdatedOn, UpdatedBy) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  id,
                  color.colorId,
                  color.ImageId,
                  new Date(),
                  updateProductDto.UpdatedBy,
                  new Date(),
                  updateProductDto.UpdatedBy,
                ]
              );
            }
          }
        }
  
        // ----------- Process productDetails -----------
        if (productDetails && Array.isArray(productDetails)) {
          const existingDetails: { Id: number }[] = await queryRunner.query(
            `SELECT Id FROM productdetails WHERE ProductId = ?`,
            [id]
          );
          const updatedDetailIds = productDetails.filter((d) => d.Id).map((d) => d.Id);
          const detailsToRemove = existingDetails.filter((d) => !updatedDetailIds.includes(d.Id));
          if (detailsToRemove.length > 0) {
            const idsToRemove = detailsToRemove.map((d) => d.Id).join(',');
            await queryRunner.query(`DELETE FROM productdetails WHERE Id IN (${idsToRemove})`);
          }
          for (const detail of productDetails) {
            if (detail.Id) {
              await queryRunner.query(
                `UPDATE productdetails 
                 SET ProductCutOptionId = ?, ProductSizeMeasurementId = ?, UpdatedOn = ?, UpdatedBy = ?, ProductRegionId = ?, SleeveTypeId = ? 
                 WHERE Id = ?`,
                [
                  detail.ProductCutOptionId,
                  detail.ProductSizeMeasurementId,
                  new Date(),
                  updateProductDto.UpdatedBy,
                  detail.ProductRegionId,
                  detail.SleeveTypeId,
                  detail.Id,
                ]
              );
            } else {
              await queryRunner.query(
                `INSERT INTO productdetails 
                  (ProductId, ProductCutOptionId, ProductSizeMeasurementId, CreatedOn, CreatedBy, UpdatedOn, UpdatedBy, ProductRegionId, SleeveTypeId) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  id,
                  detail.ProductCutOptionId,
                  detail.ProductSizeMeasurementId,
                  new Date(),
                  updateProductDto.UpdatedBy,
                  new Date(),
                  updateProductDto.UpdatedBy,
                  detail.ProductRegionId,
                  detail.SleeveTypeId,
                ]
              );
            }
          }
        }
  
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error('Failed to update product colors and details');
      } finally {
        await queryRunner.release();
      }
    }
  
    return { message: `Product with ID ${id} has been updated successfully` };
  }

  async remove(id: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const product = await this.productRepository.findOne({ where: { Id: id } });
  
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
  
      await queryRunner.query(`DELETE FROM availablecoloroptions WHERE ProductId = ?`, [id]);
  
      await queryRunner.query(`DELETE FROM product WHERE Id = ?`, [id]);

      await queryRunner.query(`DELETE FROM productdetails WHERE ProductId = ?`, [id]);
  
      await queryRunner.commitTransaction();
      
      return { message: `Product with ID ${id} have been deleted successfully` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message || `Error deleting product with ID ${id}`);
    } finally {
      await queryRunner.release();
    }
  }
  
  async getAvailableColorsByProductId(productId: number): Promise<any[]> {
    try {
      const availableColors = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('availablecoloroptions', 'colors', 'colors.ProductId = product.Id')
        .leftJoin('coloroption', 'color', 'color.Id = colors.colorId') 
        .select([
          'colors.Id AS Id',
          'color.Name AS ColorName', 
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
