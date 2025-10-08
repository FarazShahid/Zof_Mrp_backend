import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryTransactions, TransactionType } from './_/inventory-transections.entity';
import { CreateInventoryTransectionsDto } from './_/inventory-transections.dto';
import { InventoryItems } from 'src/inventory-items/_/inventory-items.entity';
import { UnitOfMeasures } from 'src/inventory-unit-measures/_/inventory-unit-measures.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { InventorySuppliers } from 'src/inventory-suppliers/_/inventory-suppliers.entity';
import { User } from 'src/users/entities/user.entity';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    return assignedClientIds;
  }

  async create(data: CreateInventoryTransectionsDto, createdBy: string, userId: number) {
    const item = await this.inventoryItemsRepository.findOneBy({
      Id: data.InventoryItemId,
    });
    if (!item) throw new NotFoundException('Item not found');

    const assignedClientIds = await this.getClientsForUser(userId);

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(data.ClientId)) {
      throw new BadRequestException(
        `You are not assigned to the client with ID ${data.ClientId}`,
      );
    }

    const existingTransaction = await this.inventoryTransactionsRepository.find(
      {
        where: { InventoryItemId: data.InventoryItemId },
        withDeleted: true,
      },
    );

    if (data.TransactionType === TransactionType.OPENING_BALANCE) {
      const hasOpeningBalance = existingTransaction.some(
        (tx) => tx.TransactionType === TransactionType.OPENING_BALANCE,
      );
      if (hasOpeningBalance) {
        throw new BadRequestException(
          'Opening Balance transaction already exists for this item.',
        );
      }
    }

    if (
      existingTransaction?.length === 0 &&
      data.TransactionType !== TransactionType.OPENING_BALANCE
    ) {
      throw new BadRequestException(
        'First transaction for an item must be of type "Opening Balance".',
      );
    }

    const currentStock = parseFloat(item.Stock?.toString() ?? '0');
    const qty = parseFloat(data.Quantity?.toString() ?? '0');

    if (data.TransactionType === TransactionType.OUT && currentStock < qty) {
      throw new BadRequestException('Not enough stock available');
    }

    // Calculate new stock using precision
    const newStock = this.calculateNewStock(currentStock, qty, data.TransactionType);

    await this.inventoryItemsRepository.update(data.InventoryItemId, {
      Stock: newStock,
      UpdatedBy: createdBy,
    });

    const transection = this.inventoryTransactionsRepository.create({
      ...data,
      Quantity: qty,
      CurrentStock: newStock,
      CreatedBy: createdBy,
      UpdatedBy: createdBy,
    });
    return this.inventoryTransactionsRepository.save(transection);
  }

  async findAll(userId: number) {
    const assignedClientIds = await this.getClientsForUser(userId);
 
    const transactions = await this.inventoryTransactionsRepository.find({
      where: assignedClientIds.length > 0 ? { ClientId: In(assignedClientIds) } : {},
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
    const supplierMap = new Map(suppliers.map((s) => [s.Id, s]));
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
        Stock: tx?.CurrentStock || null,
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

  async findOne(Id: number, userId?: number) {
        const assignedClientIds = await this.getClientsForUser(userId);

    const transaction = await this.inventoryTransactionsRepository.findOneBy({
      Id,
      ...(assignedClientIds.length > 0 ? { ClientId: In(assignedClientIds) } : {}),
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

    const supplier = transaction.SupplierId
      ? await this.inventorySupplierRepository.findOne({
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
      ItemStock: transaction?.CurrentStock || null,
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

  async update(Id: number, data: any, updatedBy: string, userId: number) {
    try {
      const assignedClientIds = await this.getClientsForUser(userId);
      const existingTransaction =
        await this.inventoryTransactionsRepository.findOneBy({ Id, ...(assignedClientIds.length > 0 ? { ClientId: In(assignedClientIds) } : {}) });

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

      if (newType === TransactionType.OPENING_BALANCE) {
        const existingOpeningBalance =
          await this.inventoryTransactionsRepository.findOne({
            where: {
              InventoryItemId: itemId,
              TransactionType: TransactionType.OPENING_BALANCE,
            },
            withDeleted: true,
          });
        if (existingOpeningBalance && existingOpeningBalance.Id !== Id) {
          throw new BadRequestException(
            'Opening Balance transaction already exists for this item.',
          );
        }
      }

      let stock = parseFloat((item.Stock ?? 0).toString());

      // Step 1: Revert the effect of the old transaction
      const oldQty = parseFloat(existingTransaction.Quantity.toString());
      switch (existingTransaction.TransactionType) {
        case TransactionType.IN:
        case TransactionType.OPENING_BALANCE:
        case TransactionType.RETURN_TO_STOCK:
          stock = parseFloat((stock - oldQty).toFixed(2));
          break;
        case TransactionType.OUT:
        case TransactionType.RETURN_TO_SUPPLIER:
        case TransactionType.DISPOSAL:
          stock = parseFloat((stock + oldQty).toFixed(2));
          break;
      }

      // Step 2: Apply the effect of the new transaction

      switch (newType) {
        case TransactionType.IN:
        case TransactionType.OPENING_BALANCE:
        case TransactionType.RETURN_TO_STOCK:
          stock = parseFloat((stock + newQty).toFixed(2));
          break;
        case TransactionType.OUT:
        case TransactionType.RETURN_TO_SUPPLIER:
        case TransactionType.DISPOSAL:
          stock = parseFloat((stock - newQty).toFixed(2));
          break;
      }

      // Step 3: Update item stock
      await this.inventoryItemsRepository.update(itemId, { Stock: stock });

      // Step 4: Update transaction
      await this.inventoryTransactionsRepository.update(Id, {
        CurrentStock: stock,
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

  async delete(id: number, userId: number) {
    
    const assignedClientIds = await this.getClientsForUser(userId);

    const transaction = await this.inventoryTransactionsRepository.findOneBy({
      Id: id,
      ...(assignedClientIds.length > 0 ? { ClientId: In(assignedClientIds) } : {}),
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

    let updatedStock = parseFloat((item.Stock ?? 0).toString());
    const transactionQty = parseFloat(transaction.Quantity.toString());

    switch (transaction.TransactionType) {
      case TransactionType.IN:
      case TransactionType.OPENING_BALANCE:
      case TransactionType.RETURN_TO_STOCK:
        updatedStock = parseFloat((updatedStock - transactionQty).toFixed(2));
        break;
      case TransactionType.OUT:
      case TransactionType.RETURN_TO_SUPPLIER:
      case TransactionType.DISPOSAL:
        updatedStock = parseFloat((updatedStock + transactionQty).toFixed(2));
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
    const s = parseFloat((stock || 0).toFixed(2));
    const q = parseFloat((qty || 0).toFixed(2));

    switch (type) {
      case 'IN':
      case 'Opening Balance':
      case 'Return to Stock':
        return parseFloat((s + q).toFixed(2));
      case 'OUT':
      case 'Disposal':
      case 'Return to Supplier':
        return parseFloat((s - q).toFixed(2));
      default:
        return stock;
    }
  }
}
