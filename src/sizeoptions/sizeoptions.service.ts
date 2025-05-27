import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeOption } from './entities/sizeoptions.entity';
import { CreateSizeOptionDto } from './dto/create-sizeoptions.dto';
import { UpdateSizeOptionDto } from './dto/update-sizeoptions.dto';

@Injectable()
export class SizeoptionsService {
  constructor(
    @InjectRepository(SizeOption)
    private sizeOptionRepository: Repository<SizeOption>,
  ) { }

  async getAllSizeOptions() {
    const sizeOptions = await this.sizeOptionRepository.find();
    return sizeOptions;
  }

  async create(data: CreateSizeOptionDto, createdBy: string): Promise<any> {

    const existingSizeOption = await this.sizeOptionRepository.findOne({ where: { OptionSizeOptions: data.OptionSizeOptions } });
    if (existingSizeOption) {
      throw new BadRequestException(`Size Option Type already exists.`);
    }

    const newSleeve = this.sizeOptionRepository.create({
      OptionSizeOptions: data.OptionSizeOptions,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    const savedSizeOption = await this.sizeOptionRepository.save(newSleeve);
    return savedSizeOption;
  }

  async update(id: number, data: UpdateSizeOptionDto, updatedBy: string) {
    await this.sizeOptionRepository.update(id, { ...data, UpdatedOn: new Date(), UpdatedBy: updatedBy });
    return this.sizeOptionRepository.findOne({ where: { Id: id } });
  }

  async findOne(id: number) {
    return this.sizeOptionRepository.findOne({ where: { Id: id } });
  }

  async remove(id: number): Promise<void> {
    const sizeOption = await this.sizeOptionRepository.findOne({ where: { Id: id } });

    if (!sizeOption) {
      throw new NotFoundException(`Size Option with ID ${id} not found`);
    }

    await this.sizeOptionRepository.delete(id);
  }

}
