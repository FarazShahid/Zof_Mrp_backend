Create Database Zof_MRP; 
Use Zof_MRP; 

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

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

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
  `CreatedOn` varchar(255) NOT NULL,
  `CreatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`Id`, `Name`, `Email`, `Phone`, `Country`, `State`, `City`, `CompleteAddress`, `ClientStatusId`, `CreatedOn`, `CreatedBy`) VALUES
(1, 'Comprehensive Spine Center', 'info@spinecenter.com', '', '', '', '', '', '', '', ''),
(2, 'Charlotte Rise FC', 'contact@charlotterisefc.com', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `clientassociates`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `clientevent`
--

CREATE TABLE `clientevent` (
  `Id` int(11) NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `CreatedOn` varchar(255) NOT NULL,
  `UpdatedBy` int(11) NOT NULL,
  `UpdatedOn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientevent`
--

INSERT INTO `clientevent` (`Id`, `EventName`, `Description`, `CreatedBy`, `CreatedOn`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Winter Soccer League', '', 0, '', 0, ''),
(2, 'Best of Best Tryouts', '', 0, '', 0, ''),
(3, 'Indoor Futsals Championship', '', 0, '', 0, ''),
(4, 'Summer Football Camp', '', 0, '', 0, ''),
(5, 'Regional Soccer Cup', '', 0, '', 0, ''),
(6, 'All-Star Soccer Weekend', '', 0, '', 0, ''),
(7, 'National Soccer Finals', '', 0, '', 0, ''),
(8, 'Youth Football Carnival', '', 0, '', 0, ''),
(9, 'Spring Soccer Festival', '', 0, '', 0, ''),
(10, 'Rising Stars Tryouts', '', 0, '', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `clientstatus`
--

CREATE TABLE `clientstatus` (
  `Id` int(11) NOT NULL,
  `StatusName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientstatus`
--

INSERT INTO `clientstatus` (`Id`, `StatusName`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Active', 'Currently active clients', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'Inactive', 'Inactive or dormant clients', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coloroption`
--

CREATE TABLE `coloroption` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coloroption`
--

INSERT INTO `coloroption` (`Id`, `Name`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Red', '2025-02-28 15:59:22', 'Admin', '2025-02-28 16:22:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `docstatus`
--

CREATE TABLE `docstatus` (
  `Id` int(11) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctype`
--

CREATE TABLE `doctype` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `fabrictype`
--

CREATE TABLE `fabrictype` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `GSM` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fabrictype`
--

INSERT INTO `fabrictype` (`Id`, `Type`, `Name`, `GSM`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'knitwear', 'Interlock160', 160, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(2, 'knitwear', 'Interlock140', 140, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(3, 'knitwear', 'Interlock120', 120, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(4, 'Woven', 'Interlock160', 160, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(5, 'knitwear', 'Interlock180', 180, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(6, 'knitwear', 'Interlock220', 220, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(7, 'knitwear', 'Interlock240', 240, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(8, 'Woven', 'Cotton-Flees320', 320, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(9, 'Woven', 'Cotton-Flees340', 340, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(10, 'Woven', 'Cotton-Flees400', 400, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(11, 'Woven', 'Scuba380', 380, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(12, 'Woven', 'Scuba420', 420, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(13, 'knitwear', 'Scuba-Flees320', 320, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(14, 'knitwear', 'Scuba-Flees340', 340, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(15, 'knitwear', 'Scuba-Flees380', 380, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(16, 'knitwear', 'Poly-Lycra170', 170, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(17, 'knitwear', 'Poly-Lycra206', 206, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(18, 'knitwear', 'Nylon-Lycra180', 180, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL),
(19, 'knitwear', 'Nylon-Lycra200', 200, '2025-01-05 15:52:52', 'Admin', '2025-01-05 15:52:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ordercategory`
--

CREATE TABLE `ordercategory` (
  `Id` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordercategory`
--

INSERT INTO `ordercategory` (`Id`, `CategoryName`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Samples', 'Sample-related orders', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'Giveaways', 'Orders for giveaways', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(3, 'Events', 'Orders related to events', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orderdoc`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `orderevent`
--

CREATE TABLE `orderevent` (
  `Id` int(11) NOT NULL,
  `EventName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitemdetails`
--

CREATE TABLE `orderitemdetails` (
  `Id` int(11) NOT NULL,
  `ColorOptionId` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` int(11) NOT NULL,
  `UpdatedBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `Id` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ImageId` int(11) DEFAULT NULL,
  `FileId` int(11) DEFAULT NULL,
  `VideoId` int(11) DEFAULT NULL,
  `CreatedOn` datetime NOT NULL,
  `UpdatedOn` datetime NOT NULL,
  `OrderItemPriority` int(11) NOT NULL DEFAULT 0,
  `OrderItemQuantity` int(11) NOT NULL DEFAULT 0,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedBy` int(11) NOT NULL,
  `UpdatedBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitemsprintingoptions`
--

CREATE TABLE `orderitemsprintingoptions` (
  `Id` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `PrintingOptionId` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Id` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `OrderEventId` int(11) NOT NULL,
  `OrderStatusId` int(11) NOT NULL,
  `OrderPriority` int(11) DEFAULT NULL,
  `OrderName` varchar(255) NOT NULL,
  `ExternalOrderId` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Deadline` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` int(11) NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` int(11) NOT NULL,
  `OrderNumber` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `GenerateOrderNumber` BEFORE INSERT ON `orders` FOR EACH ROW BEGIN
    DECLARE prefix VARCHAR(2);
    DECLARE random_number VARCHAR(6);

    -- Extract the first two characters of the client's name as the prefix
    SELECT UPPER(SUBSTRING(Name, 1, 2)) INTO prefix
    FROM Client
    WHERE Id = NEW.ClientId;

    -- Generate a random 6-character alphanumeric string
    SET random_number = CONCAT(
        CHAR(FLOOR(65 + (RAND() * 26))), -- Random uppercase letter
        CHAR(FLOOR(65 + (RAND() * 26))), -- Random uppercase letter
        FLOOR(1000 + (RAND() * 9000))    -- Random 4-digit number
    );

    -- Set the OrderNumber
    SET NEW.OrderNumber = CONCAT(prefix, random_number);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `orderservices`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `orderservicesmedia`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `orderservicesoption`
--

CREATE TABLE `orderservicesoption` (
  `Id` int(11) NOT NULL,
  `ServiceName` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderservicesoption`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `orderserviceunits`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `orderstatus`
--

CREATE TABLE `orderstatus` (
  `Id` int(11) NOT NULL,
  `StatusName` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `UpdatedOn` datetime NOT NULL,
  `Description` varchar(255) NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderstatus`
--

INSERT INTO `orderstatus` (`Id`, `StatusName`, `CreatedOn`, `UpdatedOn`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Pending', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '', ''),
(2, 'Completed', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '', ''),
(3, 'Cancelled', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `ordertype`
--

CREATE TABLE `ordertype` (
  `Id` int(11) NOT NULL,
  `TypeName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordertype`
--

INSERT INTO `ordertype` (`Id`, `TypeName`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Services', 'Service-related orders', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL),
(2, 'Products', 'Product-related orders', '2024-12-30 01:26:27', NULL, '2024-12-30 01:26:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `printingoptions`
--

CREATE TABLE `printingoptions` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `UpdatedOn` datetime NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `printingoptions`
--

INSERT INTO `printingoptions` (`Id`, `Type`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 'Sublimation', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(2, 'DTF', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(3, 'Vinyl', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(4, 'Siliconprinting', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(5, 'DTG', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `Id` int(11) NOT NULL,
  `ProductCategoryId` int(11) NOT NULL,
  `FabricTypeId` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `UpdatedOn` datetime NOT NULL,
  `Description` varchar(255) NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`Id`, `ProductCategoryId`, `FabricTypeId`, `Name`, `CreatedOn`, `UpdatedOn`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 11, 15, 'Scuba-Flees380 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(2, 11, 16, 'Poly-Lycra170 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(3, 11, 13, 'Scuba-Flees320 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(4, 11, 12, 'Scuba420 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(5, 11, 19, 'Nylon-Lycra200 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(6, 11, 3, 'Interlock120 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(7, 11, 5, 'Interlock180 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(8, 11, 14, 'Scuba-Flees340 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(9, 11, 1, 'Interlock160 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(10, 11, 10, 'Cotton-Flees400 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(11, 11, 11, 'Scuba380 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(12, 11, 17, 'Poly-Lycra206 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(13, 11, 18, 'Nylon-Lycra180 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(14, 11, 8, 'Cotton-Flees320 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(15, 11, 9, 'Cotton-Flees340 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(16, 11, 4, 'Interlock160 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(17, 11, 2, 'Interlock140 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(18, 11, 7, 'Interlock240 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(19, 11, 6, 'Interlock220 Doctor Long Coats', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(32, 2, 14, 'Scuba-Flees340 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(33, 2, 8, 'Cotton-Flees320 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(34, 2, 9, 'Cotton-Flees340 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(35, 2, 13, 'Scuba-Flees320 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(36, 2, 11, 'Scuba380 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(37, 2, 15, 'Scuba-Flees380 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(38, 2, 12, 'Scuba420 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(39, 2, 10, 'Cotton-Flees400 Hoodies', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(47, 9, 18, 'Nylon-Lycra180 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(48, 9, 5, 'Interlock180 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(49, 9, 1, 'Interlock160 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(50, 9, 3, 'Interlock120 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(51, 9, 4, 'Interlock160 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(52, 9, 16, 'Poly-Lycra170 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(53, 9, 2, 'Interlock140 Polos', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(54, 7, 1, 'Interlock160 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(55, 7, 15, 'Scuba-Flees380 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(56, 7, 13, 'Scuba-Flees320 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(57, 7, 18, 'Nylon-Lycra180 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(58, 7, 11, 'Scuba380 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(59, 7, 6, 'Interlock220 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(60, 7, 9, 'Cotton-Flees340 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(61, 7, 8, 'Cotton-Flees320 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(62, 7, 2, 'Interlock140 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(63, 7, 12, 'Scuba420 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(64, 7, 4, 'Interlock160 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(65, 7, 7, 'Interlock240 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(66, 7, 3, 'Interlock120 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(67, 7, 10, 'Cotton-Flees400 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(68, 7, 16, 'Poly-Lycra170 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(69, 7, 5, 'Interlock180 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(70, 7, 14, 'Scuba-Flees340 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(71, 7, 19, 'Nylon-Lycra200 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(72, 7, 17, 'Poly-Lycra206 Puffer Jackets', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(85, 10, 1, 'Interlock160 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(86, 10, 5, 'Interlock180 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(87, 10, 15, 'Scuba-Flees380 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(88, 10, 11, 'Scuba380 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(89, 10, 12, 'Scuba420 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(90, 10, 7, 'Interlock240 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(91, 10, 19, 'Nylon-Lycra200 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(92, 10, 9, 'Cotton-Flees340 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(93, 10, 3, 'Interlock120 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(94, 10, 10, 'Cotton-Flees400 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(95, 10, 4, 'Interlock160 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(96, 10, 14, 'Scuba-Flees340 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(97, 10, 18, 'Nylon-Lycra180 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(98, 10, 16, 'Poly-Lycra170 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(99, 10, 17, 'Poly-Lycra206 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(100, 10, 13, 'Scuba-Flees320 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(101, 10, 8, 'Cotton-Flees320 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(102, 10, 6, 'Interlock220 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(103, 10, 2, 'Interlock140 Scrubs', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(116, 5, 2, 'Interlock140 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(117, 5, 6, 'Interlock220 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(118, 5, 11, 'Scuba380 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(119, 5, 17, 'Poly-Lycra206 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(120, 5, 3, 'Interlock120 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(121, 5, 12, 'Scuba420 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(122, 5, 15, 'Scuba-Flees380 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(123, 5, 18, 'Nylon-Lycra180 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(124, 5, 4, 'Interlock160 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(125, 5, 1, 'Interlock160 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(126, 5, 13, 'Scuba-Flees320 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(127, 5, 8, 'Cotton-Flees320 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(128, 5, 5, 'Interlock180 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(129, 5, 9, 'Cotton-Flees340 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(130, 5, 19, 'Nylon-Lycra200 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(131, 5, 7, 'Interlock240 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(132, 5, 14, 'Scuba-Flees340 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(133, 5, 10, 'Cotton-Flees400 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(134, 5, 16, 'Poly-Lycra170 Shorts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(147, 3, 8, 'Cotton-Flees320 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(148, 3, 16, 'Poly-Lycra170 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(149, 3, 5, 'Interlock180 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(150, 3, 17, 'Poly-Lycra206 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(151, 3, 14, 'Scuba-Flees340 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(152, 3, 15, 'Scuba-Flees380 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(153, 3, 3, 'Interlock120 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(154, 3, 2, 'Interlock140 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(155, 3, 7, 'Interlock240 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(156, 3, 12, 'Scuba420 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(157, 3, 9, 'Cotton-Flees340 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(158, 3, 1, 'Interlock160 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(159, 3, 4, 'Interlock160 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(160, 3, 18, 'Nylon-Lycra180 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(161, 3, 6, 'Interlock220 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(162, 3, 11, 'Scuba380 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(163, 3, 19, 'Nylon-Lycra200 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(164, 3, 10, 'Cotton-Flees400 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(165, 3, 13, 'Scuba-Flees320 Sweatshirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(178, 1, 18, 'Nylon-Lycra180 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(179, 1, 2, 'Interlock140 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(180, 1, 1, 'Interlock160 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(181, 1, 4, 'Interlock160 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(182, 1, 3, 'Interlock120 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(183, 1, 16, 'Poly-Lycra170 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(184, 1, 5, 'Interlock180 T-shirts', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(185, 4, 12, 'Scuba420 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(186, 4, 8, 'Cotton-Flees320 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(187, 4, 9, 'Cotton-Flees340 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(188, 4, 15, 'Scuba-Flees380 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(189, 4, 14, 'Scuba-Flees340 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(190, 4, 11, 'Scuba380 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(191, 4, 7, 'Interlock240 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(192, 4, 13, 'Scuba-Flees320 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(193, 4, 10, 'Cotton-Flees400 Tracksuits', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(200, 6, 19, 'Nylon-Lycra200 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(201, 6, 5, 'Interlock180 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(202, 6, 9, 'Cotton-Flees340 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(203, 6, 7, 'Interlock240 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(204, 6, 12, 'Scuba420 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(205, 6, 10, 'Cotton-Flees400 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(206, 6, 15, 'Scuba-Flees380 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(207, 6, 4, 'Interlock160 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(208, 6, 6, 'Interlock220 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(209, 6, 1, 'Interlock160 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(210, 6, 8, 'Cotton-Flees320 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(211, 6, 3, 'Interlock120 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(212, 6, 14, 'Scuba-Flees340 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(213, 6, 17, 'Poly-Lycra206 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(214, 6, 11, 'Scuba380 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(215, 6, 2, 'Interlock140 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(216, 6, 18, 'Nylon-Lycra180 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(217, 6, 13, 'Scuba-Flees320 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(218, 6, 16, 'Poly-Lycra170 Trousers', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(231, 8, 4, 'Interlock160 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(232, 8, 11, 'Scuba380 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(233, 8, 5, 'Interlock180 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(234, 8, 14, 'Scuba-Flees340 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(235, 8, 15, 'Scuba-Flees380 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(236, 8, 8, 'Cotton-Flees320 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(237, 8, 18, 'Nylon-Lycra180 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(238, 8, 19, 'Nylon-Lycra200 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(239, 8, 2, 'Interlock140 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(240, 8, 9, 'Cotton-Flees340 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(241, 8, 13, 'Scuba-Flees320 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(242, 8, 10, 'Cotton-Flees400 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(243, 8, 16, 'Poly-Lycra170 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(244, 8, 7, 'Interlock240 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(245, 8, 6, 'Interlock220 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(246, 8, 3, 'Interlock120 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(247, 8, 12, 'Scuba420 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(248, 8, 17, 'Poly-Lycra206 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(249, 8, 1, 'Interlock160 Wool Socks', '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(252, 11, 15, 'Scuba-Flees380 Doctor Long Coats', '2025-02-04 20:09:05', '2025-02-04 20:09:05', 'Premium quality doctor long coats made with Scuba-Flees380 fabric.', 'Hassaan', 'Malik');

-- --------------------------------------------------------

--
-- Table structure for table `productcategory`
--

CREATE TABLE `productcategory` (
  `Id` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productcategory`
--

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
(13, 'Electronics Test', '2025-01-29 14:32:14', 'Hassaan', '2025-01-29 14:41:59', 'Hassaan Malik');

-- --------------------------------------------------------

--
-- Table structure for table `productcutoptions`
--

CREATE TABLE `productcutoptions` (
  `Id` int(11) NOT NULL,
  `OptionProductCutOptions` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `UpdatedOn` datetime NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productcutoptions`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `productdetails`
--

CREATE TABLE `productdetails` (
  `Id` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ProductCutOptionId` int(11) NOT NULL,
  `ProductSizeMeasurementId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL,
  `ProductRegionId` int(11) DEFAULT NULL,
  `SleeveTypeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productdetails`
--

INSERT INTO `productdetails` (`Id`, `ProductId`, `ProductCutOptionId`, `ProductSizeMeasurementId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `ProductRegionId`, `SleeveTypeId`) VALUES
(1, 178, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(2, 179, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(3, 180, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(4, 181, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(5, 182, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(6, 183, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(7, 184, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(8, 32, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(9, 33, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(10, 34, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(11, 35, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(12, 36, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(13, 37, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(14, 38, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(15, 39, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(16, 147, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(17, 148, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(18, 149, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(19, 150, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(20, 151, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(21, 152, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(22, 153, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(23, 154, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(24, 155, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(25, 156, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(26, 157, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(27, 158, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(28, 159, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(29, 160, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(30, 161, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(31, 162, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(32, 163, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(33, 164, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(34, 165, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(35, 185, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(36, 186, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(37, 187, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(38, 188, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(39, 189, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(40, 190, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(41, 191, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(42, 192, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(43, 193, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(44, 116, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(45, 117, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(46, 118, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(47, 119, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(48, 120, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(49, 121, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(50, 122, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(51, 123, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(52, 124, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(53, 125, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(54, 126, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(55, 127, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(56, 128, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(57, 129, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(58, 130, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(59, 131, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(60, 132, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(61, 133, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(62, 134, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(63, 200, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(64, 201, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(65, 202, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(66, 203, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(67, 204, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(68, 205, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(69, 206, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(70, 207, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(71, 208, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(72, 209, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(73, 210, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(74, 211, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(75, 212, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(76, 213, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(77, 214, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(78, 215, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(79, 216, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(80, 217, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(81, 218, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(82, 54, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(83, 55, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(84, 56, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(85, 57, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(86, 58, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(87, 59, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(88, 60, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(89, 61, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(90, 62, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(91, 63, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(92, 64, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(93, 65, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(94, 66, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(95, 67, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(96, 68, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(97, 69, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(98, 70, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(99, 71, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(100, 72, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(101, 231, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(102, 232, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(103, 233, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(104, 234, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(105, 235, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(106, 236, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(107, 237, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(108, 238, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(109, 239, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(110, 240, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(111, 241, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(112, 242, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(113, 243, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(114, 244, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(115, 245, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(116, 246, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(117, 247, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(118, 248, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(119, 249, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(120, 47, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(121, 48, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(122, 49, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(123, 50, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(124, 51, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(125, 52, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(126, 53, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(127, 85, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(128, 86, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(129, 87, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(130, 88, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(131, 89, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(132, 90, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(133, 91, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(134, 92, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(135, 93, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(136, 94, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(137, 95, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(138, 96, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(139, 97, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(140, 98, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(141, 99, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(142, 100, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(143, 101, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(144, 102, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(145, 103, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(146, 1, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(147, 2, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(148, 3, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(149, 4, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(150, 5, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(151, 6, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(152, 7, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(153, 8, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(154, 9, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(155, 10, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(156, 11, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(157, 12, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL),
(158, 13, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(159, 14, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 2, NULL),
(160, 15, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 4, NULL),
(161, 16, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(162, 17, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(163, 18, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 3, NULL),
(164, 19, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productregionstandard`
--

CREATE TABLE `productregionstandard` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productregionstandard`
--

INSERT INTO `productregionstandard` (`Id`, `Name`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'EU', '2025-01-15 00:56:54', 'Admin', '2025-02-28 16:41:27', NULL),
(2, 'UK', '2025-01-15 00:56:54', 'Admin', '2025-01-15 00:56:54', NULL),
(3, 'US', '2025-01-15 00:56:54', 'Admin', '2025-01-15 00:56:54', NULL),
(4, 'Asia', '2025-01-15 00:56:54', 'Admin', '2025-01-15 00:56:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productsizemeasurements`
--

CREATE TABLE `productsizemeasurements` (
  `Id` int(11) NOT NULL,
  `SizeOptionsId` int(11) NOT NULL,
  `ProductCategoryId` int(11) NOT NULL,
  `ProductCutOptionId` int(11) NOT NULL,
  `SizeMeasurementsId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sizemeasurements`
--

CREATE TABLE `sizemeasurements` (
  `Id` int(11) NOT NULL,
  `ProductSizeMeasurementsId` int(11) NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `sizeoptions`
--

CREATE TABLE `sizeoptions` (
  `Id` int(11) NOT NULL,
  `OptionSizeOptions` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL,
  `UpdatedOn` datetime NOT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sizeoptions`
--

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
(30, 'Large Updated', '2025-02-04 21:50:55', '2025-02-04 21:52:50', 'admin', 'Okay Test Updated By');

-- --------------------------------------------------------

--
-- Table structure for table `sleevetype`
--

CREATE TABLE `sleevetype` (
  `Id` int(11) NOT NULL,
  `SleeveTypeName` varchar(100) NOT NULL,
  `ProductCategoryId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sleevetype`
--

INSERT INTO `sleevetype` (`Id`, `SleeveTypeName`, `ProductCategoryId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Regular', 2, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(4, 'Raglan', 11, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(7, 'Self fabric arms', 2, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(10, 'Grip armss s', 11, '2025-01-15 01:03:34', 'Admin', '2025-01-31 21:03:57', NULL),
(13, 'Self fabric feet', 5, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(16, 'Grip feet', 5, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `CreatedOn` varchar(255) NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Email`, `Password`, `CreatedOn`, `isActive`) VALUES
(1, 'test@dev.com', '$2b$10$32n2s8wSQwWSImFf.hCEZ.FMoHG73ZbcRAHvmSEGO8In5w2K1z5Dy', '', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `availablecoloroptions`
--
ALTER TABLE `availablecoloroptions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `fk_availablecoloroptions_coloroption` (`colorId`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `clientassociates`
--
ALTER TABLE `clientassociates`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ClientId` (`ClientId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `clientevent`
--
ALTER TABLE `clientevent`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `clientstatus`
--
ALTER TABLE `clientstatus`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `StatusName` (`StatusName`);

--
-- Indexes for table `coloroption`
--
ALTER TABLE `coloroption`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `docstatus`
--
ALTER TABLE `docstatus`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Status` (`Status`);

--
-- Indexes for table `doctype`
--
ALTER TABLE `doctype`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Type` (`Type`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `DocStatusId` (`DocStatusId`),
  ADD KEY `DocTypeId` (`DocTypeId`);

--
-- Indexes for table `fabrictype`
--
ALTER TABLE `fabrictype`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ordercategory`
--
ALTER TABLE `ordercategory`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `CategoryName` (`CategoryName`);

--
-- Indexes for table `orderdoc`
--
ALTER TABLE `orderdoc`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `DocumentId` (`DocumentId`),
  ADD KEY `DocumentTypeId` (`DocumentTypeId`),
  ADD KEY `OrderId` (`OrderId`),
  ADD KEY `OrderItemId` (`OrderItemId`);

--
-- Indexes for table `orderevent`
--
ALTER TABLE `orderevent`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `EventName` (`EventName`);

--
-- Indexes for table `orderitemdetails`
--
ALTER TABLE `orderitemdetails`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `orderitemsprintingoptions`
--
ALTER TABLE `orderitemsprintingoptions`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `orderservices`
--
ALTER TABLE `orderservices`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderServiceOptionId` (`OrderServiceOptionId`);

--
-- Indexes for table `orderservicesmedia`
--
ALTER TABLE `orderservicesmedia`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderServicesId` (`OrderServicesId`);

--
-- Indexes for table `orderservicesoption`
--
ALTER TABLE `orderservicesoption`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `ServiceName` (`ServiceName`);

--
-- Indexes for table `orderserviceunits`
--
ALTER TABLE `orderserviceunits`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderServiceOptionId` (`OrderServiceOptionId`);

--
-- Indexes for table `orderstatus`
--
ALTER TABLE `orderstatus`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ordertype`
--
ALTER TABLE `ordertype`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `TypeName` (`TypeName`);

--
-- Indexes for table `printingoptions`
--
ALTER TABLE `printingoptions`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Type` (`Type`);

--
-- Indexes for table `productcutoptions`
--
ALTER TABLE `productcutoptions`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `productdetails`
--
ALTER TABLE `productdetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `ProductCutOptionId` (`ProductCutOptionId`),
  ADD KEY `ProductSizeMeasurementId` (`ProductSizeMeasurementId`),
  ADD KEY `FK_ProductRegion_ProductDetails` (`ProductRegionId`),
  ADD KEY `FK_SleeveType_ProductDetails` (`SleeveTypeId`);

--
-- Indexes for table `productregionstandard`
--
ALTER TABLE `productregionstandard`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RegionName` (`Name`);

--
-- Indexes for table `productsizemeasurements`
--
ALTER TABLE `productsizemeasurements`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `SizeOptionsId` (`SizeOptionsId`),
  ADD KEY `ProductCategoryId` (`ProductCategoryId`),
  ADD KEY `ProductCutOptionId` (`ProductCutOptionId`);

--
-- Indexes for table `sizemeasurements`
--
ALTER TABLE `sizemeasurements`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductSizeMeasurementsId` (`ProductSizeMeasurementsId`);

--
-- Indexes for table `sizeoptions`
--
ALTER TABLE `sizeoptions`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `sleevetype`
--
ALTER TABLE `sleevetype`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `SleeveTypeName` (`SleeveTypeName`),
  ADD KEY `ProductCategoryId` (`ProductCategoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IDX_f73ebcea50dd1c375f20260dbe` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `availablecoloroptions`
--
ALTER TABLE `availablecoloroptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clientassociates`
--
ALTER TABLE `clientassociates`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientevent`
--
ALTER TABLE `clientevent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `clientstatus`
--
ALTER TABLE `clientstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coloroption`
--
ALTER TABLE `coloroption`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `docstatus`
--
ALTER TABLE `docstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctype`
--
ALTER TABLE `doctype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fabrictype`
--
ALTER TABLE `fabrictype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `ordercategory`
--
ALTER TABLE `ordercategory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orderdoc`
--
ALTER TABLE `orderdoc`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderevent`
--
ALTER TABLE `orderevent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderitemdetails`
--
ALTER TABLE `orderitemdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orderitemsprintingoptions`
--
ALTER TABLE `orderitemsprintingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orderservices`
--
ALTER TABLE `orderservices`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderservicesmedia`
--
ALTER TABLE `orderservicesmedia`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderservicesoption`
--
ALTER TABLE `orderservicesoption`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orderserviceunits`
--
ALTER TABLE `orderserviceunits`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderstatus`
--
ALTER TABLE `orderstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ordertype`
--
ALTER TABLE `ordertype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `printingoptions`
--
ALTER TABLE `printingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=255;

--
-- AUTO_INCREMENT for table `productcategory`
--
ALTER TABLE `productcategory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `productcutoptions`
--
ALTER TABLE `productcutoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `productdetails`
--
ALTER TABLE `productdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT for table `productregionstandard`
--
ALTER TABLE `productregionstandard`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `productsizemeasurements`
--
ALTER TABLE `productsizemeasurements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizemeasurements`
--
ALTER TABLE `sizemeasurements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizeoptions`
--
ALTER TABLE `sizeoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `sleevetype`
--
ALTER TABLE `sleevetype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `availablecoloroptions`
--
ALTER TABLE `availablecoloroptions`
  ADD CONSTRAINT `fk_availablecoloroptions_coloroption` FOREIGN KEY (`colorId`) REFERENCES `coloroption` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `clientassociates`
--
ALTER TABLE `clientassociates`
  ADD CONSTRAINT `clientassociates_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `client` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clientassociates_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `clientstatus` (`Id`);
COMMIT;