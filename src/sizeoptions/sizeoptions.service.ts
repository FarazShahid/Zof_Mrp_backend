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
    const sizeOptions = await this.sizeOptionRepository
      .createQueryBuilder('sizeoptions')
      .leftJoin('ProductRegionStandard', 'region', 'region.Id = sizeoptions.ProductRegionId')
      .select([
        'sizeoptions.Id AS Id',
        'sizeoptions.OptionSizeOptions AS OptionSizeOptions',
        'sizeoptions.ProductRegionId AS ProductRegionId',
        'region.Name AS ProductRegionName',
        'sizeoptions.CreatedOn AS CreatedOn',
        'sizeoptions.CreatedBy AS CreatedBy',
        'sizeoptions.UpdatedOn AS UpdatedOn',
        'sizeoptions.UpdatedBy AS UpdatedBy'
      ])
      .getRawMany();
    return sizeOptions;
  }

  async create(data: CreateSizeOptionDto, createdBy: string): Promise<any> {

    const existingSizeOption = await this.sizeOptionRepository.findOne({ where: { OptionSizeOptions: data.OptionSizeOptions } });
    if (existingSizeOption) {
      throw new BadRequestException(`Size Option Type already exists.`);
    }

    const newSleeve = this.sizeOptionRepository.create({
      OptionSizeOptions: data.OptionSizeOptions,
      ProductRegionId: data.ProductRegionId,
      CreatedBy: createdBy,
      UpdatedBy: createdBy
    });
    const savedSizeOption = await this.sizeOptionRepository.save(newSleeve);
    return savedSizeOption;
  }

  async update(id: number, data: UpdateSizeOptionDto, updatedBy: string) {
    await this.sizeOptionRepository.update(id, {
      ...data,
      UpdatedOn: new Date(),
      UpdatedBy: updatedBy
    });

    // Fetch the updated row with ProductRegionName
    const updated = await this.sizeOptionRepository
      .createQueryBuilder('sizeoptions')
      .leftJoin('ProductRegionStandard', 'region', 'region.Id = sizeoptions.ProductRegionId')
      .select([
        'sizeoptions.Id AS Id',
        'sizeoptions.OptionSizeOptions AS OptionSizeOptions',
        'sizeoptions.ProductRegionId AS ProductRegionId',
        'region.Name AS ProductRegionName',
        'sizeoptions.CreatedOn AS CreatedOn',
        'sizeoptions.CreatedBy AS CreatedBy',
        'sizeoptions.UpdatedOn AS UpdatedOn',
        'sizeoptions.UpdatedBy AS UpdatedBy'
      ])
      .where('sizeoptions.Id = :id', { id })
      .getRawOne();
    return updated;
  }

  async findOne(id: number) {
    const sizeOption = await this.sizeOptionRepository
      .createQueryBuilder('sizeoptions')
      .leftJoin('ProductRegionStandard', 'region', 'region.Id = sizeoptions.ProductRegionId')
      .select([
        'sizeoptions.Id AS Id',
        'sizeoptions.OptionSizeOptions AS OptionSizeOptions',
        'sizeoptions.ProductRegionId AS ProductRegionId',
        'region.Name AS ProductRegionName',
        'sizeoptions.CreatedOn AS CreatedOn',
        'sizeoptions.CreatedBy AS CreatedBy',
        'sizeoptions.UpdatedOn AS UpdatedOn',
        'sizeoptions.UpdatedBy AS UpdatedBy'
      ])
      .where('sizeoptions.Id = :id', { id })
      .getRawOne();

    return sizeOption;
  }

  async remove(id: number): Promise<void> {
    const sizeOption = await this.sizeOptionRepository.findOne({ where: { Id: id } });

    if (!sizeOption) {
      throw new NotFoundException(`Size Option with ID ${id} not found`);
    }
    await this.sizeOptionRepository.delete(id);
  }

}
