import { Injectable, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SizeMeasurement } from './entities/size-measurement.entity';
import { CreateSizeMeasurementDto } from './dto/create-size-measurement.dto';
import { UpdateSizeMeasurementDto } from './dto/update-size-measurement.dto';
import { ProductCutOption } from 'src/productcutoptions/entity/productcutoptions.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Injectable()
export class SizeMeasurementsService {
  constructor(
    @InjectRepository(SizeMeasurement)
    private sizeMeasurementRepository: Repository<SizeMeasurement>,
    @InjectRepository(ProductCutOption)
    private productCutOptionRepository: Repository<ProductCutOption>,

    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) { }

  async create(createSizeMeasurementDto: CreateSizeMeasurementDto, createdBy: string): Promise<SizeMeasurement> {
    try {
      // Get size option name from sizeoptions table
      const sizeOption = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select('so.OptionSizeOptions as SizeOptionName')
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.OptionSizeOptions')
        .where('so.OptionSizeOptions = :sizeOptionId', { sizeOptionId: createSizeMeasurementDto.SizeOptionId })
        .getRawOne();

      const productCategoryId = await this.productCategoryRepository.findOne({ where: { id: createSizeMeasurementDto.ProductCategoryId } })
      if (!productCategoryId) {
        throw new BadRequestException(`Product category with id ${createSizeMeasurementDto.ProductCategoryId} does not exist`)
      }

      if (createSizeMeasurementDto.CutOptionId) {
        const CutOption = await this.productCutOptionRepository.findOne({
          where: {
            Id: createSizeMeasurementDto.CutOptionId
          },
          withDeleted: false
        });

        if (!CutOption) {
          throw new NotFoundException(`Unit Of Measures with id ${createSizeMeasurementDto.CutOptionId} not found`);
        }
      }

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

  async findAll(cutOptionId?: number, clientId?: number, sizeOptionId?: number, productCategoryId?: number): Promise<SizeMeasurement[]> {
    try {
      const queryBuilder = this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select([
          'sm.*',
          'so.OptionSizeOptions AS SizeOptionName',
          'cl.Name AS ClientName',
          'pc.Id AS ProductCategoryId',
          'pc.type AS ProductCategoryType'
        ])
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .leftJoin('productcategory', 'pc', 'sm.ProductCategoryId = pc.Id')
        .leftJoin('client', 'cl', 'sm.ClientId = cl.Id')
        .orderBy('sm.CreatedOn', 'DESC');

      if (cutOptionId) {
        queryBuilder.andWhere('sm.CutOptionId = :cutOptionId', { cutOptionId });
      }

      if (clientId) {
        queryBuilder.andWhere('sm.ClientId = :clientId', { clientId });
      }

      if (sizeOptionId) {
        queryBuilder.andWhere('sm.SizeOptionId = :sizeOptionId', { sizeOptionId });
      }

      if (productCategoryId) {
        queryBuilder.andWhere('sm.ProductCategoryId = :productCategoryId', { productCategoryId });
      }

      const items = await queryBuilder.getRawMany();

      const cutOptionIds = items
        .filter(e => e.CutOptionId != null)
        .map(e => e.CutOptionId);

      let cutOptions = [];
      if (cutOptionIds.length > 0) {
        cutOptions = await this.productCutOptionRepository.find({
          where: { Id: In(cutOptionIds) },
          withDeleted: true
        });
      }

      const cutOptionsMap = new Map(cutOptions.map(co => [co.Id, co]));

      return items.map(e => ({
        ...e,
        cutOptionName: cutOptionsMap.get(e.CutOptionId)?.OptionProductCutOptions || null
      }));

    } catch (error) {
      console.error('Actual error fetching size measurements:', error);
      throw new BadRequestException('Error fetching size measurements');
    }
  }

  async findOne(id: number): Promise<SizeMeasurement> {
    try {
      // Step 1: Fetch size measurement with client and size option names
      const sizeMeasurement = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select([
          'sm.*',
          'so.OptionSizeOptions AS SizeOptionName',
          'cl.Name AS ClientName',
          'pc.Id AS ProductCategoryId',
          'pc.type AS ProductCategoryType'
        ])
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .leftJoin('client', 'cl', 'sm.ClientId = cl.Id')
        .leftJoin('productcategory', 'pc', 'sm.ProductCategoryId = pc.Id')
        .where('sm.Id = :id', { id })
        .getRawOne();

      if (!sizeMeasurement) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Step 2: Fetch related CutOption if CutOptionId exists
      let cutOptionName = null;
      if (sizeMeasurement.CutOptionId != null) {
        const cutOption = await this.productCutOptionRepository.findOne({
          where: { Id: sizeMeasurement.CutOptionId },
          withDeleted: true
        });

        cutOptionName = cutOption?.OptionProductCutOptions || null;
      }

      // Step 3: Return the result, adding cutOptionName
      return {
        ...sizeMeasurement,
        cutOptionName
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching size measurement:', error);
      throw new BadRequestException('Error fetching size measurement');
    }
  }

  async update(id: number, updateSizeMeasurementDto: UpdateSizeMeasurementDto, updatedBy: string): Promise<any> {
    try {
      let sizeOptionName = null;
      let cutOptionName = null;
      if (updateSizeMeasurementDto.ProductCategoryId) {
        const productcategory = await this.productCategoryRepository.findOne({ where: { id: updateSizeMeasurementDto.ProductCategoryId } })
        if (!productcategory) {
          throw new BadRequestException(`Product category with id ${updateSizeMeasurementDto.ProductCategoryId} does not exist`)
        }
      }

      if (updateSizeMeasurementDto.SizeOptionId) {
        const sizeOption = await this.sizeMeasurementRepository
          .createQueryBuilder('sm')
          .select('so.OptionSizeOptions as SizeOptionName')
          .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
          .where('so.Id = :sizeOptionId', { sizeOptionId: updateSizeMeasurementDto.SizeOptionId })
          .getRawOne();
        sizeOptionName = sizeOption?.SizeOptionName || null;
      }

      if (updateSizeMeasurementDto.CutOptionId) {
        const CutOption = await this.productCutOptionRepository.findOne({
          where: {
            Id: updateSizeMeasurementDto.CutOptionId
          }, withDeleted: false
        })

        if (!CutOption) {
          throw new NotFoundException(`Unit Of Measures with id ${updateSizeMeasurementDto.CutOptionId} not found`);
        }
        cutOptionName = CutOption?.OptionProductCutOptions || null;
      }

      const sizeMeasurement = await this.findOne(id);

      const updatedSizeMeasurement = this.sizeMeasurementRepository.merge(sizeMeasurement, {
        ...updateSizeMeasurementDto,
        UpdatedBy: updatedBy
      });

      const savedResponse = await this.sizeMeasurementRepository.save(updatedSizeMeasurement);

      return {
        ...savedResponse,
        cutOptionName: cutOptionName
      };
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

  async findAllByClientId(clientId: number): Promise<SizeMeasurement[]> {
    try {
      const items = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select([
          'sm.*',
          'so.OptionSizeOptions AS SizeOptionName',
          'cl.Name AS ClientName',
          'pc.Id AS ProductCategoryId',
          'pc.type AS ProductCategoryType'
        ])
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .leftJoin('client', 'cl', 'sm.ClientId = cl.Id')
        .leftJoin('productcategory', 'pc', 'sm.ProductCategoryId = pc.Id')
        .where('sm.ClientId = :clientId', { clientId })
        .orderBy('sm.CreatedOn', 'DESC')
        .getRawMany();

      const cutOptionIds = items
        .filter(e => e.CutOptionId != null)
        .map(e => e.CutOptionId);

      let cutOptions = [];
      if (cutOptionIds.length > 0) {
        cutOptions = await this.productCutOptionRepository.find({
          where: { Id: In(cutOptionIds) },
          withDeleted: true
        });
      }

      const cutOptionsMap = new Map(cutOptions.map(co => [co.Id, co]));

      return items.map(e => ({
        ...e,
        cutOptionName: cutOptionsMap.get(e.CutOptionId)?.OptionProductCutOptions || null
      }));

    } catch (error) {
      console.error('Error fetching size measurements:', error);
      throw new BadRequestException('Error fetching size measurements');
    }
  }

} 