import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeOption } from './entities/sizeoptions.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class SizeoptionsService {
  constructor(
    @InjectRepository(SizeOption)
    private sizeOptionRepository: Repository<SizeOption>,
    private userService: UserService,
  ) {}

  async getAllSizeOptions() {
    const sizeOptions = await this.sizeOptionRepository.find();

    for (const option of sizeOptions) {
      const createdByUser = await this.userService.getUserEmailById(Number(option.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(option.UpdatedBy));

      option.CreatedBy = createdByUser ? createdByUser : '';
      option.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return sizeOptions;
  }
}
