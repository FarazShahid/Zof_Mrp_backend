import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SizeMeasurement } from './entities/size-measurement.entity';
import { CreateSizeMeasurementDto, HatFusion } from './dto/create-size-measurement.dto';
import { UpdateSizeMeasurementDto } from './dto/update-size-measurement.dto';
import { ProductCutOption } from 'src/productcutoptions/entity/productcutoptions.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SizeMeasurementsService {
  constructor(
    @InjectRepository(SizeMeasurement)
    private sizeMeasurementRepository: Repository<SizeMeasurement>,
    @InjectRepository(ProductCutOption)
    private productCutOptionRepository: Repository<ProductCutOption>,

    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) { }

  private async getClientsForUser(userId: number): Promise<number[]> {

    const user = await this.userRepository.findOne({
      where: { Id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const assignedClientIds: number[] = user.assignedClients || [];

    if (!assignedClientIds.length) {
      return [];
    }
    
    // Filter out any invalid values (NaN, null, undefined) and ensure all are valid numbers
    const validClientIds = assignedClientIds.filter(id => {
      return id !== null && id !== undefined && !isNaN(Number(id)) && Number.isFinite(Number(id));
    }).map(id => Number(id));

    return validClientIds;
  }

  async create(createSizeMeasurementDto: CreateSizeMeasurementDto, createdBy: string, userId: number): Promise<SizeMeasurement> {
    try {
      // Get size option name from sizeoptions table

      const assignedClientIds = await this.getClientsForUser(userId);
      if(assignedClientIds.length> 0 && createSizeMeasurementDto.ClientId && !assignedClientIds.includes(createSizeMeasurementDto.ClientId)){
        throw new BadRequestException(`Client is not assigned to you`)

      }
      const productCategoryId = await this.productCategoryRepository.findOne({ where: { Id: createSizeMeasurementDto.ProductCategoryId } })
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

      // Check for duplicate: ClientId, ProductCategoryId, and SizeOptionId combination
      const existingMeasurement = await this.sizeMeasurementRepository.findOne({
        where: {
          ClientId: createSizeMeasurementDto.ClientId,
          ProductCategoryId: createSizeMeasurementDto.ProductCategoryId,
          SizeOptionId: createSizeMeasurementDto.SizeOptionId,
          IsActive: true,
        },
      });

      if (existingMeasurement) {
        throw new BadRequestException(
          'A size measurement with this Client, Product Category, and Size Option combination already exists. Please use a different combination or update the existing measurement.'
        );
      }

      const sanitizedMeasurementName = this.getBaseMeasurementName(createSizeMeasurementDto.Measurement1);

      const newSizeMeasurement = this.sizeMeasurementRepository.create({
        ...createSizeMeasurementDto,
        Measurement1: sanitizedMeasurementName || createSizeMeasurementDto.Measurement1 || null,
        OriginalSizeMeasurementId: null, // New records are originals
        Version: 1, // First version
        IsLatest: true, // New records are latest by default
        IsActive: true, // New records are active
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });

      const saved = await this.sizeMeasurementRepository.save(newSizeMeasurement);

      // Mark other measurements with the same SizeOptionId, ClientId, and ProductCategoryId as not latest
      // This ensures only one latest version per unique (SizeOptionId + ClientId + ProductCategoryId) combination
      const updateQuery = this.sizeMeasurementRepository
        .createQueryBuilder()
        .update(SizeMeasurement)
        .set({ IsLatest: false })
        .where('SizeOptionId = :sizeOptionId', { sizeOptionId: saved.SizeOptionId })
        .andWhere('ProductCategoryId = :productCategoryId', { productCategoryId: saved.ProductCategoryId })
        .andWhere('Id != :id', { id: saved.Id })
        .andWhere('IsActive = :isActive', { isActive: true });

      // Handle ClientId - could be null
      if (saved.ClientId !== null && saved.ClientId !== undefined) {
        updateQuery.andWhere('ClientId = :clientId', { clientId: saved.ClientId });
      } else {
        updateQuery.andWhere('ClientId IS NULL');
      }

      await updateQuery.execute();

      // Re-mark the saved one as latest (in case the update affected it)
      await this.sizeMeasurementRepository.update(saved.Id, { IsLatest: true });

      return saved;
    } catch (error) {
      // Re-throw BadRequestException and NotFoundException as-is to preserve the original error message
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error creating size measurement:', error);
      throw new BadRequestException('Error creating size measurement');
    }
  }

  async findAll(cutOptionId?: number, clientId?: number, sizeOptionId?: number, productCategoryId?: number, userId?: number, latestOnly: boolean = false): Promise<SizeMeasurement[]> {
    try {
      const queryBuilder = this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select([
          'sm.*',
          'so.OptionSizeOptions AS SizeOptionName',
          'cl.Name AS ClientName',
          'pc.Id AS ProductCategoryId',
          'pc.Type AS ProductCategoryType'
        ])
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .leftJoin('productcategory', 'pc', 'sm.ProductCategoryId = pc.Id')
        .leftJoin('client', 'cl', 'sm.ClientId = cl.Id')
        .where('sm.IsActive = :isActive', { isActive: true })
        .orderBy('sm.CreatedOn', 'DESC');

      if (latestOnly) {
        queryBuilder.andWhere('sm.IsLatest = :isLatest', { isLatest: true });
      }

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

      const originalIds = items
        .filter(item => !item.OriginalSizeMeasurementId)
        .map(item => item.Id);

      let originalVersionLookup = new Map<number, boolean>();
      if (originalIds.length > 0) {
        const originalsWithVersions = await this.sizeMeasurementRepository
          .createQueryBuilder('sm')
          .select('sm.OriginalSizeMeasurementId', 'originalId')
          .addSelect('COUNT(*)', 'versionCount')
          .where('sm.OriginalSizeMeasurementId IN (:...originalIds)', { originalIds })
          .andWhere('sm.IsActive = :isActive', { isActive: true })
          .groupBy('sm.OriginalSizeMeasurementId')
          .getRawMany();

        originalVersionLookup = new Map(
          originalsWithVersions.map(record => [
            Number(record.originalId),
            Number(record.versionCount) > 0,
          ]),
        );
      }

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

      const userAssignedClientIds = await this.getClientsForUser(userId);
      const filteredItems = userAssignedClientIds.length > 0 ? items.filter(item => userAssignedClientIds.includes(item.ClientId)) : items;

      return filteredItems.map(e => ({
        ...e,
        H_FusionInside: e?.H_FusionInside ? HatFusion.YES : HatFusion.NO ?? HatFusion.NO,
        cutOptionName: cutOptionsMap.get(e.CutOptionId)?.OptionProductCutOptions || null,
        hasVersions: !e.OriginalSizeMeasurementId
          ? Boolean(originalVersionLookup.get(e.Id))
          : false,
        CreatedOn: e.CreatedOn,
        CreatedBy: e.CreatedBy,
        UpdatedOn: e.UpdatedOn,
        UpdatedBy: e.UpdatedBy,
      }));

    } catch (error) {
      console.error('Actual error fetching size measurements:', error);
      throw new BadRequestException('Error fetching size measurements');
    }
  }

  async findOne(id: number, userId: number): Promise<SizeMeasurement> {
    try {
      // Step 1: Fetch size measurement with client and size option names
      const sizeMeasurement = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .select([
          'sm.*',
          'so.OptionSizeOptions AS SizeOptionName',
          'cl.Name AS ClientName',
          'pc.Id AS ProductCategoryId',
          'pc.Type AS ProductCategoryType'
        ])
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .leftJoin('client', 'cl', 'sm.ClientId = cl.Id')
        .leftJoin('productcategory', 'pc', 'sm.ProductCategoryId = pc.Id')
        .where('sm.Id = :id', { id })
        .andWhere('sm.IsActive = :isActive', { isActive: true })
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

      const userAssignedClientIds = await this.getClientsForUser(userId);
      if (userAssignedClientIds.length > 0 && !userAssignedClientIds.includes(sizeMeasurement.ClientId)) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Step 3: Return the result, adding cutOptionName
      return {
        ...sizeMeasurement,
        H_FusionInside: sizeMeasurement?.H_FusionInside ? HatFusion.YES : HatFusion.NO ?? HatFusion.NO,
        cutOptionName,
        CreatedOn: sizeMeasurement.CreatedOn,
        CreatedBy: sizeMeasurement.CreatedBy,
        UpdatedOn: sizeMeasurement.UpdatedOn,
        UpdatedBy: sizeMeasurement.UpdatedBy,
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching size measurement:', error);
      throw new BadRequestException('Error fetching size measurement');
    }
  }

  /**
   * Get the latest active version of a size measurement for a given SizeOptionId
   */
  async getLatestForSizeOption(sizeOptionId: number): Promise<SizeMeasurement | null> {
    try {
      const latest = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .where('sm.SizeOptionId = :sizeOptionId', { sizeOptionId })
        .andWhere('sm.IsLatest = :isLatest', { isLatest: true })
        .andWhere('sm.IsActive = :isActive', { isActive: true })
        .orderBy('sm.Version', 'DESC')
        .getOne();

      return latest;
    } catch (error) {
      console.error('Error getting latest size measurement:', error);
      return null;
    }
  }

  /**
   * Get all versions for a given original size measurement
   */
  async findVersions(originalId: number, userId: number): Promise<SizeMeasurement[]> {
    try {
      // First verify the original exists and user has access
      const original = await this.findOne(originalId, userId);
      
      // Get the actual original ID (could be the same if it's an original, or the OriginalSizeMeasurementId if it's a version)
      const actualOriginalId = original.OriginalSizeMeasurementId || originalId;

      const versions = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .where('sm.Id = :originalId', { originalId: actualOriginalId })
        .orWhere('sm.OriginalSizeMeasurementId = :originalId', { originalId: actualOriginalId })
        .orderBy('sm.Version', 'ASC')
        .getMany();

      return versions;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching versions:', error);
      throw new BadRequestException('Error fetching versions');
    }
  }

  /**
   * Return all versions (original + versions) for a given size measurement id
   */
  async findVersionsByMeasurementId(measurementId: number, userId: number): Promise<SizeMeasurement[]> {
    try {
      // Verify measurement exists & user has access
      const measurement = await this.findOne(measurementId, userId);
      if (!measurement) {
        throw new NotFoundException(`Size measurement with ID ${measurementId} not found`);
      }

      return this.findVersions(measurementId, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching versions by measurement id:', error);
      throw new BadRequestException('Error fetching versions by measurement id');
    }
  }

  /**
   * Return all measurements (originals + versions) for a size option
   */
  async findAllBySizeOption(sizeOptionId: number, userId: number): Promise<SizeMeasurement[]> {
    try {
      const userAssignedClientIds = await this.getClientsForUser(userId);

      const queryBuilder = this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .where('sm.SizeOptionId = :sizeOptionId', { sizeOptionId })
        .andWhere('sm.IsActive = :isActive', { isActive: true })
        .orderBy('sm.Version', 'ASC');

      if (userAssignedClientIds.length > 0) {
        queryBuilder.andWhere('sm.ClientId IN (:...clientIds)', { clientIds: userAssignedClientIds });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error fetching size measurements by size option:', error);
      throw new BadRequestException('Error fetching size measurements by size option');
    }
  }

  async update(id: number, updateSizeMeasurementDto: UpdateSizeMeasurementDto, updatedBy: string, userId: number): Promise<any> {
    try {
      let sizeOptionName = null;
      let cutOptionName = null;
      
      if (updateSizeMeasurementDto.ProductCategoryId) {
        const productcategory = await this.productCategoryRepository.findOne({ where: { Id: updateSizeMeasurementDto.ProductCategoryId } })
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

      // Get the existing record (using repository directly to get full entity)
      const existingMeasurement = await this.sizeMeasurementRepository.findOne({
        where: { Id: id, IsActive: true }
      });

      if (!existingMeasurement) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Verify user access
      const userAssignedClientIds = await this.getClientsForUser(userId);
      if (userAssignedClientIds.length > 0 && existingMeasurement.ClientId && !userAssignedClientIds.includes(existingMeasurement.ClientId)) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Determine the original ID
      // If OriginalSizeMeasurementId is null, this is an original record
      // If it's set, this is a version and we need to preserve the chain
      const originalId = existingMeasurement.OriginalSizeMeasurementId || existingMeasurement.Id;

      // Get the maximum version number for this original
      const maxVersion = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .where('sm.Id = :originalId', { originalId })
        .orWhere('sm.OriginalSizeMeasurementId = :originalId', { originalId })
        .select('MAX(sm.Version)', 'maxVersion')
        .getRawOne();

      const nextVersion = (maxVersion?.maxVersion || existingMeasurement.Version || 0) + 1;

      // Mark all existing versions of this original as not latest
      await this.sizeMeasurementRepository
        .createQueryBuilder()
        .update(SizeMeasurement)
        .set({ IsLatest: false })
        .where('Id = :originalId', { originalId })
        .orWhere('OriginalSizeMeasurementId = :originalId', { originalId })
        .execute();
      
      // Also mark other measurements with the same SizeOptionId, ClientId, and ProductCategoryId as not latest
      // This ensures only one latest version per unique (SizeOptionId + ClientId + ProductCategoryId) combination
      const updateOthersQuery = this.sizeMeasurementRepository
        .createQueryBuilder()
        .update(SizeMeasurement)
        .set({ IsLatest: false })
        .where('SizeOptionId = :sizeOptionId', { sizeOptionId: existingMeasurement.SizeOptionId })
        .andWhere('ProductCategoryId = :productCategoryId', { productCategoryId: existingMeasurement.ProductCategoryId })
        .andWhere('Id != :originalId', { originalId })
        .andWhere('(OriginalSizeMeasurementId != :originalId OR OriginalSizeMeasurementId IS NULL)', { originalId })
        .andWhere('IsActive = :isActive', { isActive: true });

      // Handle ClientId - could be null
      if (existingMeasurement.ClientId !== null && existingMeasurement.ClientId !== undefined) {
        updateOthersQuery.andWhere('ClientId = :clientId', { clientId: existingMeasurement.ClientId });
      } else {
        updateOthersQuery.andWhere('ClientId IS NULL');
      }

      await updateOthersQuery.execute();

      // Create new version - copy existing measurement and merge with updates
      // Exclude versioning fields, Id, and timestamps from the copy
      const { Id, OriginalSizeMeasurementId, Version, IsLatest, IsActive, CreatedOn, UpdatedOn, ...existingData } = existingMeasurement;

      // Get the base name (remove any existing version suffix if present)
      const desiredBaseNameSource = updateSizeMeasurementDto.Measurement1 !== undefined
        ? updateSizeMeasurementDto.Measurement1
        : existingMeasurement.Measurement1;

      const baseMeasurementName = this.getBaseMeasurementName(desiredBaseNameSource);

      // Merge updates with existing data (updates take precedence)
      const newVersionData = {
        ...existingData,
        ...updateSizeMeasurementDto,
        // Override versioning fields
        OriginalSizeMeasurementId: originalId,
        Version: nextVersion,
        IsLatest: true,
        H_FusionInside: updateSizeMeasurementDto.H_FusionInside,
        IsActive: true,
        CreatedBy: updatedBy,
        UpdatedBy: updatedBy,
        // Keep the original name without version suffix
        Measurement1: baseMeasurementName || existingData.Measurement1,
      };

      const newVersion = this.sizeMeasurementRepository.create(newVersionData);
      const savedResponse = await this.sizeMeasurementRepository.save(newVersion);

      // Get size option name for response
      if (!sizeOptionName && savedResponse.SizeOptionId) {
        const sizeOption = await this.sizeMeasurementRepository
          .createQueryBuilder('sm')
          .select('so.OptionSizeOptions as SizeOptionName')
          .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
          .where('so.Id = :sizeOptionId', { sizeOptionId: savedResponse.SizeOptionId })
          .getRawOne();
        sizeOptionName = sizeOption?.SizeOptionName || null;
      }

      return {
        ...savedResponse,
        cutOptionName: cutOptionName,
        SizeOptionName: sizeOptionName,
        CreatedOn: savedResponse.CreatedOn,
        CreatedBy: savedResponse.CreatedBy,
        UpdatedOn: savedResponse.UpdatedOn,
        UpdatedBy: savedResponse.UpdatedBy,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating size measurement:', error);
      throw new BadRequestException('Error updating size measurement');
    }
  }


  async setAsDefault(id: number, updatedBy: string, userId: number): Promise<any> {
    try {
      // Get the existing record
      const existingMeasurement = await this.sizeMeasurementRepository.findOne({
        where: { Id: id, IsActive: true }
      });

      if (!existingMeasurement) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Verify user access
      const userAssignedClientIds = await this.getClientsForUser(userId);
      if (userAssignedClientIds.length > 0 && existingMeasurement.ClientId && !userAssignedClientIds.includes(existingMeasurement.ClientId)) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Determine the original ID
      const originalId = existingMeasurement.OriginalSizeMeasurementId || existingMeasurement.Id;

      // Get the maximum version number for this original
      const maxVersion = await this.sizeMeasurementRepository
        .createQueryBuilder('sm')
        .where('sm.Id = :originalId', { originalId })
        .orWhere('sm.OriginalSizeMeasurementId = :originalId', { originalId })
        .select('MAX(sm.Version)', 'maxVersion')
        .getRawOne();

      const nextVersion = (maxVersion?.maxVersion || existingMeasurement.Version || 0) + 1;

      // Mark all existing versions of this original as not latest
      await this.sizeMeasurementRepository
        .createQueryBuilder()
        .update(SizeMeasurement)
        .set({ IsLatest: false })
        .where('Id = :originalId', { originalId })
        .orWhere('OriginalSizeMeasurementId = :originalId', { originalId })
        .execute();
      
      // Also mark other measurements with the same SizeOptionId, ClientId, and ProductCategoryId as not latest
      // This ensures only one latest version per unique (SizeOptionId + ClientId + ProductCategoryId) combination
      const updateOthersQuery = this.sizeMeasurementRepository
        .createQueryBuilder()
        .update(SizeMeasurement)
        .set({ IsLatest: false })
        .where('SizeOptionId = :sizeOptionId', { sizeOptionId: existingMeasurement.SizeOptionId })
        .andWhere('ProductCategoryId = :productCategoryId', { productCategoryId: existingMeasurement.ProductCategoryId })
        .andWhere('Id != :originalId', { originalId })
        .andWhere('(OriginalSizeMeasurementId != :originalId OR OriginalSizeMeasurementId IS NULL)', { originalId })
        .andWhere('IsActive = :isActive', { isActive: true });

      // Handle ClientId - could be null
      if (existingMeasurement.ClientId !== null && existingMeasurement.ClientId !== undefined) {
        updateOthersQuery.andWhere('ClientId = :clientId', { clientId: existingMeasurement.ClientId });
      } else {
        updateOthersQuery.andWhere('ClientId IS NULL');
      }

      await updateOthersQuery.execute();

      // Create new version - copy existing measurement without changes
      const { Id, OriginalSizeMeasurementId, Version, IsLatest, IsActive, CreatedOn, UpdatedOn, ...existingData } = existingMeasurement;

      // Get the base name (remove any existing version suffix if present)
      const baseMeasurementName = this.getBaseMeasurementName(existingMeasurement.Measurement1);

      // Create new version with same data
      const newVersionData = {
        ...existingData,
        // Override versioning fields
        OriginalSizeMeasurementId: originalId,
        Version: nextVersion,
        IsLatest: true,
        IsActive: true,
        CreatedBy: updatedBy,
        UpdatedBy: updatedBy,
        // Keep the original name without version suffix
        Measurement1: baseMeasurementName || existingData.Measurement1,
      };

      const newVersion = this.sizeMeasurementRepository.create(newVersionData);
      const savedResponse = await this.sizeMeasurementRepository.save(newVersion);

      // Get size option name and cut option name for response
      let sizeOptionName = null;
      let cutOptionName = null;

      if (savedResponse.SizeOptionId) {
        const sizeOption = await this.sizeMeasurementRepository
          .createQueryBuilder('sm')
          .select('so.OptionSizeOptions as SizeOptionName')
          .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
          .where('so.Id = :sizeOptionId', { sizeOptionId: savedResponse.SizeOptionId })
          .getRawOne();
        sizeOptionName = sizeOption?.SizeOptionName || null;
      }

      if (savedResponse.CutOptionId) {
        const cutOption = await this.productCutOptionRepository.findOne({
          where: { Id: savedResponse.CutOptionId },
          withDeleted: true
        });
        cutOptionName = cutOption?.OptionProductCutOptions || null;
      }

      return {
        ...savedResponse,
        cutOptionName: cutOptionName,
        SizeOptionName: sizeOptionName,
        CreatedOn: savedResponse.CreatedOn,
        CreatedBy: savedResponse.CreatedBy,
        UpdatedOn: savedResponse.UpdatedOn,
        UpdatedBy: savedResponse.UpdatedBy,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error setting size measurement as default:', error);
      throw new BadRequestException('Error setting size measurement as default');
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    try {
      // Verify existence and user access
      await this.findOne(id, userId);

      const measurementEntity = await this.sizeMeasurementRepository.findOne({
        where: { Id: id, IsActive: true },
      });

      if (!measurementEntity) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }

      // Prevent deleting originals when versions still exist
      if (!measurementEntity.OriginalSizeMeasurementId) {
        const existingVersions = await this.sizeMeasurementRepository.count({
          where: { OriginalSizeMeasurementId: measurementEntity.Id },
        });

        if (existingVersions > 0) {
          throw new BadRequestException(
            'Cannot delete the original size measurement while versions exist. Please delete the versions first.',
          );
        }
      }

      // If deleting a record that is latest, set another record as latest
      if (measurementEntity.IsLatest) {
        // Determine the original ID
        const originalId = measurementEntity.OriginalSizeMeasurementId || measurementEntity.Id;

        // Try to find and set the original as latest
        if (measurementEntity.OriginalSizeMeasurementId) {
          const original = await this.sizeMeasurementRepository.findOne({
            where: { Id: originalId, IsActive: true },
          });

          if (original) {
            // Mark all other measurements with the same SizeOptionId, ClientId, and ProductCategoryId as not latest
            const updateQuery1 = this.sizeMeasurementRepository
              .createQueryBuilder()
              .update(SizeMeasurement)
              .set({ IsLatest: false })
              .where('SizeOptionId = :sizeOptionId', { sizeOptionId: measurementEntity.SizeOptionId })
              .andWhere('ProductCategoryId = :productCategoryId', { productCategoryId: measurementEntity.ProductCategoryId })
              .andWhere('Id != :originalId', { originalId })
              .andWhere('IsActive = :isActive', { isActive: true });

            // Handle ClientId - could be null
            if (measurementEntity.ClientId !== null && measurementEntity.ClientId !== undefined) {
              updateQuery1.andWhere('ClientId = :clientId', { clientId: measurementEntity.ClientId });
            } else {
              updateQuery1.andWhere('ClientId IS NULL');
            }

            await updateQuery1.execute();

            // Set original as latest
            await this.sizeMeasurementRepository.update(originalId, { IsLatest: true });
          } else {
            // Original not found or inactive, find the most recent active version
            const mostRecentVersion = await this.sizeMeasurementRepository
              .createQueryBuilder('sm')
              .where('sm.OriginalSizeMeasurementId = :originalId', { originalId })
              .andWhere('sm.IsActive = :isActive', { isActive: true })
              .andWhere('sm.Id != :deletingId', { deletingId: id })
              .orderBy('sm.Version', 'DESC')
              .getOne();

            if (mostRecentVersion) {
              // Mark all other measurements with the same SizeOptionId, ClientId, and ProductCategoryId as not latest
              const updateQuery2 = this.sizeMeasurementRepository
                .createQueryBuilder()
                .update(SizeMeasurement)
                .set({ IsLatest: false })
                .where('SizeOptionId = :sizeOptionId', { sizeOptionId: measurementEntity.SizeOptionId })
                .andWhere('ProductCategoryId = :productCategoryId', { productCategoryId: measurementEntity.ProductCategoryId })
                .andWhere('Id != :versionId', { versionId: mostRecentVersion.Id })
                .andWhere('IsActive = :isActive', { isActive: true });

              // Handle ClientId - could be null
              if (measurementEntity.ClientId !== null && measurementEntity.ClientId !== undefined) {
                updateQuery2.andWhere('ClientId = :clientId', { clientId: measurementEntity.ClientId });
              } else {
                updateQuery2.andWhere('ClientId IS NULL');
              }

              await updateQuery2.execute();

              // Set most recent version as latest
              await this.sizeMeasurementRepository.update(mostRecentVersion.Id, { IsLatest: true });
            }
          }
        } else {
          // This is the original being deleted, find the most recent active version
          const mostRecentVersion = await this.sizeMeasurementRepository
            .createQueryBuilder('sm')
            .where('sm.OriginalSizeMeasurementId = :originalId', { originalId })
            .andWhere('sm.IsActive = :isActive', { isActive: true })
            .andWhere('sm.Id != :deletingId', { deletingId: id })
            .orderBy('sm.Version', 'DESC')
            .getOne();

          if (mostRecentVersion) {
            // Mark all other measurements with the same SizeOptionId, ClientId, and ProductCategoryId as not latest
            const updateQuery3 = this.sizeMeasurementRepository
              .createQueryBuilder()
              .update(SizeMeasurement)
              .set({ IsLatest: false })
              .where('SizeOptionId = :sizeOptionId', { sizeOptionId: measurementEntity.SizeOptionId })
              .andWhere('ProductCategoryId = :productCategoryId', { productCategoryId: measurementEntity.ProductCategoryId })
              .andWhere('Id != :versionId', { versionId: mostRecentVersion.Id })
              .andWhere('IsActive = :isActive', { isActive: true });

            // Handle ClientId - could be null
            if (measurementEntity.ClientId !== null && measurementEntity.ClientId !== undefined) {
              updateQuery3.andWhere('ClientId = :clientId', { clientId: measurementEntity.ClientId });
            } else {
              updateQuery3.andWhere('ClientId IS NULL');
            }

            await updateQuery3.execute();

            // Set most recent version as latest
            await this.sizeMeasurementRepository.update(mostRecentVersion.Id, { IsLatest: true });
          }
        }
      }

      const result = await this.sizeMeasurementRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Size measurement with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
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
          'pc.Type AS ProductCategoryType'
        ])
        .leftJoin('sizeoptions', 'so', 'sm.SizeOptionId = so.Id')
        .leftJoin('client', 'cl', 'sm.ClientId = cl.Id')
        .leftJoin('productcategory', 'pc', 'sm.ProductCategoryId = pc.Id')
        .where('sm.ClientId = :clientId', { clientId })
        .andWhere('sm.IsActive = :isActive', { isActive: true })
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
        H_FusionInside: e?.H_FusionInside ? HatFusion.YES : HatFusion.NO ?? HatFusion.NO,
        cutOptionName: cutOptionsMap.get(e.CutOptionId)?.OptionProductCutOptions || null,
        CreatedOn: e.CreatedOn,
        CreatedBy: e.CreatedBy,
        UpdatedOn: e.UpdatedOn,
        UpdatedBy: e.UpdatedBy,
      }));

    } catch (error) {
      console.error('Error fetching size measurements:', error);
      throw new BadRequestException('Error fetching size measurements');
    }
  }

  /**
   * Helper: remove trailing " - vN" suffix to get the base measurement name
   */
  private getBaseMeasurementName(name?: string | null): string {
    if (!name) {
      return '';
    }
    return name.replace(/\s*-\s*v\d+$/i, '').trim();
  }


} 