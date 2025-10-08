import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderItem, OrderItemShipmentEnum } from './entities/order-item.entity';
import { OrderItemsPrintingOption } from './entities/order-item-printiing.option.entity';
import { CreateOrderDto } from './dto/create-orders.dto';
import { OrderItemDetails } from './entities/order-item-details';
import { DataSource } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { ClientEvent } from '../events/entities/clientevent.entity';
import { Product } from '../products/entities/product.entity';
import { PrintingOptions } from '../printingoptions/entities/printingoptions.entity';
import { OrderStatus } from 'src/orderstatus/entities/orderstatus.entity';
import { SizeMeasurement } from 'src/size-measurements/entities/size-measurement.entity';
import { OrderStatusLogs } from './entities/order-status-log.entity';
import { Response } from 'express';
import { CreateQualityCheckDto } from './dto/create-checklist.dto';
import { OrderQualityCheck } from './entities/order-checklist.entity';
import { QAChecklist } from 'src/products/entities/qa-checklist.entity';
import * as fs from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as archiver from 'archiver';
import puppeteer from 'puppeteer';
import { StreamableFile } from '@nestjs/common';
import Handlebars from 'handlebars';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemsPrintingOption)
    private orderItemsPrintingOptionRepository: Repository<OrderItemsPrintingOption>,
    @InjectRepository(OrderItemDetails)
    private orderItemDetailRepository: Repository<OrderItemDetails>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientEvent)
    private eventRepository: Repository<ClientEvent>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(PrintingOptions)
    private printingOptionRepository: Repository<PrintingOptions>,
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
    @InjectRepository(OrderStatusLogs)
    private orderStatusLogRepository: Repository<OrderStatusLogs>,
    @InjectRepository(SizeMeasurement)
    private sizeMeasurementRepository: Repository<SizeMeasurement>,
    @InjectRepository(OrderQualityCheck)
    private readonly qualityCheckRepo: Repository<OrderQualityCheck>,
    @InjectRepository(QAChecklist)
    private qAChecklistRepository: Repository<QAChecklist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    return assignedClientIds;
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    createdBy: any,
    userId: number,
  ): Promise<Order> {

    const assignedClientIds = await this.getClientsForUser(userId);

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(createOrderDto.ClientId)) {
      throw new BadRequestException(
        `You are not assigned to the client with ID ${createOrderDto.ClientId}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        ClientId,
        OrderEventId,
        Description,
        Deadline,
        OrderPriority,
        ExternalOrderId,
        OrderName,
        OrderNumber,
        items,
      } = createOrderDto;

      const client = await queryRunner.manager.findOne(Client, {
        where: { Id: ClientId },
      });
      if (!client) {
        throw new NotFoundException(`Client with ID ${ClientId} not found`);
      }

      if (createOrderDto.OrderEventId) {
        const event = await queryRunner.manager.findOne(ClientEvent, {
          where: { Id: OrderEventId },
        });
        if (!event) {
          throw new NotFoundException(`Event with ID ${OrderEventId} not found`);
        }
      } else {
        createOrderDto.OrderEventId = null;
      }

      const productIds = items.map((item) => item.ProductId);
      const products = await queryRunner.manager.find(Product, {
        where: { Id: In(productIds) },
        relations: ['ProductCategory'],
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      const printingOptionIds = [
        ...new Set(
          items.flatMap((item) =>
            item.printingOptions
              ? item.printingOptions.map((option) => option.PrintingOptionId)
              : [],
          ),
        ),
      ];

      if (printingOptionIds.length > 0) {
        const printingOptions = await queryRunner.manager.find(PrintingOptions, {
          where: { Id: In(printingOptionIds) },
        });
        if (printingOptions.length !== printingOptionIds.length) {
          throw new NotFoundException('One or more printing options not found');
        }
      }

      const newOrder = queryRunner.manager.create(Order, {
        ClientId: ClientId,
        OrderEventId: createOrderDto.OrderEventId ?? null,
        Description,
        Deadline,
        OrderPriority,
        ExternalOrderId,
        OrderNumber,
        OrderName,
        CreatedBy: createdBy,
        UpdatedBy: createdBy,
      });

      const savedOrder = await queryRunner.manager.save(Order, newOrder);
      if (!savedOrder) {
        throw new InternalServerErrorException('Failed to create order.');
      }

      const statusLog = queryRunner.manager.create(OrderStatusLogs, {
        OrderId: savedOrder.Id,
        StatusId: 1,
      });
      await queryRunner.manager.save(OrderStatusLogs, statusLog);

      if (Array.isArray(items) && items.length > 0) {
        const orderItems = items.map((item) => ({
          OrderId: savedOrder.Id,
          ProductId: item.ProductId,
          Description: item?.Description ?? null,
          OrderItemPriority: item.OrderItemPriority || 0,
          ImageId: item.ImageId,
          FileId: item.FileId,
          VideoId: item.VideoId,
          CreatedBy: createdBy,
          UpdatedBy: createdBy,
        }));

        const savedOrderItems = await queryRunner.manager.save(OrderItem, orderItems);

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          // printing options
          if (
            Array.isArray(item.printingOptions) &&
            item.printingOptions.length > 0
          ) {
            const printingOptions = item.printingOptions.map((option) => ({
              OrderItemId: savedOrderItems[i].Id,
              PrintingOptionId: option.PrintingOptionId,
              Description: option.Description,
            }));

            await queryRunner.manager.save(OrderItemsPrintingOption, printingOptions);
          }

          // order item details
          if (Array.isArray(item.orderItemDetails) && item.ProductId) {
            const orderItemDetailsToSave = [];
            const product = products.find(p => p.Id === item.ProductId);
            const { IsTopUnit, IsBottomUnit, SupportsLogo } = product.ProductCategory;
            const isSizeOptionRequired = IsTopUnit || IsBottomUnit || SupportsLogo;
            for (const option of item.orderItemDetails) {
              let sizeMeasurement;
              if (isSizeOptionRequired) {
                if (!option.SizeOption) {
                  throw new BadRequestException(
                    `Size option is required for order item ${product.Name}`,
                  );
                }
                // Lookup associated SizeMeasurement
                sizeMeasurement = await queryRunner.manager.findOne(SizeMeasurement, {
                  where: { SizeOptionId: option.SizeOption },
                });
                if (!sizeMeasurement) {
                  throw new BadRequestException(
                    `SizeOption with id ${option.SizeOption} has no associated measurement`,
                  );
                }
              }
              orderItemDetailsToSave.push({
                OrderItemId: savedOrderItems[i].Id,
                ColorOptionId: option?.ColorOptionId ?? null,
                Quantity: option.Quantity,
                Priority: option.Priority,
                SizeOption: option?.SizeOption ?? null,
                MeasurementId: sizeMeasurement?.Id ?? null,
                CreatedBy: createdBy,
                UpdatedBy: createdBy,
              });
            }
            await queryRunner.manager.save(OrderItemDetails, orderItemDetailsToSave);
          }
        }
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error in createOrder:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async reorder(orderId: number, createdBy: string, userId: number): Promise<Order> {
    const existingOrder = await this.orderRepository.findOne({
      where: { Id: orderId },
      relations: [
        'orderItems',
        'orderItems.printingOptions',
        'orderItems.orderItemDetails',
      ],
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Prepare CreateOrderDto-compatible object
    const reorderDto: CreateOrderDto = {
      ClientId: existingOrder.ClientId,
      OrderEventId: existingOrder.OrderEventId,
      Description: `${existingOrder.Description || 'Reorder'} (Copy)`,
      Deadline: existingOrder.Deadline.toISOString(),
      OrderPriority: existingOrder.OrderPriority ?? 0,
      ExternalOrderId: existingOrder.ExternalOrderId,
      OrderNumber: existingOrder.OrderNumber,
      OrderName: existingOrder.OrderName,
      items: [],
    };

    for (const item of existingOrder.orderItems) {
      reorderDto.items.push({
        ProductId: item.ProductId,
        Description: item.Description,
        OrderItemPriority: item.OrderItemPriority,
        ImageId: item.ImageId,
        FileId: item.FileId,
        VideoId: item.VideoId,
        printingOptions:
          item.printingOptions?.map((po) => ({
            PrintingOptionId: po.PrintingOptionId,
            Description: po.Description,
          })) || [],
        orderItemDetails:
          item.orderItemDetails?.map((detail) => ({
            ColorOptionId: detail?.ColorOptionId ?? null,
            Quantity: detail.Quantity,
            Priority: detail.Priority,
            SizeOption: detail?.SizeOption ?? null,
            MeasurementId: detail?.MeasurementId ?? null,
          })) || [],
      });
    }

    // Create new order using the existing createOrder() logic
    return this.createOrder(reorderDto, createdBy, userId);
  }

  async getAllOrders(userId: number): Promise<any> {
    try {
      const assignedClientIds = await this.getClientsForUser(userId);

      let query = this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('client', 'client', 'order.ClientId = client.Id')
        .leftJoin('clientevent', 'event', 'order.OrderEventId = event.Id')
        .leftJoin('orderstatus', 'status', 'order.OrderStatusId = status.Id')
        .select([
          'order.Id AS Id',
          'order.OrderShipmentStatus AS OrderShipmentStatus',
          'order.ClientId AS ClientId',
          'client.Name AS ClientName',
          'order.OrderEventId AS OrderEventId',
          'event.EventName AS EventName',
          'order.Description AS Description',
          'order.OrderStatusId AS OrderStatusId',
          'status.StatusName AS StatusName',
          'order.Deadline AS Deadline',
          'order.OrderPriority AS OrderPriority',
          'order.OrderNumber AS OrderNumber',
          'order.OrderName AS OrderName',
          'order.ExternalOrderId AS ExternalOrderId',
          'order.CreatedOn AS CreatedOn',
          'order.UpdatedOn AS UpdatedOn',
        ])
        .orderBy('order.CreatedOn', 'DESC');

      if (assignedClientIds.length > 0) {
        query = query.where('order.ClientId IN (:...assignedClientIds)', {
          assignedClientIds,
        });
      }

      const result = await query.getRawMany();

      const total = await this.orderRepository
        .createQueryBuilder('order')
        .getCount();

      const formattedOrders = result.map((order) => ({
        Id: order.Id,
        OrderShipmentStatus: order?.OrderShipmentStatus as OrderItemShipmentEnum,
        ClientId: order.ClientId,
        ClientName: order.ClientName,
        OrderEventId: order?.OrderEventId ?? null,
        EventName: order.EventName,
        Description: order.Description,
        OrderStatusId: order.OrderStatusId,
        StatusName: order.StatusName,
        Deadline: order.Deadline,
        OrderPriority: order.OrderPriority,
        OrderNumber: order.OrderNumber,
        OrderName: order.OrderName,
        ExternalOrderId: order.ExternalOrderId,
        CreatedOn: order.CreatedOn,
        UpdatedOn: order.UpdatedOn,
      }));

      return formattedOrders;
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      throw error;
    }
  }

  async getOrdersByClientId(clientId: number, userId: number): Promise<any[]> {
    const assignedClientIds = await this.getClientsForUser(userId);
    if (assignedClientIds.length > 0 && !assignedClientIds.includes(clientId)) {
      throw new BadRequestException(
        `You are not assigned to the client with ID ${clientId}`,
      );
    }
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndMapOne(
        'order.EventName',
        'clientevent',
        'event',
        'order.OrderEventId = event.Id',
      )
      .leftJoinAndMapOne(
        'order.ClientName',
        'client',
        'client',
        'order.ClientId = client.Id',
      )
      .leftJoinAndMapOne(
        'order.StatusName',
        'orderstatus',
        'status',
        'order.OrderStatusId = status.Id',
      )
      .select([
        'order.Id AS OrderId',
        'order.Description',
        'order.OrderEventId',
        'order.ClientId',
        'order.OrderStatusId',
        'order.OrderPriority AS OrderPriority',
        'order.Deadline',
        'order.OrderNumber  AS OrderNumber ',
        'order.OrderName AS OrderName',
        'order.ExternalOrderId AS ExternalOrderId',
        'event.EventName AS EventName',
        'client.Name AS ClientName',
        'status.StatusName AS StatusName',
      ])
      .where('order.ClientId = :clientId', { clientId })
      .orderBy('order.Deadline', 'ASC')
      .getRawMany();

    if (!orders || orders.length === 0) {
      return [];
    }

    return orders.map((order) => ({
      Id: order.OrderId,
      OrderName: order.OrderName,
      OrderNumber: order.OrderNumber,
      ExternalOrderId: order.ExternalOrderId,
      Description: order.order_Description,
      OrderEventId: order?.order_OrderEventId ?? null,
      ClientId: order.order_ClientId,
      OrderPriority: order.OrderPriority,
      OrderStatusId: order.order_OrderStatusId,
      Deadline: order.order_Deadline,
      EventName: order.EventName || null,
      ClientName: order.ClientName || null,
      StatusName: order.StatusName || null,
    }));
  }

  async updateOrder(
    id: number,
    updateOrderDto: any,
    updatedBy: any,
    userId: number,
  ): Promise<Order> {

      const assignedClientIds = await this.getClientsForUser(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { Id: id },
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (assignedClientIds.length > 0 && !assignedClientIds.includes(order.ClientId)) {
        throw new BadRequestException(
          `You are not assigned to the client with ID ${order.ClientId}`,
        );
      }

      const { items, ...updateData } = updateOrderDto;

      // Validate client if provided
      if (updateData.ClientId) {
        const client = await queryRunner.manager.findOne(Client, {
          where: { Id: updateData.ClientId },
        });
        if (!client) {
          throw new NotFoundException(
            `Client with ID ${updateData.ClientId} not found`,
          );
        }
      }

      // Validate event (allow null)
      if (updateData.OrderEventId) {
        const event = await queryRunner.manager.findOne(ClientEvent, {
          where: { Id: updateData.OrderEventId },
        });
        if (!event) {
          throw new NotFoundException(
            `Event with ID ${updateData.OrderEventId} not found`,
          );
        }
      } else {
        updateData.OrderEventId = null;
      }

      // Handle items if provided
      if (Array.isArray(items) && items.length > 0) {
        // Validate products
        const productIds = items.map((item) => item.ProductId);
        const products = await queryRunner.manager.find(Product, {
          where: { Id: In(productIds) },
          relations: ['ProductCategory'],
        });
        if (products.length !== productIds.length) {
          throw new NotFoundException('One or more products not found');
        }

        // Validate printing options
        const printingOptionIds = [
          ...new Set(
            items.flatMap((item) =>
              item.printingOptions
                ? item.printingOptions.map((option) => option.PrintingOptionId)
                : [],
            ),
          ),
        ];

        if (printingOptionIds.length > 0) {
          const printingOptions = await queryRunner.manager.find(
            PrintingOptions,
            {
              where: { Id: In(printingOptionIds) },
            },
          );
          if (printingOptions.length !== printingOptionIds.length) {
            throw new NotFoundException(
              'One or more printing options not found',
            );
          }
        }

        // Delete existing related data
        const existingOrderItems = await queryRunner.manager.find(OrderItem, {
          where: { OrderId: id },
        });
        const existingOrderItemIds = existingOrderItems.map((oi) => oi.Id);

        if (existingOrderItemIds.length > 0) {
          await queryRunner.manager.delete(OrderItemsPrintingOption, {
            OrderItemId: In(existingOrderItemIds),
          });
          await queryRunner.manager.delete(OrderItemDetails, {
            OrderItemId: In(existingOrderItemIds),
          });
        }

        await queryRunner.manager.delete(OrderItem, { OrderId: id });

        // Create new order items
        const newOrderItems = items.map((item) => ({
          OrderId: id,
          ProductId: item.ProductId,
          Description: item?.Description ?? null,
          ImageId: item.ImageId,
          FileId: item.FileId,
          VideoId: item.VideoId,
          CreatedBy: updatedBy,
          UpdatedBy: updatedBy,
          CreatedOn: new Date(),
          UpdatedOn: new Date(),
          OrderItemPriority: item?.OrderItemPriority || 0,
        }));

        const savedOrderItems = await queryRunner.manager.save(
          OrderItem,
          newOrderItems,
        );

        // For each item, insert printing options and details
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const savedItem = savedOrderItems[i];

          // printing options
          if (
            Array.isArray(item.printingOptions) &&
            item.printingOptions.length > 0
          ) {
            const printingOptionsToSave = item.printingOptions.map(
              (option) => ({
                OrderItemId: savedItem.Id,
                PrintingOptionId: option.PrintingOptionId,
                Description: option.Description,
              }),
            );

            await queryRunner.manager.save(
              OrderItemsPrintingOption,
              printingOptionsToSave,
            );
          }

          // order item details with measurement resolution
          if (Array.isArray(item.orderItemDetails) && item.ProductId) {
            const product = products?.find((p) => p.Id === item.ProductId);
            const { IsTopUnit, IsBottomUnit, SupportsLogo } = product.ProductCategory;
            const isSizeOptionRequired = IsTopUnit || IsBottomUnit || SupportsLogo;
            const orderItemDetailsToSave: any[] = [];
            let sizeMeasurement;
            for (const option of item.orderItemDetails) {

              if (isSizeOptionRequired) {

                if (!option.SizeOption) {
                  throw new BadRequestException(
                    `Size option is required for order item "${product.Name}"`,
                  );
                }
                sizeMeasurement = await queryRunner.manager.findOne(
                  SizeMeasurement,
                  {
                    where: { SizeOptionId: option.SizeOption },
                  },
                );
                if (!sizeMeasurement) {
                  throw new BadRequestException(
                    `SizeOption with id ${option.SizeOption} has no associated measurement`,
                  );
                }
              }

              orderItemDetailsToSave.push({
                OrderItemId: savedItem.Id,
                ColorOptionId: option?.ColorOptionId ?? null,
                Quantity: option.Quantity,
                Priority: option.Priority,
                SizeOption: option?.SizeOption ?? null,
                MeasurementId: sizeMeasurement?.Id ?? null,
                CreatedBy: updatedBy,
                UpdatedBy: updatedBy,
                CreatedOn: new Date(),
                UpdatedOn: new Date(),
              });
            }

            await queryRunner.manager.save(
              OrderItemDetails,
              orderItemDetailsToSave,
            );
          }
        }
      }

      // Prepare update payload for order (only override if provided)
      const orderPayload: any = {
        ...order,
        UpdatedBy: updatedBy,
        UpdatedOn: new Date(),
      };
      if (updateData.ClientId !== undefined) {
        orderPayload.ClientId = updateData.ClientId;
      }
      if (updateData.OrderEventId !== undefined) {
        orderPayload.OrderEventId = updateData.OrderEventId ?? null;
      }
      if (updateData.Description !== undefined) {
        orderPayload.Description = updateData.Description;
      }
      if (updateData.Deadline !== undefined) {
        orderPayload.Deadline = updateData.Deadline;
      }
      if (updateData.OrderPriority !== undefined) {
        orderPayload.OrderPriority = updateData.OrderPriority;
      }
      if (updateData.ExternalOrderId !== undefined) {
        orderPayload.ExternalOrderId = updateData.ExternalOrderId;
      }
      if (updateData.OrderNumber !== undefined) {
        orderPayload.OrderNumber = updateData.OrderNumber;
      }
      if (updateData.OrderName !== undefined) {
        orderPayload.OrderName = updateData.OrderName;
      }

      const updatedOrder = await queryRunner.manager.save(Order, orderPayload);

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error in updateOrder:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrder(id: number, userId: number): Promise<void> {

    const assignedClientIds = await this.getClientsForUser(userId);
    const order = await this.orderRepository.findOne({ where: { Id: id } });

    if (!order) {
      throw new NotFoundException([`Order with ID ${id} not found`]);
    }

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(order.ClientId)) {
      throw new BadRequestException(
        `You are not assigned to the client with ID ${order.ClientId}`,
      );
    }

    const orderItems = await this.orderItemRepository.find({
      where: { OrderId: id },
    });
    const orderItemIds = orderItems.map((item) => item.Id);

    if (orderItemIds.length > 0) {
      await this.orderItemsPrintingOptionRepository.delete({
        OrderItemId: In(orderItemIds),
      });

      await this.orderItemDetailRepository.delete({
        OrderItemId: In(orderItemIds),
      });
    }

    await this.orderItemRepository.delete({ OrderId: id });

    await this.orderRepository.delete(id);
  }

  async getOrderStatusLog(
    orderId: number,
  ): Promise<Omit<OrderStatusLogs, 'Id' | 'UpdatedOn'>[]> {
    const orderStatusLogs = await this.orderStatusLogRepository
      .createQueryBuilder('orderStatusLog')
      .leftJoin('orderstatus', 'status', 'orderStatusLog.StatusId = status.Id')
      .select([
        'status.Id As StatusId',
        'status.StatusName AS StatusName',
        'orderStatusLog.CreatedOn AS Timestamp',
      ])
      .where('orderStatusLog.OrderId = :orderId', { orderId })
      .getRawMany();
    return orderStatusLogs.map(({ id, UpdatedOn, ...rest }) => rest);
  }

  async getEditOrder(id: number, userId: number): Promise<any> {
    try {
      // Fetch order main data
      const assignedClientIds = await this.getClientsForUser(userId);

      let query = this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('client', 'client', 'order.ClientId = client.Id')
        .leftJoin('clientevent', 'event', 'order.OrderEventId = event.Id')
        .leftJoin('orderstatus', 'status', 'order.OrderStatusId = status.Id')
        .select([
          'order.Id AS Id',
          'order.ClientId AS ClientId',
          'order.OrderShipmentStatus AS OrderShipmentStatus',
          'client.Name AS ClientName',
          'order.OrderEventId AS OrderEventId',
          'event.EventName AS EventName',
          'order.Description AS Description',
          'order.OrderStatusId AS OrderStatusId',
          'status.StatusName AS StatusName',
          'order.Deadline AS Deadline',
          'order.OrderPriority AS OrderPriority',
          'order.OrderNumber AS OrderNumber',
          'order.OrderName AS OrderName',
          'order.ExternalOrderId AS ExternalOrderId',
        ])
        .where('order.Id = :id', { id });

      // 🚨 Restrict access if user has assigned clients
      if (assignedClientIds.length > 0) {
        query = query.andWhere('order.ClientId IN (:...assignedClientIds)', {
          assignedClientIds,
        });
      }

      const orderData = await query.getRawOne();

      if (!orderData) {
        throw new NotFoundException([`Order with ID ${id} not found`]);
      }

      // Fetch order items with details, printing options, size option, and measurement name
      const orderItemsData = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .leftJoin('product', 'product', 'orderItem.ProductId = product.Id')
        .leftJoin(
          'productcategory',
          'productCategory',
          'product.ProductCategoryId = productCategory.Id',
        )
        .leftJoin(
          'fabrictype',
          'fabricType',
          'product.FabricTypeId = fabricType.Id',
        )
        .leftJoin(
          'orderitemsprintingoptions',
          'printingOption',
          'orderItem.Id = printingOption.OrderItemId',
        )
        .leftJoin(
          'printingoptions',
          'printingoptions',
          'printingOption.PrintingOptionId = printingoptions.Id',
        )
        .leftJoin(
          'orderitemdetails',
          'orderItemDetail',
          'orderItem.Id = orderItemDetail.OrderItemId',
        )
        .leftJoin(
          'availablecoloroptions',
          'availablecoloroptions',
          'orderItemDetail.ColorOptionId = availablecoloroptions.Id',
        )
        .leftJoin(
          'coloroption',
          'colorOption',
          'availablecoloroptions.colorId = colorOption.Id',
        )
        // SizeOption joins
        // .leftJoin('availblesizeoptions', 'availableSizeOption', 'orderItemDetail.SizeOption = availableSizeOption.Id')
        .leftJoin(
          'sizeoptions',
          'sizeOption',
          'orderItemDetail.SizeOption = sizeOption.Id',
        )
        // Measurement join
        .leftJoin(
          'sizemeasurements',
          'sizeMeasurement',
          'orderItemDetail.MeasurementId = sizeMeasurement.Id',
        )
        .leftJoin('document', 'imageDoc', 'orderItem.ImageId = imageDoc.Id')
        .leftJoin('document', 'fileDoc', 'orderItem.FileId = fileDoc.Id')
        .leftJoin('document', 'videoDoc', 'orderItem.VideoId = videoDoc.Id')
        .select([
          'orderItem.Id AS Id',
          'orderItem.ProductId AS ProductId',
          'product.ProductCategoryId AS ProductCategoryId',
          'product.Name AS ProductName',
          'productCategory.Type AS ProductCategoryName',
          'product.FabricTypeId AS FabricTypeId',
          'fabricType.Type AS ProductFabricType',
          'fabricType.Name AS ProductFabricName',
          'fabricType.GSM AS ProductFabricGSM',
          'orderItem.Description AS Description',
          'orderItem.itemShipmentStatus AS ItemShipmentStatus',
          'orderItem.OrderItemPriority AS OrderItemPriority',
          'orderItem.ImageId AS ImageId',
          'imageDoc.CloudPath AS ImagePath',
          'orderItem.FileId AS FileId',
          'fileDoc.CloudPath AS FilePath',
          'orderItem.VideoId AS VideoId',
          'videoDoc.CloudPath AS VideoPath',
          'printingOption.PrintingOptionId AS PrintingOptionId',
          'printingOption.Description AS PrintingOptionDescription',
          'printingoptions.Type AS PrintingOptionName',
          'orderItemDetail.Id AS OrderItemDetailId',
          'orderItemDetail.ColorOptionId AS ColorOptionId',
          'colorOption.Name AS ColorOptionName',
          'colorOption.HexCode AS ColorHexCode',
          'orderItemDetail.Quantity AS Quantity',
          'orderItemDetail.Priority AS Priority',
          'orderItemDetail.SizeOption AS SizeOptionId',
          'orderItemDetail.MeasurementId AS MeasurementId',
          'sizeOption.OptionSizeOptions AS SizeOptionName',
          'sizeMeasurement.Measurement1 AS MeasurementName', // added MeasurementName
        ])
        .where('orderItem.OrderId = :orderId', { orderId: id })
        .getRawMany();

      const processedItems = [];
      const itemMap = new Map();

      for (const item of orderItemsData) {
        if (!itemMap.has(item.Id)) {
          const newItem = {
            Id: item.Id,
            ItemShipmentStatus: item?.ItemShipmentStatus as OrderItemShipmentEnum,
            ProductId: item.ProductId,
            ProductName: item.ProductName || '',
            ProductCategoryId: item.ProductCategoryId,
            ProductCategoryName: item.ProductCategoryName,
            ProductFabricType: item.ProductFabricType,
            ProductFabricName: item.ProductFabricName,
            ProductFabricGSM: item.ProductFabricGSM,
            Description: item?.Description ?? null,
            OrderNumber: orderData.OrderNumber,
            OrderName: orderData.OrderName,
            ExternalOrderId: orderData.ExternalOrderId,
            OrderItemPriority: item?.OrderItemPriority || 0,
            ImageId: item.ImageId,
            ImagePath: item.ImagePath,
            FileId: item.FileId,
            FilePath: item.FilePath,
            VideoId: item.VideoId,
            VideoPath: item.VideoPath,
            printingOptions: [],
            orderItemDetails: [],
            _printingOptionIds: new Set<number>(), // helper sets to track
            _orderItemDetailIds: new Set<number>(),
          };

          itemMap.set(item.Id, newItem);
          processedItems.push(newItem);
        }

        const currentItem = itemMap.get(item.Id);
        // Handle printing options
        if (
          item.PrintingOptionId &&
          !currentItem._printingOptionIds.has(item.PrintingOptionId)
        ) {
          currentItem.printingOptions.push({
            PrintingOptionId: item.PrintingOptionId,
            PrintingOptionName:
              item.PrintingOptionName ?? 'Unknown printing option',
            Description: item.PrintingOptionDescription,
          });
          currentItem._printingOptionIds.add(item.PrintingOptionId);
        }

        if (
          item.OrderItemDetailId &&
          !currentItem._orderItemDetailIds.has(item.OrderItemDetailId)
        ) {
          currentItem.orderItemDetails.push({
            ColorOptionId: item?.ColorOptionId ?? null,
            ColorOptionName: item?.ColorOptionName || 'Unknown Color',
            HexCode: item.ColorHexCode,
            Quantity: item.Quantity,
            Priority: item.Priority,
            SizeOptionId: item?.SizeOptionId ?? null,
            SizeOptionName: item?.SizeOptionName || 'Unknown Size',
            MeasurementId: item?.MeasurementId ?? null,
            MeasurementName: item?.MeasurementName || 'Unknown Measurement',
          });
          currentItem._orderItemDetailIds.add(item.OrderItemDetailId);
        }
      }
      for (const item of processedItems) {
        delete item._printingOptionIds;
        delete item._orderItemDetailIds;
      }

      return {
        Id: orderData.Id,
        OrderShipmentStatus: orderData?.OrderShipmentStatus as OrderItemShipmentEnum,
        ClientId: orderData.ClientId,
        ClientName: orderData.ClientName || 'Unknown Client',
        OrderEventId: orderData?.OrderEventId ?? null,
        EventName: orderData.EventName || '---',
        OrderPriority: orderData.OrderPriority,
        Description: orderData.Description,
        OrderNumber: orderData.OrderNumber,
        OrderName: orderData.OrderName,
        ExternalOrderId: orderData.ExternalOrderId,
        OrderStatusId: orderData.OrderStatusId,
        StatusName: orderData.StatusName || 'Unknown Status',
        Deadline: orderData.Deadline,
        items: processedItems,
      };
    } catch (error) {
      console.error('Error in getEditOrder:', error);
      throw error;
    }
  }

  async getOrderItemsByOrderId(orderId: number): Promise<any> {
    const orderItems = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('product', 'product', 'orderItem.ProductId = product.Id')
      .leftJoin('document', 'imageDoc', 'orderItem.ImageId = imageDoc.Id')
      .leftJoin('document', 'fileDoc', 'orderItem.FileId = fileDoc.Id')
      .leftJoin('document', 'videoDoc', 'orderItem.VideoId = videoDoc.Id')
      .leftJoin('orderitemsprintingoptions', 'printingOption', 'orderItem.Id = printingOption.OrderItemId')
      .leftJoin('printingoptions', 'printingoptions', 'printingOption.PrintingOptionId = printingoptions.Id')
      .leftJoin('orderitemdetails', 'orderitemdetails', 'orderItem.Id = orderitemdetails.OrderItemId')
      .leftJoin('availablecoloroptions', 'availablecoloroptions', 'orderitemdetails.ColorOptionId = availablecoloroptions.Id')
      .leftJoin('coloroption', 'colorOption', 'availablecoloroptions.colorId = colorOption.Id',)
      // New joins for size option name
      // .leftJoin('availblesizeoptions', 'availableSizeOption', 'orderitemdetails.SizeOption = availableSizeOption.Id')
      .leftJoin('sizeoptions', 'sizeOption', 'orderitemdetails.SizeOption = sizeOption.Id')
      // New join for measurement name
      .leftJoin('sizemeasurements', 'sizeMeasurement', 'orderitemdetails.MeasurementId = sizeMeasurement.Id')
      .select([
        'orderItem.Id AS Id',
        'orderItem.OrderId AS OrderId',
        'orderItem.ProductId AS ProductId',
        'orderItem.Description AS Description',
        'orderItem.ImageId AS ImageId',
        'orderItem.FileId AS FileId',
        'orderItem.VideoId AS VideoId',
        'orderItem.CreatedOn AS CreatedOn',
        'orderItem.UpdatedOn AS UpdatedOn',
        'orderItem.OrderItemPriority AS OrderItemPriority',
        'orderItem.ItemShipmentStatus AS ItemShipmentStatus',
        'product.Name AS ProductName',
        'printingOption.Id AS PrintingOptionId',
        'printingOption.PrintingOptionId AS PrintingOptionId',
        'printingOption.Description AS PrintingOptionDescription',
        'printingoptions.Type AS PrintingOptionName',
        'orderitemdetails.ColorOptionId AS ColorOptionId',
        'colorOption.Name AS ColorName',
        'colorOption.HexCode AS ColorHexCode',
        'orderitemdetails.Quantity AS OrderItemDetailQuanity',
        'orderitemdetails.Priority AS OrderItemDetailPriority',
        'orderitemdetails.SizeOption AS SizeOptionId',
        'sizeOption.OptionSizeOptions AS SizeOptionName',
        'orderitemdetails.MeasurementId AS MeasurementId',
        'sizeMeasurement.Measurement1 AS MeasurementName',
        'videoDoc.CloudPath AS VideoPath',
        'imageDoc.CloudPath AS ImagePath',
        'fileDoc.CloudPath AS FilePath',
      ])
      .where('orderItem.OrderId = :orderId', { orderId })
      .getRawMany();

    if (!orderItems || orderItems.length === 0) {
      return [];
    }

    const formattedItems = orderItems.reduce((acc, item) => {
      const existingItem = acc.find((orderItem) => orderItem.Id === item.Id);

      if (existingItem) {
        if (
          !existingItem.printingOptions.some(
            (po) => po.PrintingOptionId === item.PrintingOptionId,
          )
        ) {
          existingItem.printingOptions.push({
            PrintingOptionId: item.PrintingOptionId,
            PrintingOptionName: item.PrintingOptionName,
            Description: item.PrintingOptionDescription,
          });
        }

        if (
          !existingItem.colors.some(
            (c) => c.ColorOptionId === item.ColorOptionId,
          )
        ) {
          existingItem.colors.push({
            ColorOptionId: item?.ColorOptionId ?? null,
            ColorName: item?.ColorName ?? 'Unknown color',
            HexCode: item?.ColorHexCode ?? null,
            Quantity: item.OrderItemDetailQuanity,
            Priority: item.OrderItemDetailPriority,
            SizeOptionId: item?.SizeOptionId ?? null,
            SizeOptionName: item?.SizeOptionName || 'Unknown Size',
            MeasurementId: item?.MeasurementId ?? null,
            MeasurementName: item?.MeasurementName || 'Unknown Measurement',
          });
        }
      } else {
        acc.push({
          Id: item.Id,
          OrderId: item.OrderId,
          ProductId: item.ProductId,
          ProductName: item.ProductName || '',
          Description: item?.Description ?? null,
          OrderItemPriority: item.OrderItemPriority || 0,
          ItemShipmentStatus: item?.ItemShipmentStatus ?? null,
          ImageId: item.ImageId,
          ImagePath: item.ImagePath,
          FileId: item.FileId,
          FilePath: item.FilePath,
          VideoId: item.VideoId,
          VideoPath: item.VideoPath,
          CreatedOn: item.CreatedOn,
          UpdatedOn: item.UpdatedOn,
          printingOptions: item.PrintingOptionId
            ? [
              {
                PrintingOptionId: item.PrintingOptionId,
                PrintingOptionName: item.PrintingOptionName,
                Description: item.PrintingOptionDescription,
              },
            ]
            : [],
          colors: item?.ColorOptionId
            ? [
              {
                ColorOptionId: item?.ColorOptionId ?? null,
                ColorName: item?.ColorName ?? 'Unknown color',
                HexCode: item?.ColorHexCode ?? null,
                Quantity: item.OrderItemDetailQuanity,
                Priority: item.OrderItemDetailPriority,
                SizeOptionId: item?.SizeOptionId ?? null,
                SizeOptionName: item?.SizeOptionName || 'Unknown Size',
                MeasurementId: item?.MeasurementId ?? null,
                MeasurementName:
                  item?.MeasurementName || 'Unknown Measurement',
              },
            ]
            : [],
        });
      }

      return acc;
    }, []);

    return formattedItems;
  }

  async updateOrderStatus(id: number, status: number, userId: number): Promise<Order> {
    
    const assignedClientIds = await this.getClientsForUser(userId);

    const order = await this.orderRepository.findOne({ where: { Id: id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (assignedClientIds.length > 0 && !assignedClientIds.includes(order.ClientId)) {
      throw new BadRequestException(
        `You are not assigned to the client with ID ${order.ClientId}`,
      );
    }

    const OrderStatus = await this.orderStatusRepository.findOne({
      where: {
        Id: status,
      },
    });

    if (!OrderStatus) {
      throw new NotFoundException(`Order Staus ID ${status} not found`);
    }
    order.OrderStatusId = status;

    const statusLog = this.orderStatusLogRepository.create({
      Order: order,
      Status: OrderStatus,
    });
    await this.orderStatusLogRepository.save(statusLog);

    return await this.orderRepository.save(order);
  }

  async getOrderItemsByOrderIds(orderIds: number[]): Promise<any[]> {
    const items = await this.orderItemRepository.find({
      where: { OrderId: In(orderIds) },
      relations: ['product'],
      order: { CreatedOn: 'DESC' },
    });

    return items.map(item => ({
      Id: item.Id,
      Name: item.product.Name,
    }));
  }

  async createManyChecklist(
    orderItemId: number,
    dtos: CreateQualityCheckDto[],
    createdBy: string,
  ): Promise<OrderQualityCheck[]> {
    if (!dtos || dtos.length === 0) {
      return [];
    }

    const hasProductIds = dtos.some((d) => d.productId);
    const hasMeasurementIds = dtos.some((d) => d.measurementId);

    if (hasProductIds && hasMeasurementIds) {
      throw new BadRequestException(
        'You cannot mix productId and measurementId in the same request.',
      );
    }

    if (hasProductIds) {
      const productIds = dtos.map((d) => d.productId).filter(Boolean);
      await this.qualityCheckRepo.delete({
        orderItemId,
        productId: In(productIds),
      });
    } else if (hasMeasurementIds) {
      const measurementIds = dtos.map((d) => d.measurementId).filter(Boolean);
      await this.qualityCheckRepo.delete({
        orderItemId,
        measurementId: In(measurementIds),
      });
    } else {
      await this.qualityCheckRepo.delete({ orderItemId });
    }

    const entities = dtos.map((item) =>
      this.qualityCheckRepo.create({
        orderItemId,
        productId: item.productId ?? null,
        measurementId: item.measurementId ?? null,
        parameter: item.parameter,
        expected: item.expected ?? null,
        observed: item.observed,
        remarks: item.remarks ?? null,
        createdBy,
      }),
    );

    return await this.qualityCheckRepo.save(entities);
  }

  async getQaChecklist(
    orderItemId: number,
    productId?: number,
    measurementId?: number,
  ): Promise<OrderQualityCheck[]> {
    const query = this.qualityCheckRepo
      .createQueryBuilder('qc')
      .where('qc.orderItemId = :orderItemId', { orderItemId });

    if (productId) {
      query.andWhere('qc.productId = :productId', { productId });
    }

    if (measurementId) {
      query.andWhere('qc.measurementId = :measurementId', { measurementId });
    }

    return await query.getMany();
  }

  async createChecklistForOrderItem(
    orderItemId: number,
    createdBy: string,
  ): Promise<OrderQualityCheck[]> {
    // 1️⃣ Fetch OrderItem
    const orderItem = await this.orderItemRepository.findOne({
      where: { Id: orderItemId },
    });

    if (!orderItem) {
      throw new NotFoundException('OrderItem not found');
    }

    const productId = orderItem.ProductId;

    const entities: OrderQualityCheck[] = [];

    // 2️⃣ --- Product QA checklist ---
    const qaChecklist = await this.qAChecklistRepository.find({
      where: { productId },
    });

    if (qaChecklist && qaChecklist.length > 0) {
      // Delete existing QA for this product
      await this.qualityCheckRepo.delete({ orderItemId, productId });

      qaChecklist.forEach((qa) => {
        entities.push(
          this.qualityCheckRepo.create({
            orderItemId,
            productId,
            measurementId: null,
            parameter: qa.name,
            expected: null,
            observed: null,
            remarks: null,
            createdBy,
          }),
        );
      });
    }

    const orderItemDetails = await this.orderItemDetailRepository.find({
      where: { OrderItemId: orderItemId },
    });

    const measurementIds = [
      ...new Set(orderItemDetails.map((d) => d.MeasurementId)),
    ];

    if (measurementIds.length > 0) {
      const sizeMeasurements = await this.sizeMeasurementRepository.findBy({
        Id: In(measurementIds),
      });

      const parameterLabels: Record<string, string> =  {
        Measurement1: "Measurement",
        FrontLengthHPS: "Front Length (HPS)",
        BackLengthHPS: "Back Length (HPS)",
        AcrossShoulders: "Across Shoulders",
        ArmHole: "Arm Hole",
        UpperChest: "Upper Chest",
        LowerChest: "Lower Chest",
        Waist: "Waist",
        BottomWidth: "Bottom Width",
        SleeveLength: "Sleeve Length",
        SleeveOpening: "Sleeve Opening",
        NeckSize: "Neck Size",
        CollarHeight: "Collar Height",
        CollarPointHeight: "Collar Point Height",
        StandHeightBack: "Stand Height Back",
        CollarStandLength: "Collar Stand Length",
        SideVentFront: "Side Vent Front",
        SideVentBack: "Side Vent Back",
        PlacketLength: "Placket Length",
        TwoButtonDistance: "Two Button Distance",
        PlacketWidth: "Placket Width",
        BackNeckDrop: "Back Neck Drop",
        FrontNeckDrop: "Front Neck Drop",
        ShoulderSeam: "Shoulder Seam",
        ShoulderSlope: "Shoulder Slope",
        Hem: "Hem",
        Neckwidth: "Neck Width",
        CollarOpening: "Collar Opening",
        ArmHoleStraight: "Arm Hole Straight",
        BottomRib: "Bottom Rib",
        CuffHeight: "Cuff Height",
        ColllarHeightCenterBack: "Collar Height Center Back",
        BottomHem: "Bottom Hem",
        Inseam: "Inseam",
        Hip: "Hip",
        FrontRise: "Front Rise",
        LegOpening: "Leg Opening",
        KneeWidth: "Knee Width",
        Outseam: "Outseam",
        bFrontRise: "Back Front Rise",
        WasitStretch: "Waist Stretch",
        WasitRelax: "Waist Relax",
        Thigh: "Thigh",
        BackRise: "Back Rise",
        TotalLength: "Total Length",
        WBHeight: "Waistband Height",
        bBottomWidth: "Back Bottom Width",
        BottomOriginal: "Bottom Original",
        BottomElastic: "Bottom Elastic",
        BottomCuffZipped: "Bottom Cuff Zipped",
        BottomStraightZipped: "Bottom Straight Zipped",
        HemBottom: "Hem Bottom",
        t_TopRight: "Top Logo - Top Right",
        t_TopLeft: "Top Logo - Top Left",
        t_BottomRight: "Top Logo - Bottom Right",
        t_BottomLeft: "Top Logo - Bottom Left",
        t_Center: "Top Logo - Center",
        t_Back: "Top Logo - Back",
        b_TopRight: "Bottom Logo - Top Right",
        b_TopLeft: "Bottom Logo - Top Left",
        b_BottomRight: "Bottom Logo - Bottom Right",
        b_BottomLeft: "Bottom Logo - Bottom Left",
        t_left_sleeve: "Logo - Left Sleeve",
        t_right_sleeve: "Logo - Right Sleeve",
        H_VisorLength: "Visor Length",
        H_VisorWidth: "Visor Width",
        H_CrownCircumference: "Crown Circumference",
        H_FrontSeamLength: "Front Seam Length",
        H_BackSeamLength: "Back Seam Length",
        H_RightCenterSeamLength: "Right Center Seam Length",
        H_LeftCenterSeamLength: "Left Center Seam Length",
        H_ClosureHeightIncludingStrapWidth: "Hat Closure Height + Strap Width",
        H_StrapWidth: "Strap Width",
        H_StrapbackLength: "Strapback Length",
        H_SweatBandWidth: "Sweat Band Width",
        H_PatchSize: "Patch Size",
        H_PatchPlacement: "Patch Placement"
      };;


      for (const sm of sizeMeasurements) {
        await this.qualityCheckRepo.delete({ orderItemId, measurementId: sm?.Id });

        const parameters = Object.keys(parameterLabels);

        parameters.forEach((col) => {
          const value = sm[col as keyof typeof sm] ?? null;

          if (value != null && value != 0.0) {
            entities.push(
              this.qualityCheckRepo.create({
                orderItemId,
                productId: null,
                measurementId: sm?.Id,
                parameter: parameterLabels[col] || col,
                expected: value?.toString() ?? null,
                observed: null,
                remarks: null,
                createdBy,
                createdOn: new Date(),
              }),
            );
          }
        });
      }
    }
    return await this.qualityCheckRepo.save(entities);
  }

  private templateCache: Handlebars.TemplateDelegate | null = null;

  private async loadTemplate(): Promise<Handlebars.TemplateDelegate> {
    if (this.templateCache) return this.templateCache;
    const templatePath = path.join(process.cwd(), 'pdf-templates', 'checklist.html');
    const html = await fs.readFile(templatePath, 'utf-8');
    this.templateCache = Handlebars.compile(html, { noEscape: true });
    return this.templateCache;
  }

  async generateChecklistZip(orderId: number): Promise<{ filename: string; file: StreamableFile }> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndMapOne('orderItem.product', 'product', 'product', 'product.Id = orderItem.ProductId') // manual product join
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.event', 'event')
      .leftJoinAndSelect('order.status', 'status')
      .where('order.Id = :orderId', { orderId })
      .getOne();

    if (!order) throw new NotFoundException('Order not found');

    const template = await this.loadTemplate();
    const zipDisplayName = `order-${order.OrderNumber}-checklists.zip`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qa-checklists-'));
    const zipPath = path.join(tempDir, zipDisplayName);
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    const finalizeZip = new Promise<void>((resolve, reject) => {
      output.on('finish', resolve);
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
      archive.pipe(output);
    });

    for (const item of order.orderItems ?? []) {
      let checklist = await this.getQaChecklist(item.Id);

      if (!checklist || checklist.length === 0) {
        await this.createChecklistForOrderItem(item.Id, 'system');
        checklist = await this.getQaChecklist(item.Id);
      }

      const details = await this.orderItemDetailRepository
        .createQueryBuilder('detail')
        .select('detail.measurementId', 'measurementId')
        .addSelect('SUM(detail.Quantity)', 'totalQuantity')
        .where('detail.orderItemId = :orderItemId', { orderItemId: item.Id })
        .groupBy('detail.measurementId')
        .getRawMany<{ measurementId: number; totalQuantity: string }>();

      const quantityMap = details.reduce((acc, d) => {
        acc[d.measurementId] = Number(d.totalQuantity);
        return acc;
      }, {} as Record<number, number>);

      const totalForItem = Object.values(quantityMap).reduce((sum, q) => sum + q, 0);

      const grouped = checklist.reduce((acc, row) => {
        const key = row.measurementId ?? 'none';
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {} as Record<string, any[]>);

      const measurementGroups = Object.entries(grouped)
        .filter(([key]) => key !== 'none')
        .map(([measurementId, rows]) => {
          const labelRow = rows.find(r => r.parameter === 'Measurement');
          const name = labelRow?.expected ?? `measurement${measurementId}`;
          const filteredRows = rows.filter(r => r.parameter !== 'Measurement');
          return { name, rows: filteredRows, totalQuantity: quantityMap[Number(measurementId)] ?? 0 };
        });
      const genericChecks = grouped['none'] ?? [];
      const vm = {
        order: {
          OrderNumber: order.OrderNumber,
          ClientName: order.client?.Name,
          EventName: order.event?.EventName,
          StatusName: order.status?.StatusName,
          ProductName: item.product?.Name,
          TotalQuantity: totalForItem,
        },
        item: {
          Id: item.Id,
          ProductId: item.ProductId,
          measurementGroups,
          genericChecks,
        },
      };

      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (req.url().startsWith('http')) return req.abort();
        req.continue();
      });

      const html = template(vm);
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
      });

      const filename = `order-${order.OrderNumber}-item-${item.Id}-checklist.pdf`;
      archive.append(Buffer.from(pdfBuffer), { name: filename });
      await page.close();
    }

    await archive.finalize();
    await finalizeZip;

    const zipRead = createReadStream(zipPath);
    const file = new StreamableFile(zipRead, {
      type: 'application/zip',
      disposition: `attachment; filename="${zipDisplayName}"`,
    });

    await browser.close();
    setTimeout(() => fs.rm(tempDir, { recursive: true, force: true }).catch(() => { }), 2000);

    return { filename: zipDisplayName, file };
  }

  async generateChecklistZipForItems(
    orderId: number,
    itemIds: number[],
  ): Promise<{ filename: string; file: StreamableFile }> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndMapOne('orderItem.product', 'product', 'product', 'product.Id = orderItem.ProductId')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.event', 'event')
      .leftJoinAndSelect('order.status', 'status')
      .where('order.Id = :orderId', { orderId })
      .getOne();
    if (!order) throw new NotFoundException('Order not found');

    const itemsToProcess = (order.orderItems ?? []).filter(i => itemIds?.includes(i.Id));
    if (!itemsToProcess.length) {
      console.log(order);
      throw new NotFoundException('No matching order items found for provided IDs');
    }

    const template = await this.loadTemplate();
    const zipDisplayName = `order-${order.OrderNumber}-checklists.zip`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qa-checklists-'));
    const zipPath = path.join(tempDir, zipDisplayName);
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    const finalizeZip = new Promise<void>((resolve, reject) => {
      output.on('finish', resolve);
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
      archive.pipe(output);
    });

    for (const item of itemsToProcess) {
      let checklist = await this.getQaChecklist(item.Id);

      if (!checklist || checklist.length === 0) {
        await this.createChecklistForOrderItem(item.Id, 'system');
        checklist = await this.getQaChecklist(item.Id);
      }

      const details = await this.orderItemDetailRepository
        .createQueryBuilder('detail')
        .select('detail.measurementId', 'measurementId')
        .addSelect('SUM(detail.Quantity)', 'totalQuantity')
        .where('detail.orderItemId = :orderItemId', { orderItemId: item.Id })
        .groupBy('detail.measurementId')
        .getRawMany<{ measurementId: number; totalQuantity: string }>();

      const quantityMap = details.reduce((acc, d) => {
        acc[d.measurementId] = Number(d.totalQuantity);
        return acc;
      }, {} as Record<number, number>);

      const totalForItem = Object.values(quantityMap).reduce((sum, q) => sum + q, 0);

      const grouped = checklist.reduce((acc, row) => {
        const key = row.measurementId ?? 'none';
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {} as Record<string, any[]>);

      const measurementGroups = Object.entries(grouped)
        .filter(([key]) => key !== 'none')
        .map(([measurementId, rows]) => {
          // Find the "Measurement1" row
          const labelRow = rows.find(r => r.parameter === 'Measurement');

          // Use its expected value as the group name
          const name = labelRow?.expected ?? `measurement${measurementId}`;

          // Exclude the "Measurement1" row from the actual rows
          const filteredRows = rows.filter(r => r.parameter !== 'Measurement');

          return { name, rows: filteredRows, totalQuantity: quantityMap[Number(measurementId)] ?? 0 };
        });

      // Generic checks (measurementId null/none)
      const genericChecks = grouped['none'] ?? [];
      const vm = {
        order: {
          OrderNumber: order.OrderNumber,
          ClientName: order.client?.Name,
          EventName: order.event?.EventName,
          ProductName: item.product?.Name,
          StatusName: order.status?.StatusName,
          TotalQuantity: totalForItem,
        },
        item: {
          Id: item.Id,
          ProductId: item.ProductId,
          measurementGroups,
          genericChecks,
        },
      };

      const page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (req.url().startsWith('http')) return req.abort();
        req.continue();
      });

      const html = template(vm);
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
      });

      const filename = `order-${order.OrderNumber}-item-${item.Id}-checklist.pdf`;
      archive.append(Buffer.from(pdfBuffer), { name: filename });
      await page.close();
    }

    await archive.finalize();
    await finalizeZip;

    const zipRead = createReadStream(zipPath);
    const file = new StreamableFile(zipRead, {
      type: 'application/zip',
      disposition: `attachment; filename="${zipDisplayName}"`,
    });

    await browser.close();
    setTimeout(() => fs.rm(tempDir, { recursive: true, force: true }).catch(() => { }), 2000);

    return { filename: zipDisplayName, file };
  }

}
