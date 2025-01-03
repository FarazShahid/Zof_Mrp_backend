import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrintingOptions } from './entities/printingoptions.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class PrintingoptionsService {
  constructor(
    @InjectRepository(PrintingOptions)
    private printingOptionsRepository: Repository<PrintingOptions>,
    private userService: UserService,
  ) {}

  async getAllPrintingOptions() {
    const printingOptions = await this.printingOptionsRepository.find();

    for (const option of printingOptions) {
      const createdByUser = await this.userService.getUserEmailById(Number(option.CreatedBy));
      const updatedByUser = await this.userService.getUserEmailById(Number(option.UpdatedBy));

      option.CreatedBy = createdByUser ? createdByUser : '';
      option.UpdatedBy = updatedByUser ? updatedByUser : '';
    }

    return printingOptions;
  }
}
