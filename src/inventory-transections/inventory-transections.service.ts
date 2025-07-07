import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryTransactions } from './_/inventory-transections.entity';
import { CreateInventoryTransectionsDto } from './_/inventory-transections.dto';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';

@Injectable()
export class inventoryTransectionService {
    constructor(
        @InjectRepository(InventoryTransactions)
        private readonly inventoryTransactionsRepository: Repository<InventoryTransactions>,
        @InjectRepository(InventoryItems)
        private readonly inventoryItemsRepository: Repository<InventoryItems>,
        @InjectRepository(UnitOfMeasures)
        private readonly inventoryUnitOfMeasuresRepository: Repository<UnitOfMeasures>,
        @InjectRepository(Client)
        private readonly clientsRepository: Repository<Client>,
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(InventorySuppliers)
        private readonly inventorySupplierRepository: Repository<InventorySuppliers>,
    ) { }

    async create(data: CreateInventoryTransectionsDto, createdBy: string) {
        const item = await this.inventoryItemsRepository.findOneBy({
            Id: data.InventoryItemId,
        });
        if (!item) throw new NotFoundException('Item not found');

        const existingTransaction = await this.inventoryTransactionsRepository.find(
            {
                where: { InventoryItemId: data.InventoryItemId },
                withDeleted: true,
            },
        );

        if (data.TransactionType === 'Opening Balance') {
            const hasOpeningBalance = existingTransaction.some(
                (tx) => tx.TransactionType === 'Opening Balance',
            );
            if (hasOpeningBalance) {
                throw new BadRequestException(
                    'Opening Balance transaction already exists for this item.',
                );
            }
        }

        if (
            existingTransaction?.length === 0 &&
            data.TransactionType !== 'Opening Balance'
        ) {
            throw new BadRequestException(
                'First transaction for an item must be of type "Opening Balance".',
            );
        }

        if (data.TransactionType === 'OUT' && item.Stock < data.Quantity) {
            throw new BadRequestException('Not enough stock available');
        }

        const newStock = this.calculateNewStock(
            Number(item.Stock),
            Number(data.Quantity),
            data.TransactionType,
        );

        await this.inventoryItemsRepository.update(data.InventoryItemId, {
            Stock: newStock,
            UpdatedBy: createdBy,
        });

        const transection = this.inventoryTransactionsRepository.create({
            ...data,
            CreatedBy: createdBy,
            UpdatedBy: createdBy,
        });
        return this.inventoryTransactionsRepository.save(transection);
    }

    async findAll() {
        const transactions = await this.inventoryTransactionsRepository.find({
            order: { TransactionDate: 'DESC' },
        });

        const itemIds = [...new Set(transactions.map((tx) => tx.InventoryItemId))];
        const clientIds = [
            ...new Set(transactions.map((tx) => tx.ClientId).filter(Boolean)),
        ];
        const orderIds = [
            ...new Set(transactions.map((tx) => tx.OrderId).filter(Boolean)),
        ];
        const supplierIds = [
            ...new Set(transactions.map((tx) => tx.SupplierId).filter(Boolean)),
        ];

        const items = await this.inventoryItemsRepository.find({
            where: { Id: In(itemIds) },
            withDeleted: true,
        });
        const clients = await this.clientsRepository.find({
            where: { Id: In(clientIds) },
            withDeleted: true,
        });
        const orders = await this.ordersRepository.find({
            where: { Id: In(orderIds) },
            withDeleted: true,
        });
        const suppliers = await this.inventorySupplierRepository.find({
            where: { Id: In(supplierIds) },
            withDeleted: true,
        });

        const unitOfMeasureIds = items.map((it) => it.UnitOfMeasureId);
        const unitOfMeasures = await this.inventoryUnitOfMeasuresRepository.find({
            where: { Id: In(unitOfMeasureIds) },
            withDeleted: true,
        });

        const itemMap = new Map(items.map((item) => [item.Id, item]));
        const clientMap = new Map(clients.map((c) => [c.Id, c]));
        const orderMap = new Map(orders.map((o) => [o.Id, o]));
        const supplierMap = new Map(suppliers.map(s => [s.Id, s]));
        const unitOfMeasuresMap = new Map(unitOfMeasures.map((um) => [um.Id, um]));

        return transactions.map((tx) => {
            const item = itemMap.get(tx.InventoryItemId);
            const client = clientMap.get(tx.ClientId);
            const order = orderMap.get(tx.OrderId);
            const supplier = supplierMap.get(tx.SupplierId);

            return {
                Id: tx.Id,
                InventoryItemId: tx.InventoryItemId,
                ItemName: item?.Name || null,
                ItemCode: item?.ItemCode || null,
                RedorderLevel: item?.ReorderLevel || null,
                Stock: item?.Stock || null,
                UnitOfMeasureId: item?.UnitOfMeasureId || null,
                UnitOfMeasureName:
                    unitOfMeasuresMap.get(item.UnitOfMeasureId).Name || null,
                UnitOfMeasureShortForm:
                    unitOfMeasuresMap.get(item.UnitOfMeasureId).ShortForm || null,
                Quantity: tx.Quantity,
                TransactionType: tx.TransactionType,
                TransactionDate: tx.TransactionDate,
                ClientId: tx.ClientId || null,
                ClientName: client?.Name || null,
                SupplierId: tx.SupplierId || null,
                SupplierName: supplier?.Name || null,
                OrderId: tx.OrderId || null,
                OrderName: order?.OrderName || null,
                OrderNumber: order?.OrderName || null,
                CreatedBy: tx.CreatedBy,
                UpdatedBy: tx.UpdatedBy,
                CreatedOn: tx.CreatedOn,
                UpdatedOn: tx.UpdatedOn,
            };
        });
    }

    async findOne(Id: number) {

        const transaction = await this.inventoryTransactionsRepository.findOneBy({
            Id,
        });
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${Id} not found`);
        }

        const item = await this.inventoryItemsRepository.findOne({
            where: { Id: transaction.InventoryItemId },
            withDeleted: true,
        });
        if (!item) {
            throw new NotFoundException(
                `Transection with id ${item.UnitOfMeasureId} not found`,
            );
        }

        const UnitOfMeasures = await this.inventoryUnitOfMeasuresRepository.findOne(
            {
                where: { Id: item.UnitOfMeasureId },
                withDeleted: true,
            },
        );
        if (!UnitOfMeasures) {
            throw new NotFoundException(
                `Unit Of Measures with id ${item.UnitOfMeasureId} not found`,
            );
        }

        const supplier = transaction.SupplierId ? await this.inventorySupplierRepository.findOne({
            where: { Id: transaction.SupplierId },
            withDeleted: true,
        })
            : null;

        const client = transaction.ClientId
            ? await this.clientsRepository.findOne({
                where: { Id: transaction.ClientId },
                withDeleted: true,
            })
            : null;
        const order = transaction.OrderId
            ? await this.ordersRepository.findOne({
                where: { Id: transaction.OrderId },
                withDeleted: true,
            })
            : null;

        return {
            Id: transaction.Id,
            InventoryItemId: transaction.InventoryItemId,
            ItemName: item?.Name || null,
            ItemCode: item?.ItemCode || null,
            ItemStock: item?.Stock || null,
            UnitOfMeasureId: item?.UnitOfMeasureId || null,
            UnitOfMeasureName: UnitOfMeasures?.Name || null,
            UnitOfMeasureShortForm: UnitOfMeasures?.ShortForm || null,
            Quantity: transaction.Quantity,
            TransactionType: transaction.TransactionType,
            TransactionDate: transaction.TransactionDate,
            ClientId: transaction.ClientId || null,
            ClientName: client?.Name || null,
            SupplierId: transaction.SupplierId || null,
            SupplierName: supplier?.Name || null,
            OrderId: transaction.OrderId || null,
            OrderName: order?.OrderName || null,
            OrderNumber: order?.OrderNumber || null,
            CreatedBy: transaction.CreatedBy,
            UpdatedBy: transaction.UpdatedBy,
            CreatedOn: transaction.CreatedOn,
            UpdatedOn: transaction.UpdatedOn,
        };
    }

    async update(Id: number, data: any, updatedBy: string) {
        try {
            const existingTransaction =
                await this.inventoryTransactionsRepository.findOneBy({ Id });

            if (!existingTransaction) {
                throw new NotFoundException(`Transaction with ID ${Id} not found`);
            }

            const itemId =
                data.InventoryItemId || existingTransaction.InventoryItemId;
            const item = await this.inventoryItemsRepository.findOneBy({
                Id: itemId,
            });
            if (!item) {
                throw new NotFoundException(
                    `Inventory item with ID ${itemId} not found`,
                );
            }

            const newQty = data.Quantity ?? existingTransaction.Quantity;
            const newType =
                data.TransactionType || existingTransaction.TransactionType;

            if (newType === 'Opening Balance') {
                const existingOpeningBalance =
                    await this.inventoryTransactionsRepository.findOne({
                        where: {
                            InventoryItemId: itemId,
                            TransactionType: 'Opening Balance',
                        },
                        withDeleted: true,
                    });
                if (existingOpeningBalance && existingOpeningBalance.Id !== Id) {
                    throw new BadRequestException(
                        'Opening Balance transaction already exists for this item.',
                    );
                }
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
                Quantity: data.Quantity,
                TransactionType: data.TransactionType,
                ClientId: data?.ClientId ?? existingTransaction?.ClientId,
                OrderId: data?.OrderId ?? existingTransaction?.OrderId,
                UpdatedBy: updatedBy,
                UpdatedOn: new Date(),
            });

            return await this.findOne(Id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(
                `Failed to update Inventory Transaction: ${error.message}`,
            );
        }
    }

    async delete(id: number) {
        const transaction = await this.inventoryTransactionsRepository.findOneBy({
            Id: id,
        });

        if (!transaction) {
            throw new NotFoundException(
                `Inventory Transaction with ID ${id} not found`,
            );
        }

        const item = await this.inventoryItemsRepository.findOneBy({
            Id: transaction.InventoryItemId,
        });

        if (!item) {
            throw new NotFoundException(
                `Inventory Item with ID ${transaction.InventoryItemId} not found`,
            );
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
                throw new BadRequestException(
                    `Invalid TransactionType: ${transaction.TransactionType}`,
                );
        }

        await this.inventoryItemsRepository.update(item.Id, {
            Stock: updatedStock,
        });

        const result = await this.inventoryTransactionsRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException(
                `Inventory Transaction with ID ${id} not found`,
            );
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