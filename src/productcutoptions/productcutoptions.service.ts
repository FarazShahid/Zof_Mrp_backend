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

  async create(createProductCutOptionDto: CreateProductCutOptionDto): Promise<ProductCutOption> {
    try {
      const requiredFields = ['OptionProductCutOptions', 'CreatedBy', 'UpdatedBy'];
      for (const field of requiredFields) {
        if (!createProductCutOptionDto[field]) {
          throw new BadRequestException(`${field} is required`);
        }
      }

      const newCutOption = this.productCutOptionRepository.create({
        ...createProductCutOptionDto,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
      });

      return await this.productCutOptionRepository.save(newCutOption);
    } catch (error) {
      console.error('Error creating Product Cut Option:', error);
      throw new BadRequestException(error.message || 'Error creating Product Cut Option');
    }
  }

  async update(updateProductCutOptionDto: UpdateProductCutOptionDto): Promise<{ message: string }> {
    const { Id } = updateProductCutOptionDto;

    if (!Id) {
      throw new BadRequestException('Id is required');
    }

    const productCutOption = await this.productCutOptionRepository.findOne({ where: { Id } });

    if (!productCutOption) {
      throw new NotFoundException(`Product Cut Option with ID ${Id} not found`);
    }

    await this.productCutOptionRepository.update(Id, {
      ...updateProductCutOptionDto,
      UpdatedOn: new Date(),
    });

    return { message: `Product Cut Option with ID ${Id} has been updated successfully` };
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
