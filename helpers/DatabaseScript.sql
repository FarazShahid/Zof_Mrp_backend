SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `availablecoloroptions` (
  `Id` int(11) NOT NULL,
  `colorId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ImageId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `availablecoloroptions` (`Id`, `colorId`, `ProductId`, `ImageId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(70, 3, 278, 1, '2025-05-28 17:01:53', 'test@dev.com', '2025-05-28 17:01:53', 'test@dev.com'),
(71, 4, 278, 1, '2025-05-28 17:01:53', 'test@dev.com', '2025-05-28 17:01:53', 'test@dev.com'),
(72, 7, 278, 1, '2025-05-28 17:01:53', 'test@dev.com', '2025-05-28 17:01:53', 'test@dev.com'),
(73, 8, 278, 1, '2025-05-28 17:01:53', 'test@dev.com', '2025-05-28 17:01:53', 'test@dev.com'),
(74, 10, 279, 1, '2025-05-28 17:04:06', 'test@dev.com', '2025-05-28 17:04:06', 'test@dev.com'),
(75, 9, 279, 1, '2025-05-28 17:04:06', 'test@dev.com', '2025-05-28 17:04:06', 'test@dev.com'),
(76, 8, 279, 1, '2025-05-28 17:04:06', 'test@dev.com', '2025-05-28 17:04:06', 'test@dev.com'),
(77, 7, 279, 1, '2025-05-28 17:04:06', 'test@dev.com', '2025-05-28 17:04:06', 'test@dev.com'),
(78, 3, 280, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com'),
(79, 4, 280, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com'),
(80, 7, 280, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com'),
(81, 8, 280, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com'),
(82, 9, 280, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com'),
(83, 10, 280, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com');

CREATE TABLE `client` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(255) NOT NULL,
  `Country` varchar(255) NOT NULL,
  `State` varchar(255) NOT NULL,
  `City` varchar(255) NOT NULL,
  `CompleteAddress` varchar(255) NOT NULL,
  `ClientStatusId` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `client` (`Id`, `Name`, `Email`, `Phone`, `Country`, `State`, `City`, `CompleteAddress`, `ClientStatusId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Comprehensive Spine Center', 'info@spinecenter.com', '', '', '', '', '', '', '0000-00-00 00:00:00', '', '2025-03-12 11:42:59', ''),
(2, 'Charlotte Rise FC', 'contact@charlotterisefc.com', '', '', '', '', '', '', '0000-00-00 00:00:00', '', '2025-03-12 11:42:59', ''),
(8, 'Hassaan Malik', 'test@dev.comm', '+923014999044', 'Pakistan', 'Punjab', 'Lahore', 'Canal Road', '1', '2025-03-13 11:00:54', 'test@dev.com', '2025-03-13 11:01:36', 'test@dev.com');

CREATE TABLE `clientassociates` (
  `Id` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `CompleteAddress` text DEFAULT NULL,
  `StatusId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clientevent` (
  `Id` int(11) NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `ClientId` int(11) DEFAULT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) NOT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `clientevent` (`Id`, `EventName`, `Description`, `ClientId`, `CreatedBy`, `CreatedOn`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Winter Soccer League', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(2, 'Best of Best Tryouts', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(3, 'Indoor Futsals Championship', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(4, 'Summer Football Camp', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(5, 'Regional Soccer Cup', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(6, 'All-Star Soccer Weekend', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(7, 'National Soccer Finals', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(8, 'Youth Football Carnival', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(9, 'Spring Soccer Festival', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(10, 'Rising Stars Tryouts', '', NULL, '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(11, 'test EventName', '', NULL, 'test@dev.com', '2025-03-14 14:40:11', 'test@dev.com', '2025-03-14 14:40:11');

CREATE TABLE `clientstatus` (
  `Id` int(11) NOT NULL,
  `StatusName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `clientstatus` (`Id`, `StatusName`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Active', 'Currently active clients', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'Inactive', 'Inactive or dormant clients', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

CREATE TABLE `coloroption` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `HexCode` varchar(20) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `coloroption` (`Id`, `Name`, `HexCode`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(3, 'Green', '#008000', '2025-03-14 12:52:39', 'test@dev.com', '2025-03-17 11:43:53', 'test@dev.com'),
(4, 'Blue', '#0000FF', '2025-03-14 12:52:52', 'test@dev.com', '2025-03-17 11:44:59', 'test@dev.com'),
(7, 'shell-pink', '#f88180', '2025-05-28 16:44:09', 'test@dev.com', '2025-05-28 16:44:09', 'test@dev.com'),
(8, 'marsala', '#964f4c', '2025-05-28 16:44:17', 'test@dev.com', '2025-05-28 16:44:17', 'test@dev.com'),
(9, 'fired-brick', '#6a2e2a', '2025-05-28 16:44:24', 'test@dev.com', '2025-05-28 16:44:24', 'test@dev.com'),
(10, 'chili-oil', '#8e3c36', '2025-05-28 16:55:01', 'test@dev.com', '2025-05-28 16:55:01', 'test@dev.com');

CREATE TABLE `docstatus` (
  `Id` int(11) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `doctype` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `document` (
  `Id` int(11) NOT NULL,
  `PhotoGuid` varchar(255) NOT NULL,
  `FileName` varchar(255) NOT NULL,
  `Extension` varchar(50) NOT NULL,
  `PhysicalPath` text DEFAULT NULL,
  `CloudPath` text DEFAULT NULL,
  `DocStatusId` int(11) NOT NULL,
  `DocTypeId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `document` (`Id`, `PhotoGuid`, `FileName`, `Extension`, `PhysicalPath`, `CloudPath`, `DocStatusId`, `DocTypeId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'ad52cb7a-a9b5-4ee2-b1c7-6cf314d70126', '1 13', 'png', NULL, 'https://genxstorage.blob.core.windows.net/dev/dev/ad52cb7a-a9b5-4ee2-b1c7-6cf314d70126-1%2013.png?sp=racwdl&st=2025-05-12T15:30:01Z&se=2025-06-29T23:30:01Z&spr=https&sv=2024-11-04&sr=c&sig=aTd8pJn71WoBOC%2FPI%2Bn%2FKvn795MgZFXFe9c64qi5TpE%3D', 1, 1, '2025-05-27 16:28:27', 'test@dev.com', '2025-05-27 16:28:27', 'test@dev.com'),
(2, 'f821bc18-c37e-4b7b-9f3e-ab2b081ab03d', '1 13', 'png', NULL, 'https://genxstorage.blob.core.windows.net/dev/dev/f821bc18-c37e-4b7b-9f3e-ab2b081ab03d-1%2013.png?sp=racwdl&st=2025-05-12T15:30:01Z&se=2025-06-29T23:30:01Z&spr=https&sv=2024-11-04&sr=c&sig=aTd8pJn71WoBOC%2FPI%2Bn%2FKvn795MgZFXFe9c64qi5TpE%3D', 1, 1, '2025-05-28 17:05:21', 'test@dev.com', '2025-05-28 17:05:21', 'test@dev.com'),
(3, '6c90d520-cfc2-4fb3-884b-94cd525d9fdb', 'Screenshot 2025-05-28 170632', 'jpg', NULL, 'https://genxstorage.blob.core.windows.net/dev/dev/6c90d520-cfc2-4fb3-884b-94cd525d9fdb-Screenshot%202025-05-28%20170632.jpg?sp=racwdl&st=2025-05-12T15:30:01Z&se=2025-06-29T23:30:01Z&spr=https&sv=2024-11-04&sr=c&sig=aTd8pJn71WoBOC%2FPI%2Bn%2FKvn795MgZFXFe9c64qi5TpE%3D', 1, 1, '2025-05-28 17:06:41', 'test@dev.com', '2025-05-28 17:06:41', 'test@dev.com');

CREATE TABLE `fabrictype` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `GSM` int(11) NOT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `fabrictype` (`Id`, `Type`, `Name`, `GSM`, `CategoryId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(6, 'knitwear', 'Interlock220', 220, NULL, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(7, 'knitwear', 'Interlock240', 240, NULL, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(11, 'Woven', 'Scuba380', 380, NULL, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(12, 'Woven', 'Scuba420', 420, NULL, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(13, 'knitwear', 'Scuba-Flees320', 320, NULL, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(31, 'Cotton', 'Premium Cotton', 200, NULL, '2025-03-13 10:25:38', 'test@dev.com', '2025-03-13 10:25:38', NULL);

CREATE TABLE `inventorybillofmaterials` (
  `Id` int(11) NOT NULL,
  `FinishedGoodId` int(11) NOT NULL,
  `RawMaterialId` int(11) NOT NULL,
  `QuantityRequired` decimal(10,2) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `InventoryCategories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `InventoryCategories` (`Id`, `Name`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `DeletedAt`) VALUES
(1, 'Wol', '2025-05-28 16:32:58', 'test@dev.com', '2025-05-28 16:32:58', 'test@dev.com', NULL),
(2, 'Cotton', '2025-05-28 16:41:16', 'test@dev.com', '2025-05-28 16:41:16', 'test@dev.com', NULL);

CREATE TABLE `InventoryItems` (
  `Id` int(11) NOT NULL,
  `Name` varchar(200) NOT NULL,
  `ItemCode` varchar(20) NOT NULL,
  `SubCategoryId` int(11) NOT NULL,
  `UnitOfMeasureId` int(11) NOT NULL,
  `SupplierId` int(11) DEFAULT NULL,
  `ReorderLevel` decimal(10,2) DEFAULT NULL,
  `Stock` decimal(10,2) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `InventoryItems` (`Id`, `Name`, `ItemCode`, `SubCategoryId`, `UnitOfMeasureId`, `SupplierId`, `ReorderLevel`, `Stock`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `DeletedAt`) VALUES
(1, 'Cotton 40', 'COT-INT-1001', 2, 1, 2, 100.00, 10.00, '2025-05-28 16:42:42', 'test@dev.com', '2025-05-28 16:42:52', 'test@dev.com', NULL);

CREATE TABLE `inventorysubcategories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `inventorysubcategories` (`Id`, `Name`, `CategoryId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `DeletedAt`) VALUES
(1, 'test', 1, '2025-05-28 16:34:37', 'test@dev.com', '2025-05-28 16:41:26', 'test@dev.com', '2025-05-28 16:41:26'),
(2, 'Interlock Cotton', 2, '2025-05-28 16:41:24', 'test@dev.com', '2025-05-28 16:41:24', 'test@dev.com', NULL);

CREATE TABLE `InventorySuppliers` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `CompleteAddress` varchar(255) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `InventorySuppliers` (`Id`, `Name`, `Email`, `Phone`, `Country`, `State`, `City`, `CompleteAddress`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `DeletedAt`) VALUES
(1, 'test', 'khalid.farooq@csc-dev.com', '+6616296413', '', 'test', 'test', 'sdwede', '2025-05-28 16:35:27', 'test@dev.com', '2025-05-28 16:35:31', 'test@dev.com', '2025-05-28 16:35:31'),
(2, 'Ahmad Raza', NULL, '0345-6363520', 'Pakistan', 'Punjab', 'Lahore', 'Street 2, Gulberg 3, Lahore', '2025-05-28 16:37:45', 'test@dev.com', '2025-05-28 16:37:52', 'test@dev.com', NULL);

CREATE TABLE `InventoryTransactions` (
  `Id` int(11) NOT NULL,
  `InventoryItemId` int(11) NOT NULL,
  `Quantity` decimal(10,2) NOT NULL,
  `TransactionType` enum('IN','OUT','PRODUCTION','Opening Balance','Disposal') NOT NULL,
  `TransactionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `InventoryTransactions` (`Id`, `InventoryItemId`, `Quantity`, `TransactionType`, `TransactionDate`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `DeletedAt`) VALUES
(1, 1, 10.00, 'IN', '2025-05-28 16:42:52', '2025-05-28 16:42:52', 'test@dev.com', '2025-05-28 16:42:52', 'test@dev.com', NULL);

CREATE TABLE `ordercategory` (
  `Id` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ordercategory` (`Id`, `CategoryName`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Samples', 'Sample-related orders', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'Giveaways', 'Orders for giveaways', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(3, 'Events', 'Orders related to events', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

CREATE TABLE `orderdoc` (
  `Id` int(11) NOT NULL,
  `DocumentId` int(11) NOT NULL,
  `DocumentTypeId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `OrderItemId` int(11) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orderevent` (
  `Id` int(11) NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orderitemdetails` (
  `Id` int(11) NOT NULL,
  `ColorOptionId` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Priority` int(11) NOT NULL DEFAULT 0,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orderitemdetails` (`Id`, `ColorOptionId`, `OrderItemId`, `Quantity`, `Priority`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`) VALUES
(52, 68, 38, 100, 1, '2025-05-27 16:28:27', '2025-05-27 16:28:27', 'test@dev.com', 'test@dev.com'),
(53, 68, 39, 50, 1, '2025-05-28 15:23:03', '2025-05-28 15:23:03', 'test@dev.com', 'test@dev.com'),
(54, 69, 39, 100, 2, '2025-05-28 15:23:03', '2025-05-28 15:23:03', 'test@dev.com', 'test@dev.com'),
(55, 70, 40, 100, 1, '2025-05-28 17:05:21', '2025-05-28 17:05:21', 'test@dev.com', 'test@dev.com'),
(56, 71, 41, 10, 2, '2025-05-28 17:06:41', '2025-05-28 17:06:41', 'test@dev.com', 'test@dev.com'),
(57, 74, 42, 10, 1, '2025-05-28 17:06:41', '2025-05-28 17:06:41', 'test@dev.com', 'test@dev.com');

CREATE TABLE `orderitems` (
  `Id` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ImageId` int(11) DEFAULT NULL,
  `FileId` int(11) DEFAULT NULL,
  `VideoId` int(11) DEFAULT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `OrderItemPriority` int(11) NOT NULL DEFAULT 0,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orderitems` (`Id`, `OrderId`, `ProductId`, `ImageId`, `FileId`, `VideoId`, `CreatedOn`, `UpdatedOn`, `OrderItemPriority`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(38, 22, 277, 1, NULL, NULL, '2025-05-27 16:28:27', '2025-05-27 16:28:27', 1, 'T-shirts_dsfdsgsf_Premium Cotton |U 23_200', 'test@dev.com', 'test@dev.com'),
(39, 23, 277, 1, NULL, NULL, '2025-05-28 15:23:03', '2025-05-28 15:23:03', 1, 'Shorts_Woven_Cotton-Flees400_400', 'test@dev.com', 'test@dev.com'),
(40, 24, 278, 2, NULL, NULL, '2025-05-28 17:05:21', '2025-05-28 17:05:21', 1, 'T-shirts_Cotton_Premium Cotton_200', 'test@dev.com', 'test@dev.com'),
(41, 25, 278, NULL, NULL, NULL, '2025-05-28 17:06:41', '2025-05-28 17:06:41', 2, 'T-shirts_Cotton_Premium Cotton_200', 'test@dev.com', 'test@dev.com'),
(42, 25, 279, 3, NULL, NULL, '2025-05-28 17:06:41', '2025-05-28 17:06:41', 1, 'Hoodies_knitwear_Interlock240_240', 'test@dev.com', 'test@dev.com');

CREATE TABLE `orderitemsprintingoptions` (
  `Id` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `PrintingOptionId` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orderitemsprintingoptions` (`Id`, `OrderItemId`, `PrintingOptionId`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(47, 38, 1, '', '2025-05-27 16:28:27', '', '2025-05-27 16:28:27', ''),
(48, 38, 2, '', '2025-05-27 16:28:27', '', '2025-05-27 16:28:27', ''),
(49, 39, 1, '', '2025-05-28 15:23:03', '', '2025-05-28 15:23:03', ''),
(50, 39, 2, '', '2025-05-28 15:23:03', '', '2025-05-28 15:23:03', ''),
(51, 40, 1, '', '2025-05-28 17:05:21', '', '2025-05-28 17:05:21', ''),
(52, 40, 2, '', '2025-05-28 17:05:21', '', '2025-05-28 17:05:21', ''),
(53, 41, 1, '', '2025-05-28 17:06:41', '', '2025-05-28 17:06:41', ''),
(54, 41, 2, '', '2025-05-28 17:06:41', '', '2025-05-28 17:06:41', ''),
(55, 42, 1, '', '2025-05-28 17:06:41', '', '2025-05-28 17:06:41', ''),
(56, 42, 2, '', '2025-05-28 17:06:41', '', '2025-05-28 17:06:41', '');

CREATE TABLE `orders` (
  `Id` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `OrderEventId` int(11) NOT NULL,
  `OrderStatusId` int(11) NOT NULL DEFAULT 1,
  `OrderPriority` int(11) DEFAULT NULL,
  `OrderName` varchar(255) DEFAULT NULL,
  `ExternalOrderId` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Deadline` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) DEFAULT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(255) DEFAULT NULL,
  `OrderNumber` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orders` (`Id`, `ClientId`, `OrderEventId`, ` `, `OrderPriority`, `OrderName`, `ExternalOrderId`, `Description`, `Deadline`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `OrderNumber`) VALUES
(22, 2, 1, 5, 1, 'CH-KP7822', '', '2order description', '2025-05-30 19:00:00', '2025-05-27 11:28:27', 'test@dev.com', '2025-05-27 12:56:34', 'test@dev.com', 'CHJH5144'),
(23, 2, 3, 1, 1, 'CH-BO6575', '', '2order description', '2025-07-30 19:00:00', '2025-05-28 10:23:03', 'test@dev.com', '2025-05-28 10:23:03', 'test@dev.com', 'CHON9351'),
(24, 2, 5, 1, 1, 'CH-NG7961', '', '2order description', '2025-12-30 19:00:00', '2025-05-28 12:05:21', 'test@dev.com', '2025-05-28 12:05:21', 'test@dev.com', 'CHLO4871'),
(25, 2, 6, 1, 1, 'CH-CY5309', '', '2order description', '2025-06-04 19:00:00', '2025-05-28 12:06:41', 'test@dev.com', '2025-05-28 12:06:41', 'test@dev.com', 'CHJG2510');

DELIMITER $$
CREATE TRIGGER `GenerateOrderName` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE prefix VARCHAR(2);
    DECLARE unique_string VARCHAR(6);
    SELECT UPPER(SUBSTRING(Name, 1, 2)) INTO prefix
    FROM client
    WHERE Id = NEW.ClientId;
    SET unique_string = CONCAT(
        CHAR(FLOOR(65 + (RAND() * 26))), 
        CHAR(FLOOR(65 + (RAND() * 26))),
        FLOOR(1000 + (RAND() * 9000)) 
    );

    SET NEW.OrderName = CONCAT(prefix, '-', unique_string);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `GenerateOrderNumber` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE prefix VARCHAR(2);
    DECLARE random_number VARCHAR(6);

    SELECT UPPER(SUBSTRING(Name, 1, 2)) INTO prefix
    FROM client
    WHERE Id = NEW.ClientId;

    SET random_number = CONCAT(
        CHAR(FLOOR(65 + (RAND() * 26))),
        CHAR(FLOOR(65 + (RAND() * 26))),
        FLOOR(1000 + (RAND() * 9000))  
    );

    SET NEW.OrderNumber = CONCAT(prefix, random_number);
END
$$
DELIMITER ;

CREATE TABLE `orderservices` (
  `Id` int(11) NOT NULL,
  `OrderServiceOptionId` int(11) NOT NULL,
  `QuantityDetail` text DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orderservicesmedia` (
  `Id` int(11) NOT NULL,
  `OrderServicesId` int(11) NOT NULL,
  `PhotoId` int(11) DEFAULT NULL,
  `FileId` int(11) DEFAULT NULL,
  `VideoId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orderservicesoption` (
  `Id` int(11) NOT NULL,
  `ServiceName` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `orderservicesoption` (`Id`, `ServiceName`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Sublimation', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'DTF', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(3, 'Embroidery', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(4, 'Graphics', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(5, 'Vinyl', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(6, 'Caps', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(7, 'Bags', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(8, 'Stitching', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(9, 'Heat bed', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(10, 'Photostudio Rent', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(11, 'Photoshoot', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(12, 'AI Shoot', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

CREATE TABLE `orderserviceunits` (
  `Id` int(11) NOT NULL,
  `UnitMeasureName` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `OrderServiceOptionId` int(11) NOT NULL,
  `CostPerUnit` decimal(10,2) NOT NULL,
  `Currency` varchar(10) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orderstatus` (
  `Id` int(11) NOT NULL,
  `StatusName` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `Description` varchar(255) NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orderstatus` (`Id`, `StatusName`, `CreatedOn`, `UpdatedOn`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Pending', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '', ''),
(2, 'Completed', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '', ''),
(3, 'Cancelled', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '', ''),
(5, 'Production', '2025-05-27 16:29:06', '2025-05-27 16:29:06', '', 'test@dev.com', 'test@dev.com'),
(6, 'Printing', '2025-05-27 16:29:12', '2025-05-27 16:29:12', '', 'test@dev.com', 'test@dev.com'),
(7, 'Packing', '2025-05-27 16:29:21', '2025-05-27 16:29:21', '', 'test@dev.com', 'test@dev.com');

CREATE TABLE `ordertype` (
  `Id` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ordertype` (`Id`, `TypeName`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Services', 'Service-related orders', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'Products', 'Product-related orders', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

CREATE TABLE `printingoptions` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `UpdatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) DEFAULT NULL,
  `UpdatedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `printingoptions` (`Id`, `Type`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Sublimation', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(2, 'DTF', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(3, 'Vinyl', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(4, 'Siliconprinting', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(5, 'DTG', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '');

CREATE TABLE `product` (
  `Id` int(11) NOT NULL,
  `ProductCategoryId` int(11) NOT NULL,
  `FabricTypeId` int(11) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `Description` varchar(255) NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `product` (`Id`, `ProductCategoryId`, `FabricTypeId`, `CreatedOn`, `UpdatedOn`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(278, 1, 31, '2025-05-28 17:01:53', '2025-05-28 17:01:53', 'Description', 'test@dev.com', 'test@dev.com'),
(279, 2, 7, '2025-05-28 17:04:06', '2025-05-28 17:04:06', 'Description', 'test@dev.com', 'test@dev.com'),
(280, 3, 13, '2025-05-28 17:04:37', '2025-05-28 17:04:37', 'Description', 'test@dev.com', 'test@dev.com');

CREATE TABLE `productcategory` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `productcategory` (`Id`, `Type`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'T-shirts', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(2, 'Hoodies', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(3, 'Sweatshirts', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(4, 'Tracksuits', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(5, 'Shorts', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(6, 'Trousers', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(7, 'Puffer Jackets', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(8, 'Wool Socks', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(9, 'Polos', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(10, 'Scrubs', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(11, 'Doctor Long Coats', '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(13, 'Electronics drgd sdfsdf dr uuuugd', '2025-01-29 14:32:14', 'Hassaan', '2025-03-13 15:42:33', 'Hassaan Malik'),
(14, 'Electronics Test drgd', '2025-03-13 15:32:18', NULL, '2025-03-13 15:32:18', NULL),
(15, 'Electronics sdfsdf drgd', '2025-03-13 15:32:37', NULL, '2025-03-13 15:32:37', NULL);

CREATE TABLE `productcutoptions` (
  `Id` int(11) NOT NULL,
  `OptionProductCutOptions` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `productcutoptions` (`Id`, `OptionProductCutOptions`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Male', '2025-01-05 15:52:52', '2025-02-03 17:03:56', '', ''),
(2, 'Female', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(3, 'Unisex', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(4, 'EU', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(5, 'US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(6, 'UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(7, 'Raglan', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(8, 'Round Neck Cut', '2025-02-03 16:50:55', '2025-02-03 16:50:55', 'Hassaan', 'Malik'),
(10, 'Round Neck Cut', '2025-02-04 17:09:20', '2025-02-04 17:09:20', 'Hassaan', 'Malik');

CREATE TABLE `productdetails` (
  `Id` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ProductCutOptionId` int(11) NOT NULL,
  `ProductSizeMeasurementId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `SleeveTypeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `productdetails` (`Id`, `ProductId`, `ProductCutOptionId`, `ProductSizeMeasurementId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `SleeveTypeId`) VALUES
(303, 278, 1, 1, '2025-05-28 17:01:53', 'test@dev.com', '2025-05-28 17:01:53', 'test@dev.com', 1),
(304, 279, 2, 1, '2025-05-28 17:04:06', 'test@dev.com', '2025-05-28 17:04:06', 'test@dev.com', 4),
(305, 280, 6, 1, '2025-05-28 17:04:37', 'test@dev.com', '2025-05-28 17:04:37', 'test@dev.com', 4);

CREATE TABLE `productionconsumption` (
  `Id` int(11) NOT NULL,
  `ProductionOrderId` int(11) NOT NULL,
  `RawMaterialId` int(11) NOT NULL,
  `QuantityUsed` decimal(10,2) NOT NULL,
  `UsedDate` datetime NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `productionorders` (
  `Id` int(11) NOT NULL,
  `FinishedGoodId` int(11) NOT NULL,
  `QuantityToProduce` decimal(10,2) NOT NULL,
  `ProductionDate` datetime NOT NULL,
  `IsCompleted` tinyint(1) DEFAULT 0,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------


CREATE TABLE `productregionstandard` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `productregionstandard` (`Id`, `Name`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'EU', '2025-01-15 00:56:54', 'Admin', '2025-02-28 16:41:27', NULL),
(2, 'UK', '2025-01-15 00:56:54', 'Admin', '2025-01-15 00:56:54', NULL),
(3, 'US', '2025-01-15 00:56:54', 'Admin', '2025-01-15 00:56:54', NULL),
(4, 'Asia', '2025-01-15 00:56:54', 'Admin', '2025-01-15 00:56:54', NULL);

-- --------------------------------------------------------

CREATE TABLE `sizemeasurements` (
  `Id` int(11) NOT NULL,
  `ClientId` int(11) DEFAULT NULL,
  `CutOptionId` int(11) DEFAULT NULL,
  `SizeOptionId` int(11) NOT NULL DEFAULT 1,
  `Measurement1` varchar(255) DEFAULT NULL,
  `FrontLengthHPS` decimal(5,2) DEFAULT NULL,
  `BackLengthHPS` decimal(5,2) DEFAULT NULL,
  `AcrossShoulders` decimal(5,2) DEFAULT NULL,
  `ArmHole` decimal(5,2) DEFAULT NULL,
  `UpperChest` decimal(5,2) DEFAULT NULL,
  `LowerChest` decimal(5,2) DEFAULT NULL,
  `Waist` decimal(5,2) DEFAULT NULL,
  `BottomWidth` decimal(5,2) DEFAULT NULL,
  `SleeveLength` decimal(5,2) DEFAULT NULL,
  `SleeveOpening` decimal(5,2) DEFAULT NULL,
  `NeckSize` decimal(5,2) DEFAULT NULL,
  `CollarHeight` decimal(5,2) DEFAULT NULL,
  `CollarPointHeight` decimal(5,2) DEFAULT NULL,
  `StandHeightBack` decimal(5,2) DEFAULT NULL,
  `CollarStandLength` decimal(5,2) DEFAULT NULL,
  `SideVentFront` decimal(5,2) DEFAULT NULL,
  `SideVentBack` decimal(5,2) DEFAULT NULL,
  `PlacketLength` decimal(5,2) DEFAULT NULL,
  `TwoButtonDistance` decimal(5,2) DEFAULT NULL,
  `PlacketWidth` decimal(5,2) DEFAULT NULL,
  `BottomHem` decimal(5,2) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `sizemeasurements` (`Id`, `ClientId`, `CutOptionId`, `SizeOptionId`, `Measurement1`, `FrontLengthHPS`, `BackLengthHPS`, `AcrossShoulders`, `ArmHole`, `UpperChest`, `LowerChest`, `Waist`, `BottomWidth`, `SleeveLength`, `SleeveOpening`, `NeckSize`, `CollarHeight`, `CollarPointHeight`, `StandHeightBack`, `CollarStandLength`, `SideVentFront`, `SideVentBack`, `PlacketLength`, `TwoButtonDistance`, `PlacketWidth`, `BottomHem`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 2, NULL, 3, 'Polo T-shirt ', 75.50, 77.00, 45.75, 25.50, 52.00, 50.50, 48.25, 54.00, 65.25, 16.50, 41.00, 3.50, 7.25, 4.00, 8.75, 15.25, 17.50, 35.00, 10.25, 3.25, 2.50, '2025-03-18 11:20:22', 'test@dev.com', '2025-05-28 17:03:19', 'test@dev.com'),
(4, 2, NULL, 5, 'Hoodie', 75.50, 77.00, 45.75, 52.40, 52.00, 50.50, 48.25, 56.00, 65.25, 63.00, 41.00, 3.50, 25.00, 25.00, 8.75, 15.25, 96.00, 96.00, 10.25, 32.00, 65.00, '2025-05-28 17:03:12', 'test@dev.com', '2025-05-28 17:03:12', 'test@dev.com');

-- --------------------------------------------------------


CREATE TABLE `sizeoptions` (
  `Id` int(11) NOT NULL,
  `OptionSizeOptions` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `sizeoptions` (`Id`, `OptionSizeOptions`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'XS-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(2, 'S-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(3, 'M-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(4, 'L-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(5, 'XL-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(6, '2XL-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(7, 'XS-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(8, 'S-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(9, 'M-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(10, 'L-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(11, 'XL-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(12, '2XL-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(13, '3XL-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(14, '3XL-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(15, '4XL-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(16, '4XL-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(17, '5XL-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(18, '5XL-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(19, '6XL-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(20, '6XL-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(21, '4yo-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(22, '4yo-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(23, '6yo-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(24, '6yo-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(25, '8yo-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(26, '8yo-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(27, '12yo-US', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(28, '12yo-UK', '2025-01-05 15:52:52', '2025-01-05 15:52:52', '', ''),
(30, 'Large Updated refs', '2025-02-04 21:50:55', '2025-03-17 16:50:46', 'admin', 'test@dev.com'),
(31, 'Large', '2025-03-17 16:49:21', '2025-03-17 16:49:21', 'test@dev.com', 'test@dev.com');

CREATE TABLE `sleevetype` (
  `Id` int(11) NOT NULL,
  `SleeveTypeName` varchar(100) NOT NULL,
  `ProductCategoryId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `sleevetype` (`Id`, `SleeveTypeName`, `ProductCategoryId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Regular', 2, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(4, 'Raglan', 11, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(7, 'Self fabric arms', 2, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(10, 'Grip armss s', 11, '2025-01-15 01:03:34', 'Admin', '2025-03-13 15:27:48', 'test@dev.com'),
(16, 'Grip feet', 5, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(21, 'Full Sleeveee', 2, '2025-03-13 15:08:57', 'test@dev.com', '2025-03-13 15:08:57', 'test@dev.com'),
(22, 'Full Sleeveeegg', 2, '2025-03-13 15:14:19', 'test@dev.com', '2025-03-13 15:14:19', 'test@dev.com'),
(23, 'Full Sleedcveeegg', 2, '2025-03-13 15:23:25', 'test@dev.com', '2025-03-13 15:23:25', 'test@dev.com');

CREATE TABLE `UnitOfMeasures` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `ShortForm` varchar(255) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `DeletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `UnitOfMeasures` (`Id`, `Name`, `ShortForm`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `DeletedAt`) VALUES
(1, 'Kilogram', 'KG', '2025-05-28 16:36:53', 'test@dev.com', '2025-05-28 16:36:53', 'test@dev.com', NULL);

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `CreatedBy` varchar(100) NOT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`Id`, `Email`, `Password`, `CreatedOn`, `isActive`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'test@dev.com', '$2b$10$32n2s8wSQwWSImFf.hCEZ.FMoHG73ZbcRAHvmSEGO8In5w2K1z5Dy', '0000-00-00 00:00:00', 1, '', '2025-03-12 11:51:35', ''),
(15, 'admin@hrm.com', '$2b$10$EO1lu9R7qo17mcuunM49EeLAhJm44ecyJJSLnot7XHZ1pK4lvuaa6', '2025-05-28 16:04:51', 1, 'test@dev.com', '2025-05-28 16:04:51', 'test@dev.com');

ALTER TABLE `availablecoloroptions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `fk_availablecoloroptions_coloroption` (`colorId`);

ALTER TABLE `client`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `clientassociates`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ClientId` (`ClientId`),
  ADD KEY `StatusId` (`StatusId`);

ALTER TABLE `clientevent`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `clientstatus`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

ALTER TABLE `coloroption`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `docstatus`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Status` (`Status`);

ALTER TABLE `doctype`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Type` (`Type`);

ALTER TABLE `document`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `DocStatusId` (`DocStatusId`),
  ADD KEY `DocTypeId` (`DocTypeId`);

ALTER TABLE `fabrictype`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `inventorybillofmaterials`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FinishedGoodId` (`FinishedGoodId`),
  ADD KEY `RawMaterialId` (`RawMaterialId`);

ALTER TABLE `InventoryCategories`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `InventoryItems`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `ItemCode` (`ItemCode`),
  ADD KEY `SubCategoryId` (`SubCategoryId`),
  ADD KEY `SupplierId` (`SupplierId`),
  ADD KEY `UnitOfMeasureId` (`UnitOfMeasureId`);

ALTER TABLE `inventorysubcategories`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `CategoryId` (`CategoryId`);

ALTER TABLE `InventorySuppliers`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `InventoryTransactions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `InventoryItemId` (`InventoryItemId`);

ALTER TABLE `ordercategory`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `CategoryName` (`CategoryName`);

ALTER TABLE `orderdoc`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `DocumentId` (`DocumentId`),
  ADD KEY `DocumentTypeId` (`DocumentTypeId`),
  ADD KEY `OrderId` (`OrderId`),
  ADD KEY `OrderItemId` (`OrderItemId`);
ALTER TABLE `orderevent`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `EventName` (`EventName`);

ALTER TABLE `orderitemdetails`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `orderitemsprintingoptions`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `orderservices`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderServiceOptionId` (`OrderServiceOptionId`);

ALTER TABLE `orderservicesmedia`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderServicesId` (`OrderServicesId`);

ALTER TABLE `orderservicesoption`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `ServiceName` (`ServiceName`);

ALTER TABLE `orderserviceunits`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderServiceOptionId` (`OrderServiceOptionId`);

ALTER TABLE `orderstatus`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `ordertype`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

ALTER TABLE `printingoptions`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `product`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `productcategory`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Type` (`Type`);

ALTER TABLE `productcutoptions`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `productdetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `ProductCutOptionId` (`ProductCutOptionId`),
  ADD KEY `ProductSizeMeasurementId` (`ProductSizeMeasurementId`),
  ADD KEY `FK_SleeveType_ProductDetails` (`SleeveTypeId`);

ALTER TABLE `productionconsumption`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductionOrderId` (`ProductionOrderId`),
  ADD KEY `RawMaterialId` (`RawMaterialId`);
ALTER TABLE `productionorders`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FinishedGoodId` (`FinishedGoodId`);
ALTER TABLE `productregionstandard`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RegionName` (`Name`);

ALTER TABLE `sizemeasurements`
  ADD PRIMARY KEY (`Id`);

ALTER TABLE `sizeoptions`
  ADD PRIMARY KEY (`Id`);
ALTER TABLE `sleevetype`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `SleeveTypeName` (`SleeveTypeName`),
  ADD KEY `ProductCategoryId` (`ProductCategoryId`);
ALTER TABLE `UnitOfMeasures`
  ADD PRIMARY KEY (`Id`);
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IDX_f73ebcea50dd1c375f20260dbe` (`Email`);
ALTER TABLE `availablecoloroptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

ALTER TABLE `client`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `clientassociates`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `clientevent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `clientstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `coloroption`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `docstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `doctype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `document`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `fabrictype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

ALTER TABLE `inventorybillofmaterials`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `InventoryCategories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `InventoryItems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `inventorysubcategories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `InventorySuppliers`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `InventoryTransactions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `ordercategory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `orderdoc`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orderevent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orderitemdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

ALTER TABLE `orderitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

ALTER TABLE `orderitemsprintingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

ALTER TABLE `orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

ALTER TABLE `orderservices`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orderservicesmedia`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orderservicesoption`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `orderserviceunits`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `orderstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `ordertype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `printingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `product`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=281;

ALTER TABLE `productcategory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `productcutoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `productdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=306;

ALTER TABLE `productionconsumption`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `productionorders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `productregionstandard`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `sizemeasurements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `sizeoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

ALTER TABLE `sleevetype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

ALTER TABLE `UnitOfMeasures`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `availablecoloroptions`
  ADD CONSTRAINT `fk_availablecoloroptions_coloroption` FOREIGN KEY (`colorId`) REFERENCES `coloroption` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `clientassociates`
  ADD CONSTRAINT `clientassociates_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `client` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clientassociates_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `clientstatus` (`Id`);

ALTER TABLE `inventorybillofmaterials`
  ADD CONSTRAINT `inventorybillofmaterials_ibfk_1` FOREIGN KEY (`FinishedGoodId`) REFERENCES `InventoryItems` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventorybillofmaterials_ibfk_2` FOREIGN KEY (`RawMaterialId`) REFERENCES `InventoryItems` (`Id`) ON DELETE CASCADE;

ALTER TABLE `InventoryItems`
  ADD CONSTRAINT `InventoryItems_ibfk_1` FOREIGN KEY (`SubCategoryId`) REFERENCES `inventorysubcategories` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `InventoryItems_ibfk_2` FOREIGN KEY (`SupplierId`) REFERENCES `InventorySuppliers` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `InventoryItems_ibfk_3` FOREIGN KEY (`UnitOfMeasureId`) REFERENCES `UnitOfMeasures` (`Id`);

ALTER TABLE `inventorysubcategories`
  ADD CONSTRAINT `inventorysubcategories_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `InventoryCategories` (`Id`) ON DELETE CASCADE;

ALTER TABLE `InventoryTransactions`
  ADD CONSTRAINT `InventoryTransactions_ibfk_1` FOREIGN KEY (`InventoryItemId`) REFERENCES `InventoryItems` (`Id`) ON DELETE CASCADE;

ALTER TABLE `productionconsumption`
  ADD CONSTRAINT `productionconsumption_ibfk_1` FOREIGN KEY (`ProductionOrderId`) REFERENCES `productionorders` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productionconsumption_ibfk_2` FOREIGN KEY (`RawMaterialId`) REFERENCES `InventoryItems` (`Id`) ON DELETE CASCADE;

ALTER TABLE `productionorders`
  ADD CONSTRAINT `productionorders_ibfk_1` FOREIGN KEY (`FinishedGoodId`) REFERENCES `InventoryItems` (`Id`) ON DELETE CASCADE;
COMMIT;

-- Updated Script For Availble Sizes

CREATE TABLE `availblesizeoptions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `sizeId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE productdetails
DROP COLUMN ProductSizeMeasurementId;

ALTER TABLE orderitemdetails
ADD COLUMN SizeOption INT NOT NULL,
ADD COLUMN MeasurementId INT NOT NULL;

ALTER TABLE Product
ADD COLUMN Name VARCHAR(255) DEFAULT NULL;

-- Add the column
ALTER TABLE SizeOptions
ADD COLUMN ProductRegionId INT DEFAULT NULL;

-- Add the foreign key constraint
ALTER TABLE SizeOptions
ADD CONSTRAINT fk_product_region
FOREIGN KEY (ProductRegionId)
REFERENCES ProductRegionStandard(Id)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- Add nullable column 'ProductCategoryId' to the 'sizemeasurements' table
ALTER TABLE sizemeasurements
ADD COLUMN ProductCategoryId INT NULL DEFAULT NULL;

-- Add foreign key constraint to link 'ProductCategoryId' with 'productcategory(Id)'
ALTER TABLE sizemeasurements
ADD CONSTRAINT fk_sizemeasurements_productcategory
FOREIGN KEY (ProductCategoryId) REFERENCES productcategory(Id)
ON DELETE SET NULL
ON UPDATE CASCADE;


ALTER TABLE `sizemeasurements`
ADD COLUMN BackNeckDrop DECIMAL(5,2) NULL,
ADD COLUMN FrontNeckDrop DECIMAL(5,2) NULL,
ADD COLUMN ShoulderSeam DECIMAL(5,2) NULL,
ADD COLUMN ShoulderSlope DECIMAL(5,2) NULL,
ADD COLUMN Hem DECIMAL(5,2) NULL,
ADD COLUMN Inseam DECIMAL(5,2) NULL,
ADD COLUMN Hip DECIMAL(5,2) NULL,
ADD COLUMN FrontRise DECIMAL(5,2) NULL,
ADD COLUMN LegOpening DECIMAL(5,2) NULL,
ADD COLUMN KneeWidth DECIMAL(5,2) NULL,
ADD COLUMN Outseam DECIMAL(5,2) NULL,
ADD COLUMN bFrontRise DECIMAL(5,2) NULL,
ADD COLUMN t_TopRight DECIMAL(5,2) NULL,
ADD COLUMN t_TopLeft DECIMAL(5,2) NULL,
ADD COLUMN t_BottomRight DECIMAL(5,2) NULL,
ADD COLUMN t_BottomLeft DECIMAL(5,2) NULL,
ADD COLUMN t_Back DECIMAL(5,2) NULL,
ADD COLUMN t_Center DECIMAL(5,2) NULL,
ADD COLUMN b_TopRight DECIMAL(5,2) NULL,
ADD COLUMN b_TopLeft DECIMAL(5,2) NULL,
ADD COLUMN b_BottomRight DECIMAL(5,2) NULL,
ADD COLUMN b_BottomLeft DECIMAL(5,2) NULL;


ALTER TABLE `product`
ADD COLUMN productStatus varchar(255) NULL;

ALTER TABLE `productcategory`
ADD COLUMN IsTopUnit BOOLEAN DEFAULT false,
ADD COLUMN IsBottomUnit BOOLEAN DEFAULT false,
ADD COLUMN SupportsLogo BOOLEAN DEFAULT false;

CREATE TABLE `orderstatuslogs` (
  `Id` INT AUTO_INCREMENT PRIMARY KEY,
  `OrderId` INT NOT NULL,
  `StatusId` INT NOT NULL,  
  `CreatedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `UpdatedOn` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `FK_orderstatuslogs_order` FOREIGN KEY (`OrderId`)
    REFERENCES `orders` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_orderstatuslogs_status` FOREIGN KEY (`StatusId`)
    REFERENCES `orderstatus` (`Id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;