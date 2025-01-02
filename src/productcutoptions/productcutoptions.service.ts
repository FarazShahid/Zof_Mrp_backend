import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCutOption } from './entity/productcutoptions.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class ProductcutoptionsService {
  constructor(
    @InjectRepository(ProductCutOption)
    private productCutOptionRepository: Repository<ProductCutOption>,
    private userService: UserService,
  ) {}

  async getAllSizeOptions() {
    const cutOptions = await this.productCutOptionRepository.find();

    for (const option of cutOptions) {
      const createdByUser = await this.userService.getUserEmailById(Number(option.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(option.UpdatedBy));

      option.CreatedBy = createdByUser ? createdByUser : '';
      option.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return cutOptions;
  }
}
