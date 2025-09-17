
DROP TABLE IF EXISTS `ShipmentBoxItem`;

CREATE TABLE `ShipmentBoxItem` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `ShipmentBoxId` INT NOT NULL,
  `OrderItemId` INT NOT NULL,
  `OrderItemDescription` VARCHAR(255) NULL,
  `Quantity` INT DEFAULT 1,
  CONSTRAINT `FK_ShipmentBoxItem_ShipmentBox`
    FOREIGN KEY (`ShipmentBoxId`)
    REFERENCES `ShipmentBox` (`Id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_ShipmentBoxItem_OrderItem`
    FOREIGN KEY (`OrderItemId`)
    REFERENCES `orderitems` (`id`)
);

ALTER TABLE `ShipmentBox`
  DROP FOREIGN KEY `FK_ShipmentBox_OrderItems`;

ALTER TABLE `ShipmentBox`
  DROP COLUMN `OrderItemId`,
  DROP COLUMN `OrderItemDescription`,
  DROP COLUMN `Quantity`;

ALTER TABLE `ShipmentBox`
  ADD COLUMN `OrderBoxDescription` TEXT NULL;

CREATE TABLE auditlogs (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  UserId INT NOT NULL,
  Module VARCHAR(100) NOT NULL,
  Action VARCHAR(50) NOT NULL,
  Details TEXT NULL,
  EntityId VARCHAR(50) NULL,
  Ip VARCHAR(100) NULL,
  Device VARCHAR(255) NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- QA Checklist for Product

CREATE TABLE qachecklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  productId INT NOT NULL,
  CONSTRAINT FK_qachecklist_products FOREIGN KEY (productId) REFERENCES product(Id)
);

CREATE TABLE `orderqualitycheck` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderItemId` INT NOT NULL,
  `productId` INT NULL,
  `measurementId` INT NULL,
  `parameter` TEXT NULL,
  `expected` VARCHAR(255) NULL,
  `observed` VARCHAR(255) NULL,
  `remarks` TEXT NULL,
  `createdBy` VARCHAR(255) NOT NULL,
  `createdOn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
