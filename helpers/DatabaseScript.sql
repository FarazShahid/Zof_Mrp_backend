Create Database Zof_MRP; 
Use Zof_MRP;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table `availablecoloroptions`
--

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

--
-- Dumping data for table `availablecoloroptions`
--

INSERT INTO `availablecoloroptions` (`Id`, `colorId`, `ProductId`, `ImageId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(60, 3, 273, 0, '2025-03-17 11:51:04', 'test@dev.com', '2025-03-17 11:51:04', 'test@dev.com'),
(61, 4, 273, 0, '2025-03-17 11:51:04', 'test@dev.com', '2025-03-17 11:51:04', 'test@dev.com'),
(62, 3, 274, 0, '2025-03-18 11:39:39', 'test@dev.com', '2025-03-18 11:39:39', 'test@dev.com'),
(63, 4, 274, 0, '2025-03-18 11:39:39', 'test@dev.com', '2025-03-18 11:39:39', 'test@dev.com'),
(64, 3, 275, 0, '2025-03-18 11:53:43', 'test@dev.com', '2025-03-18 11:53:43', 'test@dev.com'),
(65, 4, 275, 0, '2025-03-18 11:53:43', 'test@dev.com', '2025-03-18 11:53:43', 'test@dev.com'),
(66, 3, 276, 0, '2025-03-18 11:54:19', 'test@dev.com', '2025-03-18 11:54:19', 'test@dev.com'),
(67, 4, 276, 0, '2025-03-18 11:54:19', 'test@dev.com', '2025-03-18 11:54:19', 'test@dev.com');

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
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`Id`, `Name`, `Email`, `Phone`, `Country`, `State`, `City`, `CompleteAddress`, `ClientStatusId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'Comprehensive Spine Center', 'info@spinecenter.com', '', '', '', '', '', '', '0000-00-00 00:00:00', '', '2025-03-12 11:42:59', ''),
(2, 'Charlotte Rise FC', 'contact@charlotterisefc.com', '', '', '', '', '', '', '0000-00-00 00:00:00', '', '2025-03-12 11:42:59', ''),
(8, 'Hassaan Malikm', 'test@dev.comm', '+923014999044', 'Pakistan', 'Punjab', 'Lahore', 'Canal Road', '1', '2025-03-13 11:00:54', 'test@dev.com', '2025-03-13 11:01:36', 'test@dev.com');

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
  `ClientId` int(11) DEFAULT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(255) NOT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientevent`
--

INSERT INTO `clientevent` (`Id`, `EventName`, `Description`, `CreatedBy`, `CreatedOn`, `UpdatedBy`, `UpdatedOn`) VALUES
(1, 'Winter Soccer League', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(2, 'Best of Best Tryouts', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(3, 'Indoor Futsals Championship', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(4, 'Summer Football Camp', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(5, 'Regional Soccer Cup', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(6, 'All-Star Soccer Weekend', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(7, 'National Soccer Finals', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(8, 'Youth Football Carnival', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(9, 'Spring Soccer Festival', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(10, 'Rising Stars Tryouts', '', '0', '0000-00-00 00:00:00', '0', '0000-00-00 00:00:00'),
(11, 'test EventName', '', 'test@dev.com', '2025-03-14 14:40:11', 'test@dev.com', '2025-03-14 14:40:11');

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
  `HexCode` varchar(20) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coloroption`
--

INSERT INTO `coloroption` (`Id`, `Name`, `HexCode`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(3, 'Green', '#008000', '2025-03-14 12:52:39', 'test@dev.com', '2025-03-17 11:43:53', 'test@dev.com'),
(4, 'Blue', '#0000FF', '2025-03-14 12:52:52', 'test@dev.com', '2025-03-17 11:44:59', 'test@dev.com');

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
  `CategoryId` int(11) DEFAULT NULL,
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
(24, 'dsfdsgsf', 'Premium Cotton |U 23', 200, '2025-03-12 16:08:05', NULL, '2025-03-12 16:08:36', NULL),
(25, 'Cotton', 'Premium Cotton', 200, '2025-03-12 16:10:29', NULL, '2025-03-12 16:10:29', NULL),
(26, 'Cotton', 'Premium Cotton', 200, '2025-03-12 16:11:29', NULL, '2025-03-12 16:11:29', NULL),
(27, 'Cotton', 'Premium Cotton', 200, '2025-03-12 16:11:51', NULL, '2025-03-12 16:11:51', NULL),
(28, 'Cotton', 'Premium Cotton', 200, '2025-03-12 16:14:52', NULL, '2025-03-12 16:14:52', NULL),
(29, 'Cotton', 'Premium Cotton', 200, '2025-03-12 16:15:29', 'test@dev.com', '2025-03-12 16:15:29', NULL),
(30, 'Cotton', 'Premium Cotton', 2000, '2025-03-13 10:23:15', 'test@dev.com', '2025-03-13 10:24:10', 'test@dev.com'),
(31, 'Cotton', 'Premium Cotton', 200, '2025-03-13 10:25:38', 'test@dev.com', '2025-03-13 10:25:38', NULL),
(32, 'Cotton', 'Premium Cotton', 200, '2025-03-13 12:48:01', 'test@dev.com', '2025-03-13 12:48:01', NULL);

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
  `Quantity` int(11) NOT NULL DEFAULT 1,
  `Priority` int(11) NOT NULL DEFAULT 0,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitemdetails`
--

INSERT INTO `orderitemdetails` (`Id`, `ColorOptionId`, `OrderItemId`, `Quantity`, `Priority`, `CreatedOn`, `UpdatedOn`, `CreatedBy`, `UpdatedBy`) VALUES
(40, 6, 34, 10, 9, '2025-03-13 16:53:17', '2025-03-13 16:53:17', '0', '0'),
(41, 7, 34, 10, 9, '2025-03-13 16:53:17', '2025-03-13 16:53:17', '0', '0'),
(42, 8, 34, 10, 9, '2025-03-13 16:53:17', '2025-03-13 16:53:17', '0', '0'),
(43, 6, 35, 10, 9, '2025-03-14 10:28:13', '2025-03-14 10:28:13', '0', '0'),
(44, 7, 35, 10, 9, '2025-03-14 10:28:13', '2025-03-14 10:28:13', '0', '0'),
(45, 8, 35, 10, 9, '2025-03-14 10:28:13', '2025-03-14 10:28:13', '0', '0'),
(46, 6, 36, 10, 9, '2025-03-14 10:29:04', '2025-03-14 10:29:04', '0', '0'),
(47, 7, 36, 10, 9, '2025-03-14 10:29:04', '2025-03-14 10:29:04', '0', '0'),
(48, 8, 36, 10, 9, '2025-03-14 10:29:04', '2025-03-14 10:29:04', '0', '0'),
(49, 6, 37, 10, 9, '2025-03-17 12:29:21', '2025-03-17 12:29:21', 'test@dev.com', 'test@dev.com'),
(50, 7, 37, 10, 9, '2025-03-17 12:29:21', '2025-03-17 12:29:21', 'test@dev.com', 'test@dev.com'),
(51, 8, 37, 10, 9, '2025-03-17 12:29:21', '2025-03-17 12:29:21', 'test@dev.com', 'test@dev.com');

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
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `OrderItemPriority` int(11) NOT NULL DEFAULT 0,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedBy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`Id`, `OrderId`, `ProductId`, `ImageId`, `FileId`, `VideoId`, `CreatedOn`, `UpdatedOn`, `OrderItemPriority`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(34, 18, 261, 201, 301, 401, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 19, 'Product 1 Description', '0', '0'),
(35, 19, 261, 201, 301, 401, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 19, 'Product 1 Description', '0', '0'),
(36, 20, 261, 201, 301, 401, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 19, 'Product 1 Description', '0', '0'),
(37, 21, 261, 201, 301, 401, '2025-03-17 12:29:21', '2025-03-17 12:29:21', 19, 'Product 1 Description', 'test@dev.com', 'test@dev.com');

-- --------------------------------------------------------

--
-- Table structure for table `orderitemsprintingoptions`
--

CREATE TABLE `orderitemsprintingoptions` (
  `Id` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `PrintingOptionId` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) NOT NULL,
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedBy` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitemsprintingoptions`
--

INSERT INTO `orderitemsprintingoptions` (`Id`, `OrderItemId`, `PrintingOptionId`, `Description`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(43, 34, 1, 'Option 1 for Product 1', '2025-03-13 16:53:17', '', '2025-03-13 16:53:17', ''),
(44, 35, 1, 'Option 1 for Product 1', '2025-03-14 10:28:13', '', '2025-03-14 10:28:13', ''),
(45, 36, 1, 'Option 1 for Product 1', '2025-03-14 10:29:04', '', '2025-03-14 10:29:04', ''),
(46, 37, 1, 'Option 1 for Product 1', '2025-03-17 12:29:21', '', '2025-03-17 12:29:21', '');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Id` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `OrderEventId` int(11) NOT NULL,
  `OrderStatusId` int(11) NOT NULL DEFAULT 1,
  `OrderPriority` int(11) DEFAULT NULL,
  `OrderName` varchar(255) NOT NULL,
  `ExternalOrderId` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Deadline` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` varchar(255) NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(255) NOT NULL,
  `OrderNumber` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Id`, `ClientId`, `OrderEventId`, `OrderStatusId`, `OrderPriority`, `OrderName`, `ExternalOrderId`, `Description`, `Deadline`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `OrderNumber`) VALUES
(18, 1, 2, 1, 2, '2025-01-10T00:00:00Z', '1', 'Order for event', '2025-01-10 00:00:00', '2025-03-13 11:53:17', '0', '2025-03-13 11:53:17', '0', 'COHJ9859'),
(19, 1, 2, 1, 2, '2025-01-10T00:00:00Z', '1', 'Order for event', '2025-01-10 00:00:00', '2025-03-14 05:28:13', '0', '2025-03-14 05:28:13', '0', 'COAU9686'),
(20, 1, 2, 1, 2, '2025-01-10T00:00:00Z', '1', 'Order for event', '2025-01-10 00:00:00', '2025-03-14 05:29:04', 'test@dev.com', '2025-03-14 05:29:04', 'test@dev.com', 'COLH2417'),
(21, 1, 2, 1, 2, '2025-01-10T00:00:00Z', '1', 'Order for event', '2025-01-10 00:00:00', '2025-03-17 07:29:21', 'test@dev.com', '2025-03-17 07:29:21', 'test@dev.com', 'COSI5428');

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


DELIMITER $$

CREATE TRIGGER `GenerateOrderName` 
BEFORE INSERT ON `orders`
FOR EACH ROW
BEGIN
    DECLARE prefix VARCHAR(2);
    DECLARE unique_string VARCHAR(6);

    -- Get first two uppercase characters of the client's name
    SELECT UPPER(SUBSTRING(Name, 1, 2)) INTO prefix
    FROM client
    WHERE Id = NEW.ClientId;

    -- Generate a random unique string: 2 random letters + 4 random digits
    SET unique_string = CONCAT(
        CHAR(FLOOR(65 + (RAND() * 26))), -- Random uppercase letter
        CHAR(FLOOR(65 + (RAND() * 26))), -- Random uppercase letter
        FLOOR(1000 + (RAND() * 9000))    -- Random 4-digit number
    );

    -- Set the OrderName as ClientInitials-UniqueString
    SET NEW.OrderName = CONCAT(prefix, '-', unique_string);
END $$

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
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
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
(5, 'DTG', '2024-12-30 01:26:27', '2024-12-30 01:26:27', '', ''),
(6, 'Test Name', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'test@dev.com', '');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

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

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`Id`, `ProductCategoryId`, `FabricTypeId`, `CreatedOn`, `UpdatedOn`, `Description`, `CreatedBy`, `UpdatedBy`) VALUES
(1, 11, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(2, 11, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(3, 11, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(4, 11, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(5, 11, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(6, 11, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(7, 11, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(8, 11, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(9, 11, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(10, 11, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(11, 11, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(12, 11, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(13, 11, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(14, 11, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(15, 11, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(16, 11, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(17, 11, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(18, 11, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(19, 11, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(32, 2, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(33, 2, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(34, 2, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(35, 2, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(36, 2, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(37, 2, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(38, 2, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(39, 2, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(47, 9, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(48, 9, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(49, 9, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(50, 9, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(51, 9, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(52, 9, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(53, 9, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(54, 7, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(55, 7, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(56, 7, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(57, 7, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(58, 7, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(59, 7, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(60, 7, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(61, 7, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(62, 7, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(63, 7, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(64, 7, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(65, 7, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(66, 7, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(67, 7, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(68, 7, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(69, 7, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(70, 7, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(71, 7, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(72, 7, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(85, 10, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(86, 10, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(87, 10, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(88, 10, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(89, 10, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(90, 10, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(91, 10, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(92, 10, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(93, 10, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(94, 10, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(95, 10, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(96, 10, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(97, 10, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(98, 10, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(99, 10, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(100, 10, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(101, 10, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(102, 10, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(103, 10, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(116, 5, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(117, 5, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(118, 5, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(119, 5, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(120, 5, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(121, 5, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(122, 5, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(123, 5, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(124, 5, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(125, 5, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(126, 5, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(127, 5, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(128, 5, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(129, 5, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(130, 5, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(131, 5, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(132, 5, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(133, 5, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(134, 5, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(147, 3, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(148, 3, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(149, 3, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(150, 3, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(151, 3, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(152, 3, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(153, 3, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(154, 3, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(155, 3, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(156, 3, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(157, 3, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(158, 3, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(159, 3, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(160, 3, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(161, 3, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(162, 3, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(163, 3, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(164, 3, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(165, 3, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(178, 1, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(179, 1, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(180, 1, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(181, 1, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(182, 1, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(183, 1, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(184, 1, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(185, 4, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(186, 4, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(187, 4, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(188, 4, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(189, 4, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(190, 4, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(191, 4, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(192, 4, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(193, 4, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(200, 6, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(201, 6, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(202, 6, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(203, 6, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(204, 6, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(205, 6, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(206, 6, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(207, 6, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(208, 6, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(209, 6, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(210, 6, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(211, 6, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(212, 6, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(213, 6, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(214, 6, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(215, 6, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(216, 6, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(217, 6, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(218, 6, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(231, 8, 4, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(232, 8, 11, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(233, 8, 5, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(234, 8, 14, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(235, 8, 15, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(236, 8, 8, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(237, 8, 18, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(238, 8, 19, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(239, 8, 2, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(240, 8, 9, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(241, 8, 13, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(242, 8, 10, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(243, 8, 16, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(244, 8, 7, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(245, 8, 6, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(246, 8, 3, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(247, 8, 12, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(248, 8, 17, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(249, 8, 1, '2025-01-15 01:32:19', '2025-01-15 01:32:19', '', '', ''),
(273, 11, 15, '2025-03-17 11:51:04', '2025-03-17 11:51:04', 'Premium quality doctor long coats made with Scuba-Flees380 fabric.', 'test@dev.com', 'test@dev.com'),
(274, 11, 15, '2025-03-18 11:39:39', '2025-03-18 11:39:39', 'Premium quality doctor long coats made with Scuba-Flees380 fabric.', 'test@dev.com', 'test@dev.com'),
(275, 11, 15, '2025-03-18 11:53:43', '2025-03-18 11:53:43', 'Premium quality doctor long coats made with Scuba-Flees380 fabric.', 'test@dev.com', 'test@dev.com'),
(276, 11, 15, '2025-03-18 11:54:19', '2025-03-18 11:54:19', 'Premium quality doctor long coats made with Scuba-Flees380 fabric.', 'test@dev.com', 'test@dev.com');

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
(13, 'Electronics drgd sdfsdf dr uuuugd', '2025-01-29 14:32:14', 'Hassaan', '2025-03-13 15:42:33', 'Hassaan Malik'),
(14, 'Electronics Test drgd', '2025-03-13 15:32:18', NULL, '2025-03-13 15:32:18', NULL),
(15, 'Electronics sdfsdf drgd', '2025-03-13 15:32:37', NULL, '2025-03-13 15:32:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productcutoptions`
--

CREATE TABLE `productcutoptions` (
  `Id` int(11) NOT NULL,
  `OptionProductCutOptions` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
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
  `SleeveTypeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productdetails`
--

INSERT INTO `productdetails` (`Id`, `ProductId`, `ProductCutOptionId`, `ProductSizeMeasurementId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `SleeveTypeId`) VALUES
(1, 178, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(2, 179, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(3, 180, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(4, 181, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(5, 182, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(6, 183, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(7, 184, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(8, 32, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(9, 33, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(10, 34, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(11, 35, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(12, 36, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(13, 37, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(14, 38, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(15, 39, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(16, 147, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(17, 148, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(18, 149, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(19, 150, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(20, 151, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(21, 152, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(22, 153, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(23, 154, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(24, 155, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(25, 156, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(26, 157, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(27, 158, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(28, 159, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(29, 160, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(30, 161, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(31, 162, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(32, 163, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(33, 164, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(34, 165, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(35, 185, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(36, 186, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(37, 187, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(38, 188, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(39, 189, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(40, 190, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(41, 191, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(42, 192, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(43, 193, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(44, 116, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(45, 117, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(46, 118, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(47, 119, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(48, 120, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(49, 121, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(50, 122, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(51, 123, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(52, 124, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(53, 125, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(54, 126, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(55, 127, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(56, 128, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(57, 129, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(58, 130, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(59, 131, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(60, 132, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(61, 133, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(62, 134, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(63, 200, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(64, 201, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(65, 202, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(66, 203, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(67, 204, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(68, 205, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(69, 206, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(70, 207, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(71, 208, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(72, 209, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(73, 210, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(74, 211, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(75, 212, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(76, 213, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(77, 214, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(78, 215, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(79, 216, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(80, 217, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(81, 218, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(82, 54, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(83, 55, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(84, 56, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(85, 57, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(86, 58, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(87, 59, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(88, 60, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(89, 61, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(90, 62, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(91, 63, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(92, 64, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(93, 65, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(94, 66, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(95, 67, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(96, 68, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(97, 69, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(98, 70, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(99, 71, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(100, 72, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(101, 231, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(102, 232, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(103, 233, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(104, 234, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(105, 235, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(106, 236, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(107, 237, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(108, 238, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(109, 239, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(110, 240, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(111, 241, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(112, 242, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(113, 243, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(114, 244, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(115, 245, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(116, 246, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(117, 247, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(118, 248, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(119, 249, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(120, 47, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(121, 48, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(122, 49, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(123, 50, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(124, 51, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(125, 52, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(126, 53, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(127, 85, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(128, 86, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(129, 87, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(130, 88, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(131, 89, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(132, 90, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(133, 91, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(134, 92, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(135, 93, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(136, 94, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(137, 95, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(138, 96, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(139, 97, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(140, 98, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(141, 99, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(142, 100, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(143, 101, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(144, 102, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(145, 103, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(146, 1, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(147, 2, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(148, 3, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(149, 4, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(150, 5, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(151, 6, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(152, 7, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(153, 8, 3, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(154, 9, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(155, 10, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(156, 11, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(157, 12, 1, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(158, 13, 5, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(159, 14, 7, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(160, 15, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(161, 16, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(162, 17, 4, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(163, 18, 6, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(164, 19, 2, NULL, '2025-01-24 23:02:36', 'Admin', '2025-01-24 23:02:36', NULL, NULL),
(294, 273, 201, 301, '2025-03-17 11:51:04', 'test@dev.com', '2025-03-17 11:51:04', 'test@dev.com', 501),
(295, 273, 202, 302, '2025-03-17 11:51:04', 'test@dev.com', '2025-03-17 11:51:04', 'test@dev.com', 502),
(296, 274, 201, 1, '2025-03-18 11:39:39', 'test@dev.com', '2025-03-18 11:39:39', 'test@dev.com', 501),
(297, 274, 202, 1, '2025-03-18 11:39:39', 'test@dev.com', '2025-03-18 11:39:39', 'test@dev.com', 502),
(298, 275, 201, 1, '2025-03-18 11:53:43', 'test@dev.com', '2025-03-18 11:53:43', 'test@dev.com', 501),
(299, 275, 202, 1, '2025-03-18 11:53:43', 'test@dev.com', '2025-03-18 11:53:43', 'test@dev.com', 502),
(300, 276, 201, 1, '2025-03-18 11:54:19', 'test@dev.com', '2025-03-18 11:54:19', 'test@dev.com', 1),
(301, 276, 202, 1, '2025-03-18 11:54:19', 'test@dev.com', '2025-03-18 11:54:19', 'test@dev.com', 23);

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
-- Table structure for table `sizemeasurements`
--

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

--
-- Dumping data for table `sizemeasurements`
--

INSERT INTO `sizemeasurements` (`Id`, `SizeOptionId`, `Measurement1`, `FrontLengthHPS`, `BackLengthHPS`, `AcrossShoulders`, `ArmHole`, `UpperChest`, `LowerChest`, `Waist`, `BottomWidth`, `SleeveLength`, `SleeveOpening`, `NeckSize`, `CollarHeight`, `CollarPointHeight`, `StandHeightBack`, `CollarStandLength`, `SideVentFront`, `SideVentBack`, `PlacketLength`, `TwoButtonDistance`, `PlacketWidth`, `BottomHem`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 3, 'Standard Fit - Men s Dress Shirt |Up', 75.50, 77.00, 45.75, 25.50, 52.00, 50.50, 48.25, 54.00, 65.25, 16.50, 41.00, 3.50, 7.25, 4.00, 8.75, 15.25, 17.50, 35.00, 10.25, 3.25, 2.50, '2025-03-18 11:20:22', 'test@dev.com', '2025-03-18 14:14:37', 'test@dev.com');

-- --------------------------------------------------------

--
-- Table structure for table `sizeoptions`
--

CREATE TABLE `sizeoptions` (
  `Id` int(11) NOT NULL,
  `OptionSizeOptions` varchar(255) NOT NULL,
  `CreatedOn` datetime NOT NULL DEFAULT current_timestamp(),
  `UpdatedOn` datetime NOT NULL DEFAULT current_timestamp(),
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
(30, 'Large Updated refs', '2025-02-04 21:50:55', '2025-03-17 16:50:46', 'admin', 'test@dev.com'),
(31, 'Large', '2025-03-17 16:49:21', '2025-03-17 16:49:21', 'test@dev.com', 'test@dev.com');

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
(10, 'Grip armss s', 11, '2025-01-15 01:03:34', 'Admin', '2025-03-13 15:27:48', 'test@dev.com'),
(13, 'Self fabric feet', 5, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(16, 'Grip feet', 5, '2025-01-15 01:03:34', 'Admin', '2025-01-15 01:03:34', NULL),
(21, 'Full Sleeveee', 2, '2025-03-13 15:08:57', 'test@dev.com', '2025-03-13 15:08:57', 'test@dev.com'),
(22, 'Full Sleeveeegg', 2, '2025-03-13 15:14:19', 'test@dev.com', '2025-03-13 15:14:19', 'test@dev.com'),
(23, 'Full Sleedcveeegg', 2, '2025-03-13 15:23:25', 'test@dev.com', '2025-03-13 15:23:25', 'test@dev.com');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Email`, `Password`, `CreatedOn`, `isActive`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 'test@dev.com', '$2b$10$32n2s8wSQwWSImFf.hCEZ.FMoHG73ZbcRAHvmSEGO8In5w2K1z5Dy', '0000-00-00 00:00:00', 1, '', '2025-03-12 11:51:35', ''),
(2, 'test@dev.commm', '$2b$10$aiR.eWJ58EZVl3oGeRsiNexP5cxGIR0FvE1dvU6Djwc/x0yeawFSO', '0000-00-00 00:00:00', 1, '', '2025-03-12 11:56:02', ''),
(3, 'test@dev.commmm', '$2b$10$fqJ.x0YRqpiQb79GuivgjOBR4Q3axM.rO5bK0RaDLG7QQ7m3c2QYW', '0000-00-00 00:00:00', 1, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com'),
(4, 'test@dev.commmmm', '$2b$10$mp9t5gR9mioAls53pQGam.Zgofs3IQqd.bp4DhPqkDtff0sApOy6q', '0000-00-00 00:00:00', 1, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com'),
(5, 'test@dev.commmmmm', '$2b$10$kIeQoDrLW2eMRBqYG3UK3OnGzdhW/pLmpqfkqanwjPiY5C4KAd0k6', '0000-00-00 00:00:00', 1, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com'),
(6, 'test@dev.commmmmmm', '$2b$10$M4d8PLeaf2sIvKlobruUvOTKr84MmXvp3CSa/tKYKG1siKYN/uqxe', '0000-00-00 00:00:00', 1, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com'),
(7, 'test@dev.commmmmmdm', '$2b$10$q9psFHXft5nU5NoE6zKtnukhqq4nYW4M8sycDecw7gJJLPTL7hpx2', '0000-00-00 00:00:00', 1, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com'),
(12, 'test@dev.commmmmmddm', '$2b$10$D20JFTXl7jxyQ2Mmvm74iuVnu3pN787kIgCf0uUBJ33mJlA4NJ2rW', '0000-00-00 00:00:00', 1, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com'),
(14, 'test@dev.commmmmmsddddm', '$2b$10$XBEKYQh7GbwvXsai/iJkVeSWkFHcSCZdAr8r/b2Kk1xVr/ydwCytO', '2025-03-13 14:29:10', 0, 'test@dev.com', '0000-00-00 00:00:00', 'test@dev.com');

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
  ADD KEY `FK_SleeveType_ProductDetails` (`SleeveTypeId`);

--
-- Indexes for table `productregionstandard`
--
ALTER TABLE `productregionstandard`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RegionName` (`Name`);

--
-- Indexes for table `sizemeasurements`
--
ALTER TABLE `sizemeasurements`
  ADD PRIMARY KEY (`Id`);

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `clientassociates`
--
ALTER TABLE `clientassociates`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientevent`
--
ALTER TABLE `clientevent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `clientstatus`
--
ALTER TABLE `clientstatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coloroption`
--
ALTER TABLE `coloroption`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `orderitemsprintingoptions`
--
ALTER TABLE `orderitemsprintingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ordertype`
--
ALTER TABLE `ordertype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `printingoptions`
--
ALTER TABLE `printingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=277;

--
-- AUTO_INCREMENT for table `productcategory`
--
ALTER TABLE `productcategory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `productcutoptions`
--
ALTER TABLE `productcutoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `productdetails`
--
ALTER TABLE `productdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- AUTO_INCREMENT for table `productregionstandard`
--
ALTER TABLE `productregionstandard`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sizemeasurements`
--
ALTER TABLE `sizemeasurements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sizeoptions`
--
ALTER TABLE `sizeoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `sleevetype`
--
ALTER TABLE `sleevetype`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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