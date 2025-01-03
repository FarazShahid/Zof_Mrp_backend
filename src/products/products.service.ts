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

  findAll() {
    return this.productRepository.find();

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
      throw new Error('No available colors found for the given product ID');
    }
  
    const response = availableColors.map((color) => ({
      Id: color.Id,
      ColorName: color.ColorName,
      ImageId: color.ImageId,
    }));
  
    return response;
  }
  
}
