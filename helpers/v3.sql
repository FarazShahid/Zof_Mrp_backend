
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