import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FabricType } from './_/fabrictype.entity';

@Injectable()
export class FabricTypeService {
  private readonly logger = new Logger(FabricTypeService.name);

  constructor(
    @InjectRepository(FabricType)
    private readonly fabricTypeRepository: Repository<FabricType>,
  ) {}

  async create(data: { type: string; name: string; gsm: number; createdBy: string }) {
    this.logger.log(`Creating new fabric type: ${JSON.stringify(data)}`);
    const fabric = this.fabricTypeRepository.create({
      ...data,
      createdOn: new Date(),
    });
    return this.fabricTypeRepository.save(fabric);
  }

  async findAll() {
    this.logger.log('Finding all fabric types');
    return this.fabricTypeRepository.find();
  }

  async findOne(id: number) {
    this.logger.log(`Finding fabric type with id: ${id}`);
    const fabricType = await this.fabricTypeRepository.findOne({ where: { id } });
    if (!fabricType) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }
    return fabricType;
  }

  async update(id: number, data: any) {
    this.logger.log(`Updating fabric type with id: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      // First check if the fabric type exists
      const fabricType = await this.fabricTypeRepository.findOne({ where: { id } });
      if (!fabricType) {
        throw new NotFoundException(`Fabric type with ID ${id} not found`);
      }

      // Extract only the fields we want to update
      const { type, name, gsm, updatedBy } = data;
      
      // Create update data object
      const updateData: any = {};
      
      // Only include fields that are provided
      if (type !== undefined) updateData.type = type;
      if (name !== undefined) updateData.name = name;
      if (gsm !== undefined) updateData.gsm = gsm;
      
      // Always set updatedBy and updatedOn
      updateData.updatedBy = updatedBy;
      updateData.updatedOn = new Date();

      this.logger.log(`Updating with data: ${JSON.stringify(updateData)}`);

      // Update the fabric type
      await this.fabricTypeRepository.update(id, updateData);
      
      // Return the updated fabric type
      return this.fabricTypeRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error updating fabric type: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update fabric type: ${error.message}`);
    }
  }

  async delete(id: number) {
    this.logger.log(`Deleting fabric type with id: ${id}`);
    const result = await this.fabricTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fabric type with ID ${id} not found`);
    }
    return { message: 'Deleted successfully' };
  }
}
