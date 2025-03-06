import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrintingOptions } from './entities/printingoptions.entity';
import { CreatePrintingOptionDto, UpdatePrintingOptionDto } from './dto/printing-option.dto';

@Injectable()
export class PrintingoptionsService {
  constructor(
    @InjectRepository(PrintingOptions)
    private printingOptionsRepository: Repository<PrintingOptions>
  ) {}

  async getAllPrintingOptions() {
    const printingOptions = await this.printingOptionsRepository.find();
    return printingOptions;
  }

  async create(data: CreatePrintingOptionDto): Promise<any> {
    const existingSizeOption = await this.printingOptionsRepository.findOne({ where: { Type: data.Name } });
    if (existingSizeOption) {
      throw new BadRequestException(`Printing Option Name already exists.`);
    }
    const newPrintingOption = this.printingOptionsRepository.create({
      Type: data.Name,
      CreatedBy: data.createdBy,
      CreatedOn: new Date(),
      UpdatedOn: new Date()
    });
    const savedPrintingOption = await this.printingOptionsRepository.save(newPrintingOption);
    return {
      Id: savedPrintingOption.Id,
      Name: savedPrintingOption.Type,
      CreatedOn: savedPrintingOption.CreatedOn,
      CreatedBy: savedPrintingOption.CreatedBy,
      UpdatedOn: savedPrintingOption.UpdatedOn,
      UpdatedBy: savedPrintingOption.UpdatedBy
    };
  }

  async findOne(id: number): Promise<any> {
    const printingOption = await this.printingOptionsRepository.findOne({ where: { Id: id } });
    if (!printingOption) {
      throw new NotFoundException(`Printing Option with ID ${id} not found`);
    }

    return {
      Id: printingOption.Id,
      Name: printingOption.Type,
      CreatedOn: printingOption.CreatedOn,
      CreatedBy: printingOption.CreatedBy,
      UpdatedOn: printingOption.UpdatedOn,
      UpdatedBy: printingOption.UpdatedBy
    };
  }

  async remove(id: number): Promise<void> {
    const printingOption = await this.printingOptionsRepository.findOne({ where: { Id: id } });

    if (!printingOption) {
      throw new NotFoundException(`Printing Option with ID ${id} not found`);
    }

    await this.printingOptionsRepository.delete(id);
  }

  async update(id: number, data: UpdatePrintingOptionDto): Promise<any> {
    const printingOption = await this.findOne(id);

    if (data.Name) {
      const existingPrintingOption = await this.printingOptionsRepository.findOne({
        where: { Type: data.Name },
      });

      if (existingPrintingOption && existingPrintingOption.Id !== id) {
        throw new BadRequestException(`Printing Option "${data.Name}" already exists.`);
      }
    }

    printingOption.Type = data.Name || printingOption.Type;
    printingOption.UpdatedBy = data.UpdatedBy || printingOption.UpdatedBy;
    printingOption.UpdatedOn = new Date();

    const savedPrintingOption = await this.printingOptionsRepository.save(printingOption);

    return {
      Id: savedPrintingOption.Id,
      Name: savedPrintingOption.Type,
      CreatedOn: savedPrintingOption.CreatedOn,
      CreatedBy: savedPrintingOption.CreatedBy,
      UpdatedOn: savedPrintingOption.UpdatedOn,
      UpdatedBy: savedPrintingOption.UpdatedBy
    };
  }
}
