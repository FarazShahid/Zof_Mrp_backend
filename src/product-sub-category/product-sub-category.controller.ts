import {
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Logger,
    UseInterceptors,
} from '@nestjs/common';
import { ProductSubCategoryService } from './product-sub-category.service';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { UpdateProductSubCategoryDto } from './dto/update-product-sub-category.dto';
import { ProductSubCategoryQueryDto } from './dto/product-sub-category-query.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Product Sub Categories', 'product-sub-categories')
@UseInterceptors(AuditInterceptor)
export class ProductSubCategoryController {
    private readonly logger = new Logger(ProductSubCategoryController.name);

    constructor(private readonly service: ProductSubCategoryService) {}

    @HasRight(AppRightsEnum.AddProductDefinition)
    @Post()
    @ApiBody({ type: CreateProductSubCategoryDto })
    @HttpCode(HttpStatus.CREATED)
    @CommonApiResponses('Create a new product sub category')
    async create(@Body() dto: CreateProductSubCategoryDto, @CurrentUser() user: any) {
        try {
            return await this.service.create(dto, user.email);
        } catch (error) {
            this.logger.error(`Error creating product sub category: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.ViewProductDefinition)
    @Get()
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get all product sub categories with pagination, search, sorting and category filter')
    async findAll(@Query() query: ProductSubCategoryQueryDto) {
        try {
            return await this.service.findAll(query);
        } catch (error) {
            this.logger.error(`Error fetching product sub categories: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.ViewProductDefinition)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get a product sub category by id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error(`Error fetching product sub category: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.UpdateProductDefinition)
    @Put(':id')
    @ApiBody({ type: UpdateProductSubCategoryDto })
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Update a product sub category by id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductSubCategoryDto,
        @CurrentUser() user: any,
    ) {
        try {
            return await this.service.update(id, dto, user.email);
        } catch (error) {
            this.logger.error(`Error updating product sub category: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.DeleteProductDefinition)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Delete a product sub category by id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.service.remove(id);
        } catch (error) {
            this.logger.error(`Error deleting product sub category: ${error.message}`);
            throw error;
        }
    }
}
