import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductComponentType } from './entities/product-component-type.entity';
import { CreateProductComponentTypeDto } from './dto/create-product-component-type.dto';
import { UpdateProductComponentTypeDto } from './dto/update-product-component-type.dto';

@Injectable()
export class ProductComponentTypesService {
    constructor(
        @InjectRepository(ProductComponentType)
        private readonly repo: Repository<ProductComponentType>,
    ) {}

    async create(dto: CreateProductComponentTypeDto, createdBy: string): Promise<any> {
        const existing = await this.repo.findOne({ where: { Name: dto.name } });
        if (existing) {
            throw new BadRequestException(`Component type with name "${dto.name}" already exists`);
        }
        const entity = this.repo.create({
            Name: dto.name,
            CreatedBy: createdBy,
            UpdatedBy: createdBy,
            CreatedOn: new Date(),
        });
        const saved = await this.repo.save(entity);
        return this.toResponse(saved);
    }

    async findAll(): Promise<any[]> {
        const items = await this.repo.find({ order: { CreatedOn: 'DESC' } });
        return items.map(this.toResponse);
    }

    async findOne(id: number): Promise<any> {
        const item = await this.repo.findOne({ where: { Id: id } });
        if (!item) {
            throw new NotFoundException(`Product component type with ID ${id} not found`);
        }
        return this.toResponse(item);
    }

    async update(id: number, dto: UpdateProductComponentTypeDto, updatedBy: string): Promise<any> {
        const item = await this.repo.findOne({ where: { Id: id } });
        if (!item) {
            throw new NotFoundException(`Product component type with ID ${id} not found`);
        }
        if (dto.name) {
            const existing = await this.repo.findOne({ where: { Name: dto.name } });
            if (existing && existing.Id !== id) {
                throw new BadRequestException(`Component type with name "${dto.name}" already exists`);
            }
            item.Name = dto.name;
        }
        item.UpdatedBy = updatedBy;
        item.UpdatedOn = new Date();
        await this.repo.save(item);
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ message: string }> {
        const item = await this.repo.findOne({ where: { Id: id } });
        if (!item) {
            throw new NotFoundException(`Product component type with ID ${id} not found`);
        }
        await this.repo.delete(id);
        return { message: `Product component type with ID ${id} deleted successfully` };
    }

    private toResponse(item: ProductComponentType) {
        return {
            id: item.Id,
            name: item.Name,
            createdOn: item.CreatedOn,
            updatedOn: item.UpdatedOn,
            createdBy: item.CreatedBy,
            updatedBy: item.UpdatedBy,
        };
    }
}
