import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCutOption } from './entity/productcutoptions.entity';
import { CreateProductCutOptionDto } from './dto/create-product-cut-option.dto';
import { UpdateProductCutOptionDto } from './dto/update-product-cut-option.dto';
@Injectable()
export class ProductcutoptionsService {
  constructor(
    @InjectRepository(ProductCutOption)
    private productCutOptionRepository: Repository<ProductCutOption>,
  ) {}

  async getAllSizeOptions() {
    const cutOptions = await this.productCutOptionRepository.find();
    return cutOptions;
  }

  async create(createProductCutOptionDto: CreateProductCutOptionDto, createdBy: string): Promise<ProductCutOption> {
      const newCutOption = this.productCutOptionRepository.create({
        ...createProductCutOptionDto,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });
      return await this.productCutOptionRepository.save(newCutOption);
  }

  async update(updateProductCutOptionDto: UpdateProductCutOptionDto, updatedBy: string): Promise<any> {
    const { Id } = updateProductCutOptionDto;

    if (!Id) {
      throw new BadRequestException('Id is required');
    }

    const productCutOption = await this.productCutOptionRepository.findOne({ where: { Id } });

    if (!productCutOption) {
      throw new NotFoundException(`Product Cut Option with ID ${Id} not found`);
    }

    const updatedCutOption = await this.productCutOptionRepository.save({
      ...updateProductCutOptionDto,
      Id: Id,
      UpdatedOn: new Date(),
      UpdatedBy: updatedBy
    });

    return updatedCutOption;
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.productCutOptionRepository.findOne({ where: { Id: id } });

    if (!product) {
      throw new NotFoundException(`Cut Option with ID ${id} not found`);
    }

    await this.productCutOptionRepository.delete(id);

    return { message: `Cut Option with ID ${id} has been deleted successfully` };
  }

  async findOne(id: number): Promise<any> {
    const cutOption = await this.productCutOptionRepository.findOne({
      where: { Id: id }
    });
  
    if (!cutOption) {
      throw new NotFoundException(`cutOption not found.`);
    }
  
    return cutOption;
  }
}
