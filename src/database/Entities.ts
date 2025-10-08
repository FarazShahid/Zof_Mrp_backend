import { AuditLog } from "src/audit-logs/audit-log.entity";
import { Client } from "src/clients/entities/client.entity";
import { ColorOption } from "src/coloroption/_/color-option.entity";
import { ClientEvent } from "src/events/entities/clientevent.entity";
import { FabricType } from "src/fabrictype/_/fabrictype.entity";
import { InventoryCategories } from "src/inventory-categories/_/inventory-categories.entity";
import { InventoryItems } from "src/inventory-items/_/inventory-items.entity";
import { InventorySubCategories } from "src/inventory-sub-categories/_/inventory-sub-categories.entity";
import { InventorySuppliers } from "src/inventory-suppliers/_/inventory-suppliers.entity";
import { InventoryTransactions } from "src/inventory-transections/_/inventory-transections.entity";
import { UnitOfMeasures } from "src/inventory-unit-measures/_/inventory-unit-measures.entity";
import { DocumentEntity } from "src/media-handlers/_/document.entity";
import { MediaLink } from "src/media-link/_/media-link.entity";
import { Media } from "src/media/_/media.entity";
import { OrderQualityCheck } from "src/orders/entities/order-checklist.entity";
import { OrderItemDetails } from "src/orders/entities/order-item-details";
import { OrderItemsPrintingOption } from "src/orders/entities/order-item-printiing.option.entity";
import { OrderItem } from "src/orders/entities/order-item.entity";
import { OrderStatusLogs } from "src/orders/entities/order-status-log.entity";
import { Order } from "src/orders/entities/orders.entity";
import { OrderStatus } from "src/orderstatus/entities/orderstatus.entity";
import { PrintingOptions } from "src/printingoptions/entities/printingoptions.entity";
import { ProductCategory } from "src/product-category/entities/product-category.entity";
import { ProductCutOption } from "src/productcutoptions/entity/productcutoptions.entity";
import { ProductRegionStandard } from "src/productregionstandard/_/product-region-standard.entity";
import { AvailableColorOption } from "src/products/entities/available-color-options.entity";
import { AvailbleSizeOptions } from "src/products/entities/available-size-options";
import { ProductPrintingOptions } from "src/products/entities/product-printing-options.entity";
import { Product, Productdetails } from "src/products/entities/product.entity";
import { QAChecklist } from "src/products/entities/qa-checklist.entity";
import { ShipmentCarrier } from "src/shipment-carrier/entities/shipment-carrier.entity";
import { ShipmentBox, ShipmentBoxItem } from "src/shipment/entities/shipment-box.entity";
import { ShipmentOrder } from "src/shipment/entities/shipment-order.entity";
import { Shipment } from "src/shipment/entities/shipment.entity";
import { SizeMeasurement } from "src/size-measurements/entities/size-measurement.entity";
import { SizeOption } from "src/sizeoptions/entities/sizeoptions.entity";
import { SleeveType } from "src/sleeve-type/entities/sleeve-type.entity/sleeve-type.entity";
import { ClientAssociate, ClientStatus } from "src/unused-entities/client";
import { DocStatus, DocType } from "src/unused-entities/document";
import { InventoryBillOfMaterial } from "src/unused-entities/inventory";
import { OrderCategory, OrderDoc, OrderEvent, OrderService, OrderServicesMedia, OrderServicesOption, OrderServiceUnits, OrderType } from "src/unused-entities/order";
import { ProductionConsumption, ProductionOrder } from "src/unused-entities/product";
import { User } from "src/users/entities/user.entity";
import { AppRole, AppRights, AppRoleRight } from "src/roles-rights/roles.rights.entity";
export const ENTITIES = [
    AuditLog,
    AvailableColorOption,
    AvailbleSizeOptions,
    Client,
    ClientEvent,
    ColorOption,
    DocumentEntity,
    FabricType,
    InventoryCategories,
    InventoryItems,
    InventorySubCategories,
    InventorySuppliers,
    InventoryTransactions,
    Media,
    MediaLink,
    OrderItemDetails,
    OrderItem,
    OrderItemsPrintingOption,
    OrderQualityCheck,
    Order,
    OrderStatus,
    OrderStatusLogs,
    PrintingOptions,
    Product,
    ProductCategory,
    ProductCutOption,
    Productdetails,
    ProductPrintingOptions,
    ProductRegionStandard,
    QAChecklist,
    Shipment,
    ShipmentBox,
    ShipmentBoxItem,
    ShipmentCarrier,
    ShipmentOrder,
    SizeMeasurement,
    SizeOption,
    SleeveType,
    UnitOfMeasures,
    User,
    //Unsed Entities
    ProductionOrder,
    ProductionConsumption,
    OrderCategory,
    OrderDoc,
    OrderEvent,
    OrderService,
    OrderServicesMedia,
    OrderServicesOption,
    OrderServiceUnits,
    OrderType,
    InventoryBillOfMaterial,
    DocStatus,
    DocType,
    ClientStatus,
    ClientAssociate,
    AppRole,
    AppRights,
    AppRoleRight
]