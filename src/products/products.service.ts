import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, DataSource, In } from 'typeorm';
import { UpdateProductStatusDto } from './dto/update-status-dto';
import { Client } from 'src/clients/entities/client.entity';
import { ProductPrintingOptions } from './entities/product-printing-options.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductPrintingOptions)
    private readonly productPrintingOptionsRepo: Repository<ProductPrintingOptions>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    private dataSource: DataSource,
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

  async create(
    createProductDto: CreateProductDto,
    createdBy: string,
    userId: number,
  ): Promise<Product> {
    try {
      const client = await this.clientRepository.findOne({
        where: { Id: createProductDto.ClientId },
      });

      if (!client)
        throw new BadRequestException(
          `Client with ID ${createProductDto.ClientId} not found`,
        );

      const assignedClientIds = await this.getClientsForUser(userId);

      if (assignedClientIds.length > 0 && !assignedClientIds.includes(createProductDto.ClientId)) {
        throw new BadRequestException(
          `You are not assigned to the client with ID ${createProductDto.ClientId}`,
        );
      }

      // Validate ProjectId if provided
      if (createProductDto.ProjectId) {
        const project = await this.projectRepository.findOne({
          where: { Id: createProductDto.ProjectId },
        });

        if (!project) {
          throw new BadRequestException(
            `Project with ID ${createProductDto.ProjectId} not found`,
          );
        }

        // Ensure project belongs to the same client as the product
        if (project.ClientId !== createProductDto.ClientId) {
          throw new BadRequestException(
            `Project with ID ${createProductDto.ProjectId} does not belong to client with ID ${createProductDto.ClientId}`,
          );
        }

        // Authorization: User must have access to the project's client
        if (assignedClientIds.length > 0 && !assignedClientIds.includes(project.ClientId)) {
          throw new BadRequestException(
            `You are not assigned to the client of project with ID ${createProductDto.ProjectId}`,
          );
        }
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });

      const savedProduct = await this.productRepository.save(newProduct);

      const hasRelations =
        (createProductDto.productColors?.length ?? 0) > 0 ||
        (createProductDto.productDetails?.length ?? 0) > 0 ||
        (createProductDto.productSizes?.length ?? 0) > 0 ||
        (createProductDto.qaChecklist?.length ?? 0) > 0 ||
        (createProductDto.printingOptions?.length ?? 0) > 0;

      if (hasRelations) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          // Insert productColors
          const validColors = (createProductDto.productColors ?? []).filter(
            (color) => color.colorId && color.ImageId,
          );

          for (const color of validColors) {
            await queryRunner.query(
              `INSERT INTO availablecoloroptions (colorId, ProductId, ImageId, CreatedBy, UpdatedBy) 
              VALUES (?, ?, ?, ?, ?)`,
              [
                color.colorId,
                savedProduct.Id,
                color.ImageId,
                createdBy,
                createdBy,
              ],
            );
          }

          // Insert printingOptions

          const validOptions = (createProductDto.printingOptions ?? []).filter(
            (option) => option.PrintingOptionId,
          );

          for (const option of validOptions) {
            const newOption = queryRunner.manager.create(
              ProductPrintingOptions,
              {
                ProductId: savedProduct.Id,
                PrintingOptionId: option.PrintingOptionId,
                CreatedBy: createdBy,
                UpdatedBy: createdBy,
              },
            );

            await queryRunner.manager.save(ProductPrintingOptions, newOption);
          }

          // Insert productDetails
          const validDetails = (createProductDto.productDetails ?? []).filter(
            (detail) => detail.ProductCutOptionId || detail.SleeveTypeId,
          );

          for (const detail of validDetails) {
            await queryRunner.query(
              `INSERT INTO productdetails 
             (ProductId, ProductCutOptionId, CreatedBy, UpdatedBy, SleeveTypeId) 
             VALUES (?, ?, ?, ?, ?)`,
              [
                savedProduct.Id,
                detail.ProductCutOptionId ?? null,
                createdBy,
                createdBy,
                detail.SleeveTypeId ?? null,
              ],
            );
          }

          // ✅ Insert productSizes
          const sizeIds = (createProductDto.productSizes ?? [])
            .map((s) => s.sizeId)
            .filter((id) => id);

          for (const sizeId of sizeIds) {
            await queryRunner.query(
              `INSERT INTO availblesizeoptions (sizeId, ProductId) VALUES (?, ?)`,
              [sizeId, savedProduct.Id],
            );
          }

          // ✅ Insert QA Checklist
          const qaChecklist = createProductDto.qaChecklist ?? [];

          for (const item of qaChecklist) {
            await queryRunner.query(
              `INSERT INTO qachecklist (name, productId) VALUES (?, ?)`,
              [item.name, savedProduct.Id],
            );
          }

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
          console.error('Insert transaction error:', error);
          throw new BadRequestException(
            error.message || 'Failed to insert product relations',
          );
        } finally {
          await queryRunner.release();
        }
      }

      return savedProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new BadRequestException(error.message || 'Error creating product');
    }
  }

  async getAllProducts(userId: number, filter?: string | undefined | null): Promise<any[]> {

    const assignedClientIds = await this.getClientsForUser(userId);

    try {
      let query = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('fabrictype', 'fabric', 'fabric.Id = product.FabricTypeId')
        .leftJoin(
          'productcategory',
          'category',
          'category.Id = product.ProductCategoryId',
        )
        .leftJoin('Client', 'client', 'client.Id = product.ClientId')
        .leftJoin('project', 'project', 'project.Id = product.ProjectId')
        .select([
          'product.Id AS Id',
          'product.Name AS Name',
          'product.ProductCategoryId AS ProductCategoryId',
          'category.Type AS ProductCategoryName',
          'product.FabricTypeId AS FabricTypeId',
          'fabric.Type AS FabricType',
          'fabric.Name AS FabricName',
          'fabric.GSM AS GSM',
          'product.Description AS Description',
          'product.productStatus AS productStatus',
          'product.isArchived AS isArchived',
          'client.Id AS ClientId',
          'client.Name AS ClientName',
          'product.ProjectId AS ProjectId',
          'project.Name AS ProjectName',
          'product.CreatedOn AS CreatedOn',
          'product.UpdatedOn AS UpdatedOn',
          'product.CreatedBy AS CreatedBy',
          'product.UpdatedBy AS UpdatedBy',
        ]);
      query.orderBy('product.CreatedOn', 'DESC');

      if (filter === 'archive') {
        query.where('product.isArchived = :isArchived', { isArchived: true });
      } else if (filter === 'unarchive') {
        query.where('product.isArchived = :isArchived', { isArchived: false });
      }

      if (assignedClientIds.length > 0) {
        query.andWhere('product.ClientId IN (:...ids)', { ids: assignedClientIds });
      }

      const products = await query.getRawMany();

      return products.map((product) => ({
        Id: product?.Id,
        Name: product?.Name,
        ProductCategoryId: product?.ProductCategoryId,
        ProductCategoryName: product?.ProductCategoryName,
        FabricTypeId: product?.FabricTypeId || '',
        FabricType: product?.FabricType || '',
        FabricName: product?.FabricName || '',
        GSM: product?.GSM || '',
        Description: product?.Description || '',
        productStatus: product?.productStatus || '',
        isArchived: Boolean(product?.isArchived) || false,
        ClientId: product?.ClientId || null,
        ClientName: product?.ClientName || null,
        CreatedBy: product?.CreatedBy || '',
        UpdatedBy: product?.UpdatedBy || '',
        CreatedOn: product?.CreatedOn || '',
        UpdatedOn: product?.UpdatedOn || '',
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductsByClientId(clientId: number, userId: number): Promise<any[]> {
    try {
      const assignedClientIds = await this.getClientsForUser(userId);

      // Check if user has access to this client
      if (assignedClientIds.length > 0 && !assignedClientIds.includes(clientId)) {
        throw new ForbiddenException(
          `You are not assigned to the client with ID ${clientId}`,
        );
      }

      // Verify client exists
      const client = await this.clientRepository.findOne({
        where: { Id: clientId },
      });

      if (!client) {
        throw new NotFoundException(`Client with ID ${clientId} not found`);
      }

      const query = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('fabrictype', 'fabric', 'fabric.Id = product.FabricTypeId')
        .leftJoin(
          'productcategory',
          'category',
          'category.Id = product.ProductCategoryId',
        )
        .leftJoin('Client', 'client', 'client.Id = product.ClientId')
        .leftJoin('project', 'project', 'project.Id = product.ProjectId')
        .select([
          'product.Id AS Id',
          'product.Name AS Name',
          'product.ProductCategoryId AS ProductCategoryId',
          'category.Type AS ProductCategoryName',
          'product.FabricTypeId AS FabricTypeId',
          'fabric.Type AS FabricType',
          'fabric.Name AS FabricName',
          'fabric.GSM AS GSM',
          'product.Description AS Description',
          'product.productStatus AS productStatus',
          'product.isArchived AS isArchived',
          'client.Id AS ClientId',
          'client.Name AS ClientName',
          'product.ProjectId AS ProjectId',
          'project.Name AS ProjectName',
          'product.CreatedOn AS CreatedOn',
          'product.UpdatedOn AS UpdatedOn',
          'product.CreatedBy AS CreatedBy',
          'product.UpdatedBy AS UpdatedBy',
        ])
        .where('product.ClientId = :clientId', { clientId })
        .orderBy('product.CreatedOn', 'DESC');

      const products = await query.getRawMany();

      return products.map((product) => ({
        Id: product?.Id,
        Name: product?.Name,
        ProductCategoryId: product?.ProductCategoryId,
        ProductCategoryName: product?.ProductCategoryName,
        FabricTypeId: product?.FabricTypeId || '',
        FabricType: product?.FabricType || '',
        FabricName: product?.FabricName || '',
        GSM: product?.GSM || '',
        Description: product?.Description || '',
        productStatus: product?.productStatus || '',
        isArchived: Boolean(product?.isArchived) || false,
        ClientId: product?.ClientId || null,
        ClientName: product?.ClientName || null,
        ProjectId: product?.ProjectId || null,
        ProjectName: product?.ProjectName || null,
        CreatedBy: product?.CreatedBy || '',
        UpdatedBy: product?.UpdatedBy || '',
        CreatedOn: product?.CreatedOn || '',
        UpdatedOn: product?.UpdatedOn || '',
      }));
    } catch (error) {
      console.error('Error fetching products by clientId:', error);
      throw error;
    }
  }

  async findOne(id: number, userId: number): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { Id: id },
      relations: ['client', 'fabricType', 'project']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const printingOptions = await this.productPrintingOptionsRepo.find({
      where: { Product: { Id: product.Id } },
      relations: ['Product', 'PrintingOption'],
    });

    const assignedClientIds = await this.getClientsForUser(userId);

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(product.ClientId)) {
      throw new ForbiddenException(`You do not have access to this product`);
    }

    const productColors = await this.dataSource.query(
      `SELECT aco.*, co.Name AS ColorName 
       FROM availablecoloroptions aco 
       LEFT JOIN coloroption co ON aco.colorId = co.Id 
       WHERE aco.ProductId = ?`,
      [id],
    );

    const productSizes = await this.dataSource.query(
      `SELECT s.Id, s.ProductId, s.sizeId, so.OptionSizeOptions AS SizeName
     FROM availblesizeoptions s
     INNER JOIN sizeoptions so ON s.sizeId = so.Id
     WHERE s.ProductId = ?`,
      [id],
    );

    const productDetails = await this.dataSource.query(
      `SELECT pd.*, 
       pco.OptionProductCutOptions, 
       st.SleeveTypeName 
       FROM productdetails pd 
       LEFT JOIN productcutoptions pco ON pd.ProductCutOptionId = pco.Id 
       LEFT JOIN sleevetype st ON pd.SleeveTypeId = st.Id 
       WHERE pd.ProductId = ?`,
      [id],
    );

    const qaChecklistRaw = await this.dataSource.query(
      `SELECT * FROM qachecklist WHERE productId = ?`,
      [id],
    );

    const qaChecklist = qaChecklistRaw.map((item) => ({
      id: item.id,
      name: item.name,
      productId: item.productId,
    }));

    return {
      ...product,
      ClientName: product.client?.Name || null,
      FabricName: product.fabricType?.Name || null,
      FabricType: product.fabricType?.Type || null,
      ProjectId: product.project?.Id || null,
      ProjectName: product.project?.Name || null,
      printingOptions,
      productColors,
      productDetails,
      productSizes,
      qaChecklist
    };
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    updatedBy: string,
    userId: number,
  ): Promise<any> {
    const product = await this.productRepository.findOne({ where: { Id: id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    const assignedClientIds = await this.getClientsForUser(userId);

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(product.ClientId)) {
      throw new ForbiddenException(`You do not have access to this product`);
    }

    const isClientIdUpdated = product.ClientId !== updateProductDto.ClientId;
    if (isClientIdUpdated) {
      const newClient = await this.clientRepository.findOne({
        where: { Id: updateProductDto.ClientId },
      });
      if (!newClient)
        throw new BadRequestException(
          `Client with ID ${updateProductDto.ClientId} not found`,
        );
    }

    // Validate ProjectId if provided
    const finalClientId = updateProductDto.ClientId ?? product.ClientId;
    if (updateProductDto.ProjectId !== undefined) {
      if (updateProductDto.ProjectId === null) {
        // Allowing ProjectId to be set to null (removing project assignment)
        // No validation needed
      } else {
        const project = await this.projectRepository.findOne({
          where: { Id: updateProductDto.ProjectId },
        });

        if (!project) {
          throw new BadRequestException(
            `Project with ID ${updateProductDto.ProjectId} not found`,
          );
        }

        // Ensure project belongs to the same client as the product
        if (project.ClientId !== finalClientId) {
          throw new BadRequestException(
            `Project with ID ${updateProductDto.ProjectId} does not belong to client with ID ${finalClientId}`,
          );
        }

        // Authorization: User must have access to the project's client
        if (assignedClientIds.length > 0 && !assignedClientIds.includes(project.ClientId)) {
          throw new BadRequestException(
            `You are not assigned to the client of project with ID ${updateProductDto.ProjectId}`,
          );
        }
      }
    }

    const {
      productColors,
      productDetails,
      productSizes,
      printingOptions,
      ...productData
    } = updateProductDto;

    const updatedProduct = await this.productRepository.save({
      ...productData,
      Id: id,
      UpdatedBy: updatedBy,
      UpdatedOn: new Date(),
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // --- Colors ---
      if (Array.isArray(productColors)) {
        const validColors = productColors.filter((c) => c.colorId && c.ImageId);
        const existingColors: { Id: number }[] = await queryRunner.query(
          `SELECT Id FROM availablecoloroptions WHERE ProductId = ?`,
          [id],
        );
        const updatedColorIds = validColors
          .filter((c) => c.Id)
          .map((c) => c.Id);
        const toRemove = existingColors.filter(
          (c) => !updatedColorIds.includes(c.Id),
        );
        if (toRemove.length) {
          const ids = toRemove.map((c) => c.Id).join(',');
          await queryRunner.query(
            `DELETE FROM availablecoloroptions WHERE Id IN (${ids})`,
          );
        }
        for (const color of validColors) {
          if (color.Id) {
            await queryRunner.query(
              `UPDATE availablecoloroptions 
             SET colorId = ?, ImageId = ?, UpdatedOn = ?, UpdatedBy = ? 
             WHERE Id = ?`,
              [color.colorId, color.ImageId, new Date(), updatedBy, color.Id],
            );
          } else {
            await queryRunner.query(
              `INSERT INTO availablecoloroptions 
             (ProductId, colorId, ImageId, CreatedOn, CreatedBy, UpdatedOn, UpdatedBy) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                color.colorId,
                color.ImageId,
                new Date(),
                updatedBy,
                new Date(),
                updatedBy,
              ],
            );
          }
        }
      }

      // --- Details ---
      if (Array.isArray(productDetails)) {
        const validDetails = productDetails.filter(
          (d) => d.ProductCutOptionId || d.SleeveTypeId,
        );
        const existingDetails: { Id: number }[] = await queryRunner.query(
          `SELECT Id FROM productdetails WHERE ProductId = ?`,
          [id],
        );
        const updatedDetailIds = validDetails
          .filter((d) => d.Id)
          .map((d) => d.Id);
        const toRemove = existingDetails
          .map(r => r.Id)
          .filter(existingId => !updatedDetailIds.includes(existingId));
        if (toRemove.length) {
          const list = toRemove.join(',');
          await queryRunner.query(
            `DELETE FROM productdetails WHERE Id IN (${list})`
          );
        }
        for (const detail of validDetails) {
          if (detail.Id) {
            await queryRunner.query(
              `UPDATE productdetails 
             SET ProductCutOptionId = ?, UpdatedOn = ?, UpdatedBy = ?, SleeveTypeId = ? 
             WHERE Id = ?`,
              [
                detail.ProductCutOptionId ?? null,
                new Date(),
                updatedBy,
                detail.SleeveTypeId ?? null,
                detail.Id,
              ],
            );
          } else {
            await queryRunner.query(
              `INSERT INTO productdetails 
             (ProductId, ProductCutOptionId, CreatedOn, CreatedBy, UpdatedOn, UpdatedBy, SleeveTypeId) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                id,
                detail.ProductCutOptionId ?? null,
                new Date(),
                updatedBy,
                new Date(),
                updatedBy,
                detail.SleeveTypeId ?? null,
              ],
            );
          }
        }
      }

      // --- Sizes ---
      if (Array.isArray(productSizes)) {
        const sizeIds = productSizes.map((s) => s.sizeId).filter(Boolean);
        const existingSizes: { Id: number; sizeId: number }[] =
          await queryRunner.query(
            `SELECT Id, sizeId FROM availblesizeoptions WHERE ProductId = ?`,
            [id],
          );
        const existingSizeIds = existingSizes.map((s) => s.sizeId);
        const toRemove = existingSizes.filter(
          (s) => !sizeIds.includes(s.sizeId),
        );
        if (toRemove.length) {
          const ids = toRemove.map((s) => s.Id).join(',');
          await queryRunner.query(
            `DELETE FROM availblesizeoptions WHERE Id IN (${ids})`,
          );
        }
        const toAdd = sizeIds.filter((sid) => !existingSizeIds.includes(sid));
        for (const sizeId of toAdd) {
          await queryRunner.query(
            `INSERT INTO availblesizeoptions (sizeId, ProductId) VALUES (?, ?)`,
            [sizeId, id],
          );
        }
      }

      // --- Printing Options ---
      if (Array.isArray(printingOptions)) {
        const printingOptionRepo = queryRunner.manager.getRepository(
          ProductPrintingOptions,
        );
        const existingOptions = await printingOptionRepo.find({
          where: { ProductId: id },
        });
        const incomingIds = printingOptions.map((p) => p.PrintingOptionId);
        const toRemove = existingOptions.filter(
          (e) => !incomingIds.includes(e.PrintingOptionId),
        );
        if (toRemove.length) await printingOptionRepo.remove(toRemove);

        const existingIds = existingOptions.map((e) => e.PrintingOptionId);
        const toAdd = printingOptions
          .filter((p) => !existingIds.includes(p.PrintingOptionId))
          .map((p) =>
            printingOptionRepo.create({
              ProductId: id,
              PrintingOptionId: p.PrintingOptionId,
            }),
          );

        if (toAdd.length) await printingOptionRepo.save(toAdd);
      }

      // --- QA Checklist ---
      if (Array.isArray(updateProductDto.qaChecklist)) {
        const validChecklist = updateProductDto.qaChecklist.filter(
          (c) => c.name && c.name.trim().length > 0,
        );

        const existingChecklist: { id: number }[] = await queryRunner.query(
          `SELECT id FROM qachecklist WHERE productId = ?`,
          [id],
        );

        const updatedChecklistIds = validChecklist
          .filter((c) => c.id)
          .map((c) => c.id);

        // Delete removed checklist items
        const toRemove = existingChecklist
          .map((c) => c.id)
          .filter((existingId) => !updatedChecklistIds.includes(existingId));

        if (toRemove.length) {
          const ids = toRemove.join(',');
          await queryRunner.query(
            `DELETE FROM qachecklist WHERE id IN (${ids})`,
          );
        }

        // Insert or update checklist
        for (const checklist of validChecklist) {
          if (checklist.id) {
            await queryRunner.query(
              `UPDATE qachecklist SET name = ? WHERE id = ?`,
              [checklist.name, checklist.id],
            );
          } else {
            await queryRunner.query(
              `INSERT INTO qachecklist 
         (productId, name) 
         VALUES (?, ?)`,
              [id, checklist.name],
            );
          }
        }
      }

      await queryRunner.commitTransaction();
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Update transaction error:', error);
      throw new BadRequestException(
        error.message || 'Failed to update product',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateProductStatus(
    id: number,
    updateProductStatusDto: UpdateProductStatusDto,
    updatedBy: string,
    userId: number,
  ): Promise<any> {
    const { isArchived } = updateProductStatusDto;
    const product = await this.productRepository.findOne({ where: { Id: id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const assignedClientIds = await this.getClientsForUser(userId);

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(product.ClientId)) {
      throw new ForbiddenException(`You do not have access to this product`);
    }

    product.isArchived = isArchived;
    product.UpdatedBy = updatedBy;
    const updatedProduct = await this.productRepository.save(product);
    if (!updatedProduct)
      throw new InternalServerErrorException(
        "Can't update status. Please try again later",
      );
    return { message: 'Updated Successfully' };
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productRepository.findOne({
        where: { Id: id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      const assignedClientIds = await this.getClientsForUser(userId);

      if (assignedClientIds.length > 0 && !assignedClientIds.includes(product.ClientId)) {
        throw new ForbiddenException(`You do not have access to this product`);
      }

      // Delete related available color options
      await queryRunner.query(
        `DELETE FROM availablecoloroptions WHERE ProductId = ?`,
        [id],
      );

      // Delete related product details
      await queryRunner.query(
        `DELETE FROM productdetails WHERE ProductId = ?`,
        [id],
      );

      // Delete related available size options
      await queryRunner.query(
        `DELETE FROM availblesizeoptions WHERE ProductId = ?`,
        [id],
      );

      await queryRunner.query(
        `DELETE FROM qachecklist WHERE productId = ?`,
        [id],
      );

      await queryRunner.manager.delete(ProductPrintingOptions, {
        ProductId: id,
      });

      // Delete the product itself
      await queryRunner.query(`DELETE FROM product WHERE Id = ?`, [id]);

      await queryRunner.commitTransaction();

      return { message: `Product with ID ${id} has been deleted successfully` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error.message || `Error deleting product with ID ${id}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAvailablePrintingOptionsByProductId(
    productId: number,
  ): Promise<any[]> {
    try {
      const availablePrintingOptions = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('productprintingoptions', 'ppo', 'ppo.ProductId = product.Id')
        .leftJoin('printingoptions', 'po', 'po.Id = ppo.PrintingOptionId')
        .select(['ppo.Id AS Id', 'po.Type AS Type', 'ppo.PrintingOptionId AS PrintingOptionId'])
        .where('product.Id = :productId', { productId })
        .andWhere('ppo.Id IS NOT NULL')
        .getRawMany();

      if (!availablePrintingOptions || availablePrintingOptions.length === 0) {
        return [];
      }

      return availablePrintingOptions.map((printingOption) => ({
        Id: printingOption.PrintingOptionId,
        Type: printingOption.Type,
      }));
    } catch (error) {
      console.error('Error fetching available printing options:', error);
      return [];
    }
  }

  async getAvailableColorsByProductId(productId: number): Promise<any[]> {
    try {
      const availableColors = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin(
          'availablecoloroptions',
          'colors',
          'colors.ProductId = product.Id',
        )
        .leftJoin('coloroption', 'color', 'color.Id = colors.colorId')
        .select([
          'colors.Id AS Id',
          'color.Name AS ColorName',
          'color.HexCode AS HexCode',
          'colors.ImageId AS ImageId',
        ])
        .where('product.Id = :productId', { productId })
        .andWhere('colors.Id IS NOT NULL')
        .getRawMany();

      if (!availableColors || availableColors.length === 0) {
        return [];
      }

      return availableColors.map((color) => ({
        Id: color.Id,
        ColorName: color.ColorName,
        HexCode: color.HexCode,
        ImageId: color.ImageId,
      }));
    } catch (error) {
      console.error('Error fetching available colors:', error);
      return [];
    }
  }

  async getAvailableSizesByProductId(productId: number): Promise<any[]> {
    try {
      const availableSizes = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin(
          'availblesizeoptions',
          'sizes',
          'sizes.ProductId = product.Id',
        )
        .leftJoin('sizeoptions', 'size', 'size.Id = sizes.sizeId')
        .select([
          'sizes.Id AS Id',
          'sizes.sizeId AS SizeId',
          'size.OptionSizeOptions AS SizeName',
        ])
        .where('product.Id = :productId', { productId })
        .andWhere('sizes.Id IS NOT NULL')
        .getRawMany();

      if (!availableSizes || availableSizes.length === 0) {
        return [];
      }

      return availableSizes.map((size) => ({
        Id: size.Id,
        SizeId: size.SizeId,
        SizeName: size.SizeName,
      }));
    } catch (error) {
      console.error('Error fetching available sizes:', error);
      return [];
    }
  }

  async getAvailableCutOptionsByProductId(productId: number): Promise<any[]> {
    try {
      const cutOptions = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('productdetails', 'details', 'details.ProductId = product.Id')
        .leftJoin(
          'productcutoptions',
          'cutOption',
          'cutOption.Id = details.ProductCutOptionId',
        )
        .select([
          'cutOption.Id AS Id',
          'cutOption.OptionProductCutOptions AS Name',
        ])
        .where('product.Id = :productId', { productId })
        .andWhere('details.Id IS NOT NULL')
        .getRawMany();

      if (!cutOptions || cutOptions.length === 0) {
        return [];
      }

      return cutOptions.map((option) => ({
        Id: option.Id,
        Name: option.Name,
      }));
    } catch (error) {
      console.error('Error fetching available cut options:', error);
      throw new BadRequestException('Error fetching cut options for product');
    }
  }

  async getAvailableSleeveTypesByProductId(productId: number): Promise<any[]> {
    try {
      const sleevetypes = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('productdetails', 'details', 'details.ProductId = product.Id')
        .leftJoin(
          'sleevetype',
          'sleevetype',
          'sleevetype.Id = details.SleeveTypeId ',
        )
        .select(['DISTINCT details.SleeveTypeId ', 'sleevetype.*'])
        .where('product.Id = :productId', { productId })
        .andWhere('details.SleeveTypeId  IS NOT NULL')
        .andWhere('sleevetype.Id IS NOT NULL')
        .getRawMany();
      return sleevetypes;
    } catch (error) {
      console.error('Error fetching available Sleeve Types:', error);
      throw new BadRequestException('Error fetching sleeve types for product');
    }
  }

  async getProductsWithAttachments(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasMore: boolean;
    };
  }> {
    try {
      const assignedClientIds = await this.getClientsForUser(userId);

      // Step 1: Get all product IDs that have any attachments (we'll filter for images later)
      let allProductsQuery = this.productRepository
        .createQueryBuilder('product')
        .innerJoin(
          'media_links',
          'mediaLink',
          'mediaLink.reference_id = product.Id AND mediaLink.reference_type = :refType',
          { refType: 'product' },
        )
        .innerJoin('media', 'media', 'media.id = mediaLink.media_id')
        .select('product.Id', 'productId')
        .distinct(true)
        .orderBy('product.Id', 'ASC');

      if (assignedClientIds.length > 0) {
        allProductsQuery.andWhere('product.ClientId IN (:...ids)', {
          ids: assignedClientIds,
        });
      }

      const allProductIdsResult = await allProductsQuery.getRawMany();
      const allProductIds = allProductIdsResult.map((row) => row.productId);

      if (allProductIds.length === 0) {
        return {
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false,
          },
        };
      }

      // Step 2: Fetch all products with their attachments to filter for images
      let query = this.productRepository
        .createQueryBuilder('product')
        .leftJoin('Client', 'client', 'client.Id = product.ClientId')
        .leftJoin(
          'media_links',
          'mediaLink',
          'mediaLink.reference_id = product.Id AND mediaLink.reference_type = :refType',
          { refType: 'product' },
        )
        .leftJoin('media', 'media', 'media.id = mediaLink.media_id')
        .select([
          'product.Id AS productId',
          'product.Name AS productName',
          'product.Description AS description',
          'product.ClientId AS clientId',
          'client.Name AS clientName',
          'media.id AS mediaId',
          'media.file_name AS fileName',
          'media.file_type AS fileType',
          'media.file_url AS fileUrl',
          'mediaLink.tag AS mediaTag',
        ])
        .where('product.Id IN (:...allProductIds)', { allProductIds })
        .orderBy('product.Id', 'ASC');

      const results = await query.getRawMany();

      // Image types filter
      const imageTypes = new Set([
        'png',
        'jpg',
        'jpeg',
        'gif',
        'webp',
        'svg',
        'bmp',
        'tiff',
        'avif',
      ]);

      // Helper function to check if file is an image
      const isImageType = (fileType: string | null, fileName: string | null): boolean => {
        if (!fileType && !fileName) return false;
        
        // Check fileType (could be extension or MIME type)
        if (fileType) {
          const typeLower = fileType.toLowerCase();
          // Check if it's a MIME type (e.g., "image/png")
          if (typeLower.startsWith('image/')) {
            const ext = typeLower.split('/')[1]?.split(';')[0]?.trim();
            if (ext && imageTypes.has(ext)) return true;
          }
          // Check if it's just an extension
          if (imageTypes.has(typeLower)) return true;
        }
        
        // Check fileName extension as fallback
        if (fileName) {
          const ext = fileName.split('.').pop()?.toLowerCase();
          if (ext && imageTypes.has(ext)) return true;
        }
        
        return false;
      };

      // Step 4: Group attachments by product
      const productsMap = new Map<number, any>();

      for (const row of results) {
        const productId = row.productId;

        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            productId: productId,
            productName: row.productName,
            description: row.description,
            clientId: row.clientId,
            clientName: row.clientName,
            attachments: [],
          });
        }

        // Add attachment if exists and is an image type
        if (row.mediaId && isImageType(row.fileType, row.fileName)) {
          productsMap.get(productId).attachments.push({
            mediaId: row.mediaId,
            fileName: row.fileName,
            fileType: row.fileType,
            fileUrl: row.fileUrl,
            tag: row.mediaTag,
          });
        }
      }

      // Filter products to only include those with image attachments
      const productsWithImageAttachments = Array.from(productsMap.values()).filter(
        (product) => product.attachments.length > 0,
      );

      // Step 5: Paginate the filtered products
      const skip = (page - 1) * limit;
      const paginatedProducts = productsWithImageAttachments.slice(skip, skip + limit);
      const total = productsWithImageAttachments.length;
      const totalPages = Math.ceil(total / limit);
      const hasMore = skip + paginatedProducts.length < total;

      return {
        data: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore,
        },
      };
    } catch (error) {
      console.error('Error fetching products with attachments:', error);
      throw new BadRequestException('Error fetching products with attachments');
    }
  }
}
