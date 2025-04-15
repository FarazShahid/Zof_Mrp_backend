import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColorOption } from './_/color-option.entity';
import { CreateColorOptionDto } from './_/create-color-option.dto';
import { UpdateColorOptionDto } from './_/update-color-option.dto';

@Injectable()
export class ColorOptionService {
  constructor(
    @InjectRepository(ColorOption)
    private readonly colorOptionRepository: Repository<ColorOption>,
  ) {}

  async create(createColorOptionDto: CreateColorOptionDto, createdBy: string): Promise<ColorOption> {
    const newColor = this.colorOptionRepository.create({
      ...createColorOptionDto,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
    });
    return this.colorOptionRepository.save({
        Id: newColor.Id,
        Name: newColor.Name,
        HexCode: newColor.HexCode,
        CreatedOn: newColor.CreatedOn,
        CreatedBy: newColor.CreatedBy,
        UpdatedOn: newColor.UpdatedOn,
        UpdatedBy: newColor.UpdatedBy,
    });
  }

  async findAll(): Promise<ColorOption[]> {
    return this.colorOptionRepository.find();
  }

  async findOne(id: number): Promise<ColorOption> {
    const color = await this.colorOptionRepository.findOne({ where: { Id: id } });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async update(id: number, updateColorOptionDto: UpdateColorOptionDto, updatedBy: string): Promise<ColorOption> {
    await this.colorOptionRepository.update(id, {...updateColorOptionDto, UpdatedBy: updatedBy, UpdatedOn: new Date()});
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.colorOptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
  }
}
