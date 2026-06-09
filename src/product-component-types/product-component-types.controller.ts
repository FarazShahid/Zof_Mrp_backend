import {
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Logger,
    BadRequestException,
    UseInterceptors,
} from '@nestjs/common';
import { ProductComponentTypesService } from './product-component-types.service';
import { CreateProductComponentTypeDto } from './dto/create-product-component-type.dto';
import { UpdateProductComponentTypeDto } from './dto/update-product-component-type.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { ApiBody } from '@nestjs/swagger';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Product Component Types', 'product-component-types')
@UseInterceptors(AuditInterceptor)
export class ProductComponentTypesController {
    private readonly logger = new Logger(ProductComponentTypesController.name);

    constructor(private readonly service: ProductComponentTypesService) {}

    @HasRight(AppRightsEnum.AddProductDefinition)
    @Post()
    @ApiBody({ type: CreateProductComponentTypeDto })
    @HttpCode(HttpStatus.CREATED)
    @CommonApiResponses('Create a new product component type')
    async create(
        @Body() dto: CreateProductComponentTypeDto,
        @CurrentUser() user: any,
    ) {
        try {
            return await this.service.create(dto, user.email);
        } catch (error) {
            this.logger.error(`Error creating component type: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.ViewProductDefinition)
    @Get()
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get all product component types')
    async findAll() {
        try {
            return await this.service.findAll();
        } catch (error) {
            this.logger.error(`Error fetching component types: ${error.message}`);
            throw new BadRequestException(`Failed to get component types: ${error.message}`);
        }
    }

    @HasRight(AppRightsEnum.ViewProductDefinition)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Get a product component type by id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.service.findOne(id);
        } catch (error) {
            this.logger.error(`Error fetching component type: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.UpdateProductDefinition)
    @Put(':id')
    @ApiBody({ type: UpdateProductComponentTypeDto })
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Update a product component type by id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductComponentTypeDto,
        @CurrentUser() user: any,
    ) {
        try {
            return await this.service.update(id, dto, user.email);
        } catch (error) {
            this.logger.error(`Error updating component type: ${error.message}`);
            throw error;
        }
    }

    @HasRight(AppRightsEnum.DeleteProductDefinition)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @CommonApiResponses('Delete a product component type by id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        try {
            return await this.service.remove(id);
        } catch (error) {
            this.logger.error(`Error deleting component type: ${error.message}`);
            throw error;
        }
    }
}
