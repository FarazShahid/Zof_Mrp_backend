import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryTransactions } from './_/inventory-transections.entity';
import { CreateInventoryTransectionsDto } from './_/inventory-transections.dto';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
@Injectable()
export class inventoryTransectionService {
    constructor(
        @InjectRepository(InventoryTransactions)
        private readonly inventoryTransactionsRepository: Repository<InventoryTransactions>,
        @InjectRepository(InventoryItems)
        private readonly inventoryItemsRepository: Repository<InventoryItems>,
    ) { }

    async create(
        data: CreateInventoryTransectionsDto,
        createdBy: string
    ) {

        const item = await this.inventoryItemsRepository.findOneBy({ Id: data.InventoryItemId });

        if (!item) throw new NotFoundException('Item not found');

        if (data.TransactionType === 'OUT' && item.Stock < data.Quantity) {
            throw new BadRequestException('Not enough stock available');
        }

        const newStock = this.calculateNewStock(Number(item.Stock), Number(data.Quantity), data.TransactionType);

        await this.inventoryItemsRepository.update(data.InventoryItemId, { Stock: newStock, UpdatedBy: createdBy });

        const transection = this.inventoryTransactionsRepository.create({
            ...data,
            CreatedBy: createdBy,
            UpdatedBy: createdBy
        });
        return this.inventoryTransactionsRepository.save(transection);
    }

    async findAll() {
        const transactions = await this.inventoryTransactionsRepository.find({
            order: { TransactionDate: 'DESC' },
        });

        const itemIds = [...new Set(transactions.map(tx => tx.InventoryItemId))];

        const items = await this.inventoryItemsRepository.find({
            where: { Id: In(itemIds) },
            withDeleted: true,
        });

        const itemMap = new Map(items.map(item => [item.Id, item]));

        return transactions.map(tx => {
            const item = itemMap.get(tx.InventoryItemId);

            return {
                Id: tx.Id,
                InventoryItemId: tx.InventoryItemId,
                ItemName: item?.Name || null,
                ItemCode: item?.ItemCode || null,
                UnitOfMeasure: item?.UnitOfMeasure || null,
                Quantity: tx.Quantity,
                TransactionType: tx.TransactionType,
                TransactionDate: tx.TransactionDate,
                CreatedBy: tx.CreatedBy,
                UpdatedBy: tx.UpdatedBy,
                CreatedOn: tx.CreatedOn,
                UpdatedOn: tx.UpdatedOn,
            };
        });
    }

    async findOne(Id: number) {
        const transaction = await this.inventoryTransactionsRepository.findOneBy({ Id });

        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${Id} not found`);
        }

        const item = await this.inventoryItemsRepository.findOne({
            where: { Id: transaction.InventoryItemId },
            withDeleted: true,
        });

        return {
            Id: transaction.Id,
            InventoryItemId: transaction.InventoryItemId,
            ItemName: item?.Name || null,
            ItemCode: item?.ItemCode || null,
            UnitOfMeasure: item?.UnitOfMeasure || null,
            Quantity: transaction.Quantity,
            TransactionType: transaction.TransactionType,
            TransactionDate: transaction.TransactionDate,
            CreatedBy: transaction.CreatedBy,
            UpdatedBy: transaction.UpdatedBy,
            CreatedOn: transaction.CreatedOn,
            UpdatedOn: transaction.UpdatedOn,
        };
    }

    async update(Id: number, data: any) {
        try {
            const existingTransaction = await this.inventoryTransactionsRepository.findOneBy({ Id });

            if (!existingTransaction) {
                throw new NotFoundException(`Transaction with ID ${Id} not found`);
            }

            const itemId = data.InventoryItemId || existingTransaction.InventoryItemId;
            const item = await this.inventoryItemsRepository.findOneBy({ Id: itemId });

            if (!item) {
                throw new NotFoundException(`Inventory item with ID ${itemId} not found`);
            }

            let stock = item.Stock ?? 0;

            // Step 1: Revert the effect of the old transaction
            switch (existingTransaction.TransactionType) {
                case 'IN':
                case 'Opening Balance':
                    stock -= existingTransaction.Quantity;
                    break;
                case 'OUT':
                case 'PRODUCTION':
                case 'Disposal':
                    stock += existingTransaction.Quantity;
                    break;
            }

            // Step 2: Apply the effect of the new transaction
            const newType = data.TransactionType || existingTransaction.TransactionType;
            const newQty = data.Quantity ?? existingTransaction.Quantity;

            switch (newType) {
                case 'IN':
                case 'Opening Balance':
                    stock += newQty;
                    break;
                case 'OUT':
                case 'PRODUCTION':
                case 'Disposal':
                    stock -= newQty;
                    break;
            }

            // Step 3: Update item stock
            await this.inventoryItemsRepository.update(itemId, { Stock: stock });

            // Step 4: Update transaction
            await this.inventoryTransactionsRepository.update(Id, {
                ...data,
                UpdatedOn: new Date(),
            });

            return await this.findOne(Id);

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update Inventory Transaction: ${error.message}`);
        }
    }

    async delete(id: number) {
        const transaction = await this.inventoryTransactionsRepository.findOneBy({ Id: id });

        if (!transaction) {
            throw new NotFoundException(`Inventory Transaction with ID ${id} not found`);
        }

        const item = await this.inventoryItemsRepository.findOneBy({ Id: transaction.InventoryItemId });

        if (!item) {
            throw new NotFoundException(`Inventory Item with ID ${transaction.InventoryItemId} not found`);
        }

        let updatedStock = item.Stock;

        switch (transaction.TransactionType) {
            case 'IN':
            case 'Opening Balance':
                updatedStock -= transaction.Quantity;
                break;
            case 'OUT':
            case 'PRODUCTION':
            case 'Disposal':
                updatedStock += transaction.Quantity;
                break;
            default:
                throw new BadRequestException(`Invalid TransactionType: ${transaction.TransactionType}`);
        }

        await this.inventoryItemsRepository.update(item.Id, { Stock: updatedStock });

        const result = await this.inventoryTransactionsRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Inventory Transaction with ID ${id} not found`);
        }

        return { message: 'Transaction deleted and stock reverted successfully' };
    }

    private calculateNewStock(stock: number, qty: number, type: string): number {
        switch (type) {
            case 'IN':
            case 'Opening Balance':
                return stock + qty;
            case 'OUT':
            case 'Disposal':
            case 'PRODUCTION':
                return stock - qty;
            default:
                return stock;
        }
    }
}