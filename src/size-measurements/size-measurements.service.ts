import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeMeasurement } from './entities/size-measurement.entity';
import { CreateSizeMeasurementDto } from './dto/create-size-measurement.dto';
import { UpdateSizeMeasurementDto } from './dto/update-size-measurement.dto';

@Injectable()
export class SizeMeasurementsService {
  constructor(
    @InjectRepository(SizeMeasurement)
    private sizeMeasurementRepository: Repository<SizeMeasurement>,
  ) {}

  async create(createSizeMeasurementDto: CreateSizeMeasurementDto, createdBy: string): Promise<SizeMeasurement> {
    try {
      // Get size option name from sizeoptions table
      const sizeOption = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select('so.OptionSizeOptions as SizeOptionName')
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.OptionSizeOptions')
        .where('so.OptionSizeOptions = :sizeOptionId', { sizeOptionId: createSizeMeasurementDto.SizeOptionId })
        .getRawOne();

      const newSizeMeasurement = this.sizeMeasurementRepository.create({
        ...createSizeMeasurementDto,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });

      return await this.sizeMeasurementRepository.save(newSizeMeasurement);
    } catch (error) {
      console.error('Error creating size measurement:', error);
      throw new BadRequestException('Error creating size measurement');
    }
  }

  async findAll(): Promise<SizeMeasurement[]> {
    try {
      return await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select('sm.*, so.OptionSizeOptions as SizeOptionName')
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .orderBy('sm.CreatedOn', 'DESC')
        .getRawMany();
    } catch (error) {
      console.error('Error fetching size measurements:', error);
      throw new BadRequestException('Error fetching size measurements');
    }
  }

  async findOne(id: number): Promise<SizeMeasurement> {
    try {
      const sizeMeasurement = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select('sm.*, so.OptionSizeOptions as SizeOptionName')
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .where('sm.Id = :id', { id })
        .getRawOne();

      if (!sizeMeasurement) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      return sizeMeasurement;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching size measurement:', error);
      throw new BadRequestException('Error fetching size measurement');
    }
  }

  async update(id: number, updateSizeMeasurementDto: UpdateSizeMeasurementDto, updatedBy: string): Promise<SizeMeasurement> {
    try {
      let sizeOptionName = null;
      if (updateSizeMeasurementDto.SizeOptionId) {
        const sizeOption = await this.sizeMeasurementRepository
          .createQueryBuilder('sm')
          .select('so.OptionSizeOptions as SizeOptionName')
          .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
          .where('so.Id = :sizeOptionId', { sizeOptionId: updateSizeMeasurementDto.SizeOptionId })
          .getRawOne();
        sizeOptionName = sizeOption?.SizeOptionName || null;
      }

      const sizeMeasurement = await this.findOne(id);
      const updatedSizeMeasurement = this.sizeMeasurementRepository.merge(sizeMeasurement, {
        ...updateSizeMeasurementDto,
        UpdatedBy: updatedBy,
      });

      return await this.sizeMeasurementRepository.save(updatedSizeMeasurement);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating size measurement:', error);
      throw new BadRequestException('Error updating size measurement');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.sizeMeasurementRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting size measurement:', error);
      throw new BadRequestException('Error deleting size measurement');
    }
  }
} 