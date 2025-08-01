------------ShipmentCarriers---------

CREATE TABLE `ShipmentCarriers` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(100) NOT NULL,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(100) DEFAULT NULL,
  `updatedOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



-- -- Create Shipment Table --
-- CREATE TABLE `Shipment` (
--   `Id` INT NOT NULL AUTO_INCREMENT,
--   `ShipmentCode` VARCHAR(255) NOT NULL,
--   `OrderId` INT NOT NULL,
--   `ShipmentCarrierId` INT NOT NULL,
--   `ShipmentDate` TIMESTAMP NOT NULL,
--   `ShipmentCost` DECIMAL(10,2) NOT NULL,
--   `TotalWeight` FLOAT NOT NULL,
--   `NumberOfBoxes` INT NOT NULL,
--   `WeightUnit` VARCHAR(255) NOT NULL,
--   `ReceivedTime` TIMESTAMP NULL DEFAULT NULL,
--   `Status` ENUM('Pending', 'Awaiting Pickup', 'Picked Up', 'Dispatched', 'In Transit', 'Arrived at Hub', 'Customs Hold', 'Customs Cleared', 'Delayed', 'Out for Delivery', 'Delivery Attempt Failed', 'Delivered', 'Returned to Sender', 'Cancelled', 'Lost', 'Damaged') NOT NULL,
--   `CreatedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   `CreatedBy` VARCHAR(255) DEFAULT NULL,
--   `UpdatedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `UpdatedBy` VARCHAR(255) DEFAULT NULL,
--   PRIMARY KEY (`Id`),
--   KEY `OrderId_idx` (`OrderId`),
--   KEY `ShipmentCarrierId_idx` (`ShipmentCarrierId`),
--   CONSTRAINT `fk_shipment_order` FOREIGN KEY (`OrderId`) REFERENCES `Orders`(`Id`) ON DELETE CASCADE,
--   CONSTRAINT `fk_shipment_carrier` FOREIGN KEY (`ShipmentCarrierId`) REFERENCES `ShipmentCarriers`(`Id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- -- Create ShipmentBox Table --
-- CREATE TABLE `ShipmentBox` (
--   `Id` INT NOT NULL AUTO_INCREMENT,
--   `ShipmentId` INT NOT NULL,
--   `Weight` FLOAT NOT NULL,
--   `BoxNumber` INT NOT NULL,
--   PRIMARY KEY (`Id`),
--   KEY `ShipmentId_idx` (`ShipmentId`),
--   CONSTRAINT `fk_box_shipment` FOREIGN KEY (`ShipmentId`) REFERENCES `Shipment`(`Id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -- Create ShipmentDetails Table --
-- CREATE TABLE `ShipmentDetails` (
--   `Id` INT NOT NULL AUTO_INCREMENT,
--   `ShipmentId` INT NOT NULL,
--   `OrderItemId` INT NOT NULL,
--   `Quantity` INT NOT NULL,
--   `Size` VARCHAR(255) NOT NULL,
--   `Description` VARCHAR(1000) NOT NULL,
--   `ItemDetails` TEXT DEFAULT NULL,
--   PRIMARY KEY (`Id`),
--   KEY `ShipmentId_idx` (`ShipmentId`),
--   KEY `OrderItemId_idx` (`OrderItemId`),
--   CONSTRAINT `fk_detail_shipment` FOREIGN KEY (`ShipmentId`) REFERENCES `Shipment`(`Id`) ON DELETE CASCADE,
--   CONSTRAINT `fk_detail_orderitem` FOREIGN KEY (`OrderItemId`) REFERENCES `OrderItems`(`Id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `Shipment` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `ShipmentCode` VARCHAR(255) NOT NULL,
  `OrderNumber` VARCHAR(255) NOT NULL,
  `ShipmentCarrierId` INT NOT NULL,
  `ShipmentDate` TIMESTAMP NOT NULL,
  `ShipmentCost` DECIMAL(10,2) NOT NULL,
`TotalWeight` FLOAT NOT NULL,
  `NumberOfBoxes` INT NOT NULL,
  `WeightUnit` VARCHAR(255) NOT NULL,
  `ReceivedTime` TIMESTAMP NULL DEFAULT NULL,
  `Status` ENUM ('Pending', 'Awaiting Pickup', 'Picked Up', 'Dispatched', 'In Transit', 'Arrived at Hub', 'Customs Hold', 'Customs Cleared', 'Delayed', 'Out for Delivery', 'Delivery Attempt Failed', 'Delivered', 'Returned to Sender', 'Cancelled', 'Lost', 'Damaged') NOT NULL,
  `CreatedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` VARCHAR(255) NOT NULL,
  `UpdatedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedBy` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `ShipmentCarrierId_idx` (`ShipmentCarrierId`),
  CONSTRAINT `fk_shipment_carrier` FOREIGN KEY (`ShipmentCarrierId`) REFERENCES `ShipmentCarriers`(`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ShipmentBox` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `ShipmentId` INT NOT NULL,
  `Weight` FLOAT NOT NULL,
  `BoxNumber` INT NOT NULL,
  `Quantity` FLOAT NOT NULL,
  `OrderItem` VARCHAR(255) NOT NULL,
  `OrderItemDescription` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `ShipmentId_idx` (`ShipmentId`),
  CONSTRAINT `fk_box_shipment` FOREIGN KEY (`ShipmentId`) REFERENCES `Shipment`(`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 10/7/2025 

ALTER TABLE `product`
ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE `product`
ADD COLUMN `ClientId` INT DEFAULT NULL;

ALTER TABLE `product`
ADD CONSTRAINT `FK_Product_Client`
FOREIGN KEY (`ClientId`) REFERENCES `client`(`Id`)
ON DELETE SET NULL
ON UPDATE CASCADE;


CREATE TABLE `productprintingoptions` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `ProductId` INT NOT NULL,
  `PrintingOptionId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `FK_productprintingoptions_product` FOREIGN KEY (`ProductId`) REFERENCES `product`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_productprintingoptions_printingoption` FOREIGN KEY (`PrintingOptionId`) REFERENCES `printingoptions`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `Shipment`
ADD COLUMN `TrackingId` VARCHAR(255) NOT NULL DEFAULT 'TEMP_TRACKING';


-------------------------

-- 01/08/2025

ALTER TABLE sizemeasurements ADD COLUMN t_left_sleeve VARCHAR(255);
ALTER TABLE sizemeasurements ADD COLUMN t_right_sleeve VARCHAR(255);