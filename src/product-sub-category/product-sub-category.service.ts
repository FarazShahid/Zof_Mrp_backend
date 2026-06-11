import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSubCategory } from './entities/product-sub-category.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { UpdateProductSubCategoryDto } from './dto/update-product-sub-category.dto';
import { ProductSubCategoryQueryDto } from './dto/product-sub-category-query.dto';

// Whitelisted sort column map — prevents SQL injection from sortBy param
const SORT_COLUMNS: Record<string, string> = {
    name: 'psc.Name',
    productCategoryId: 'psc.ProductCategoryId',
    productCategoryName: 'pc.Type',
    createdOn: 'psc.CreatedOn',
};

const SELECT_COLUMNS = [
    'psc.Id AS id',
    'psc.Name AS name',
    'psc.ProductCategoryId AS productCategoryId',
    'pc.Type AS productCategoryName',
    'psc.CreatedOn AS createdOn',
    'psc.UpdatedOn AS updatedOn',
    'psc.CreatedBy AS createdBy',
    'psc.UpdatedBy AS updatedBy',
];

@Injectable()
export class ProductSubCategoryService {
    constructor(
        @InjectRepository(ProductSubCategory)
        private readonly repo: Repository<ProductSubCategory>,
        @InjectRepository(ProductCategory)
        private readonly categoryRepo: Repository<ProductCategory>,
    ) {}

    async create(dto: CreateProductSubCategoryDto, createdBy: string): Promise<any> {
        const category = await this.categoryRepo.findOne({ where: { Id: dto.productCategoryId } });
        if (!category) {
            throw new BadRequestException(`Product category with id ${dto.productCategoryId} does not exist`);
        }

        const existing = await this.repo.findOne({
            where: { Name: dto.name, ProductCategoryId: dto.productCategoryId },
        });
        if (existing) {
            throw new BadRequestException(`Sub category with name "${dto.name}" already exists in this category`);
        }

        const entity = this.repo.create({
            Name: dto.name,
            ProductCategoryId: dto.productCategoryId,
            CreatedBy: createdBy,
            UpdatedBy: createdBy,
        });
        const saved = await this.repo.save(entity);
        return this.findOne(saved.Id);
    }

    async findAll(query: ProductSubCategoryQueryDto): Promise<any> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const search = query.search?.trim() || null;
        const sortOrder = query.sortOrder ?? 'ASC';
        const sortCol = SORT_COLUMNS[query.sortBy] ?? 'psc.Name';
        const skip = (page - 1) * limit;

        const qb = this.repo
            .createQueryBuilder('psc')
            .leftJoin('productcategory', 'pc', 'pc.Id = psc.ProductCategoryId');

        if (query.productCategoryId) {
            qb.andWhere('psc.ProductCategoryId = :categoryId', { categoryId: query.productCategoryId });
        }

        if (search) {
            qb.andWhere('psc.Name LIKE :search', { search: `%${search}%` });
        }

        const total = await qb.getCount();
        const totalPages = Math.ceil(total / limit);

        const rows = await qb
            .select(SELECT_COLUMNS)
            .orderBy(sortCol, sortOrder)
            .offset(skip)
            .limit(limit)
            .getRawMany();

        return {
            data: rows.map((row) => ({
                id: row.id,
                name: row.name,
                productCategoryId: row.productCategoryId,
                productCategoryName: row.productCategoryName,
                createdOn: row.createdOn,
                updatedOn: row.updatedOn,
                createdBy: row.createdBy,
                updatedBy: row.updatedBy,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasMore: page < totalPages,
            },
        };
    }

    async findOne(id: number): Promise<any> {
        const row = await this.repo
            .createQueryBuilder('psc')
            .leftJoin('productcategory', 'pc', 'pc.Id = psc.ProductCategoryId')
            .select(SELECT_COLUMNS)
            .where('psc.Id = :id', { id })
            .getRawOne();

        if (!row) {
            throw new NotFoundException(`Product sub category with ID ${id} not found`);
        }

        return row;
    }

    async update(id: number, dto: UpdateProductSubCategoryDto, updatedBy: string): Promise<any> {
        const item = await this.repo.findOne({ where: { Id: id } });
        if (!item) {
            throw new NotFoundException(`Product sub category with ID ${id} not found`);
        }

        if (dto.productCategoryId) {
            const category = await this.categoryRepo.findOne({ where: { Id: dto.productCategoryId } });
            if (!category) {
                throw new BadRequestException(`Product category with id ${dto.productCategoryId} does not exist`);
            }
            item.ProductCategoryId = dto.productCategoryId;
        }

        if (dto.name) {
            const existing = await this.repo.findOne({
                where: { Name: dto.name, ProductCategoryId: item.ProductCategoryId },
            });
            if (existing && existing.Id !== id) {
                throw new BadRequestException(`Sub category with name "${dto.name}" already exists in this category`);
            }
            item.Name = dto.name;
        }

        item.UpdatedBy = updatedBy;
        await this.repo.save(item);
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ message: string }> {
        const item = await this.repo.findOne({ where: { Id: id } });
        if (!item) {
            throw new NotFoundException(`Product sub category with ID ${id} not found`);
        }
        await this.repo.delete(id);
        return { message: `Product sub category with ID ${id} deleted successfully` };
    }
}
