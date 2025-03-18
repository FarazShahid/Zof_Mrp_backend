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
    private readonly sizeMeasurementRepository: Repository<SizeMeasurement>,
  ) {}

  async create(createSizeMeasurementDto: CreateSizeMeasurementDto, createdBy: string): Promise<SizeMeasurement> {
    try {
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
      return await this.sizeMeasurementRepository.find({
        order: {
          CreatedOn: 'DESC',
        },
      });
    } catch (error) {
      console.error('Error fetching size measurements:', error);
      throw new BadRequestException('Error fetching size measurements');
    }
  }

  async findOne(id: number): Promise<SizeMeasurement> {
    try {
      const sizeMeasurement = await this.sizeMeasurementRepository.findOne({
        where: { Id: id },
      });

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
      const sizeMeasurement = await this.findOne(id);

      const updatedSizeMeasurement = await this.sizeMeasurementRepository.save({
        ...sizeMeasurement,
        ...updateSizeMeasurementDto,
        UpdatedBy: updatedBy,
        UpdatedOn: new Date(),
      });

      return updatedSizeMeasurement;
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
      const sizeMeasurement = await this.findOne(id);
      await this.sizeMeasurementRepository.remove(sizeMeasurement);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error removing size measurement:', error);
      throw new BadRequestException('Error removing size measurement');
    }
  }
} 