SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `zof_mrp`
--

-- --------------------------------------------------------

--
-- Table structure for table `availablecoloroptions`
--

CREATE TABLE `availablecoloroptions` (
  `Id` int(11) NOT NULL,
  `ColorName` varchar(255) NOT NULL,
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
(1, 'Active', 'Currently active clients', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(2, 'Inactive', 'Inactive or dormant clients', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL);

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
(1, 'Knitwear', 'Interlock', 160, '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL);

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
(1, 'Samples', 'Sample-related orders', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(2, 'Giveaways', 'Orders for giveaways', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(3, 'Events', 'Orders related to events', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL);

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
-- Table structure for table `orderitemcolors`
--

CREATE TABLE `orderitemcolors` (
  `Id` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ColorOptionId` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitemprintingoptions`
--

CREATE TABLE `orderitemprintingoptions` (
  `Id` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `PrintingOptionId` int(11) NOT NULL,
  `Description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitemprintingoptions`
--

INSERT INTO `orderitemprintingoptions` (`Id`, `OrderItemId`, `PrintingOptionId`, `Description`) VALUES
(2, 4, 3, 'Option 1 for Product 2'),
(3, 6, 3, 'Option 1 for Product 2');

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
  `Description` varchar(255) DEFAULT NULL,
  `CreatedBy` int(11) NOT NULL,
  `UpdatedBy` int(11) NOT NULL,
  `OrderItemPriority` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitems`
--

INSERT INTO `orderitems` (`Id`, `OrderId`, `ProductId`, `ImageId`, `FileId`, `VideoId`, `CreatedOn`, `UpdatedOn`, `Description`, `CreatedBy`, `UpdatedBy`, `OrderItemPriority`) VALUES
(3, 2, 101, 201, 301, 401, '2025-01-05 22:49:52', '2025-01-05 22:49:52', 'Product 1 Description', 0, 0, NULL),
(4, 2, 102, 202, 302, 402, '2025-01-05 22:49:52', '2025-01-05 22:49:52', 'Product 2 Description', 0, 0, NULL),
(5, 3, 101, 201, 301, 401, '2025-01-05 22:55:09', '2025-01-05 22:55:09', 'Product 1 Description', 0, 0, NULL),
(6, 3, 102, 202, 302, 402, '2025-01-05 22:55:09', '2025-01-05 22:55:09', 'Product 2 Description', 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orderitemsprintingoptions`
--

CREATE TABLE `orderitemsprintingoptions` (
  `Id` int(11) NOT NULL,
  `OrderItemId` int(11) NOT NULL,
  `PrintingOptionId` int(11) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
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
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `Description` varchar(255) DEFAULT NULL,
  `Deadline` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `CreatedBy` int(11) NOT NULL,
  `UpdatedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` int(11) NOT NULL,
  `OrderPriority` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`Id`, `ClientId`, `OrderEventId`, `OrderStatusId`, `items`, `Description`, `Deadline`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`, `OrderPriority`) VALUES
(2, 1, 2, 1, NULL, 'Order for event', '2025-01-10 00:00:00', '2025-01-05 17:49:52', 0, '2025-01-05 17:49:52', 0, 1),
(3, 1, 2, 1, NULL, 'Order for event', '2025-01-10 00:00:00', '2025-01-05 17:55:09', 0, '2025-01-05 17:55:09', 0, 1);

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
(1, 'Sublimation', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(2, 'DTF', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(3, 'Embroidery', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(4, 'Graphics', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(5, 'Vinyl', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(6, 'Caps', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(7, 'Bags', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(8, 'Stitching', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(9, 'Heat bed', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(10, 'Photostudio Rent', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(11, 'Photoshoot', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(12, 'AI Shoot', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL);

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
(1, 'Pending', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', '', ''),
(2, 'Completed', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', '', ''),
(3, 'Cancelled', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', '', '');

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
(1, 'Services', 'Service-related orders', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(2, 'Products', 'Product-related orders', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL);

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
(1, 'Sublimation', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(2, 'DTF', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(3, 'Vinyl', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(4, 'Siliconprinting', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(5, 'DTG', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', '');

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
(1, 5, 1, 'Test', '2025-01-05 22:28:06', '2025-01-05 22:28:06', '', '', '');

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
(1, 'Tshirt', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(2, 'Short', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(3, 'Tracksuit', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(4, 'Sweatshirt', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(5, 'Hoodie', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(6, 'Jackets', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(7, 'Socks', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(8, 'Poloshirt', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(9, 'Scrub', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL),
(10, 'Longcoat', '2025-01-05 21:15:46', NULL, '2025-01-05 21:15:46', NULL);

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
(1, 'Male', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(2, 'Female', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(3, 'Unisex', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(4, 'Raglan', '2025-01-05 21:15:46', '2025-01-05 21:16:30', '', ''),
(5, 'UK', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `productdetails`
--

CREATE TABLE `productdetails` (
  `Id` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `ProductCutOptionId` int(11) NOT NULL,
  `ProductSizeMeasurementId` int(11) NOT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CreatedBy` varchar(100) DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productdetails`
--

INSERT INTO `productdetails` (`Id`, `ProductId`, `ProductCutOptionId`, `ProductSizeMeasurementId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(2, 1, 2, 1, '2025-01-05 22:29:15', NULL, '2025-01-05 22:29:15', NULL);

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

--
-- Dumping data for table `productsizemeasurements`
--

INSERT INTO `productsizemeasurements` (`Id`, `SizeOptionsId`, `ProductCategoryId`, `ProductCutOptionId`, `SizeMeasurementsId`, `CreatedOn`, `CreatedBy`, `UpdatedOn`, `UpdatedBy`) VALUES
(1, 1, 5, 2, 1, '2025-01-05 22:29:08', NULL, '2025-01-05 22:29:08', NULL);

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
(1, '4', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(2, '6', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(3, '8', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(4, '12', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(5, '14', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(6, 'Small', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(7, 'Medium', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(8, 'Large', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(9, 'XL', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(10, 'XXL', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(11, 'XXXL', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', ''),
(12, 'XXXXL', '2025-01-05 21:15:46', '2025-01-05 21:15:46', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `Password` varchar(255) NOT NULL,
  `CreatedOn` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Email`, `isActive`, `Password`, `CreatedOn`) VALUES
(1, 'test@dev.com', 1, '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `availablecoloroptions`
--
ALTER TABLE `availablecoloroptions`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductId` (`ProductId`);

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
-- Indexes for table `orderitemcolors`
--
ALTER TABLE `orderitemcolors`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `ColorOptionId` (`ColorOptionId`),
  ADD KEY `OrderItemId` (`OrderItemId`);

--
-- Indexes for table `orderitemprintingoptions`
--
ALTER TABLE `orderitemprintingoptions`
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
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderItemId` (`OrderItemId`),
  ADD KEY `PrintingOptionId` (`PrintingOptionId`);

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
  ADD KEY `ProductSizeMeasurementId` (`ProductSizeMeasurementId`);

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientassociates`
--
ALTER TABLE `clientassociates`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientevent`
--
ALTER TABLE `clientevent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clientstatus`
--
ALTER TABLE `clientstatus`
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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `orderitemcolors`
--
ALTER TABLE `orderitemcolors`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderitemprintingoptions`
--
ALTER TABLE `orderitemprintingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orderitemsprintingoptions`
--
ALTER TABLE `orderitemsprintingoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `productcategory`
--
ALTER TABLE `productcategory`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `productcutoptions`
--
ALTER TABLE `productcutoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `productdetails`
--
ALTER TABLE `productdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `productsizemeasurements`
--
ALTER TABLE `productsizemeasurements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sizemeasurements`
--
ALTER TABLE `sizemeasurements`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizeoptions`
--
ALTER TABLE `sizeoptions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  ADD CONSTRAINT `availablecoloroptions_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `product` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `clientassociates`
--
ALTER TABLE `clientassociates`
  ADD CONSTRAINT `clientassociates_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `client` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clientassociates_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `clientstatus` (`Id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_1` FOREIGN KEY (`DocStatusId`) REFERENCES `docstatus` (`Id`),
  ADD CONSTRAINT `document_ibfk_2` FOREIGN KEY (`DocTypeId`) REFERENCES `doctype` (`Id`);

--
-- Constraints for table `orderdoc`
--
ALTER TABLE `orderdoc`
  ADD CONSTRAINT `orderdoc_ibfk_1` FOREIGN KEY (`DocumentId`) REFERENCES `document` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderdoc_ibfk_2` FOREIGN KEY (`DocumentTypeId`) REFERENCES `doctype` (`Id`),
  ADD CONSTRAINT `orderdoc_ibfk_3` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderdoc_ibfk_4` FOREIGN KEY (`OrderItemId`) REFERENCES `orderitems` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `orderitemcolors`
--
ALTER TABLE `orderitemcolors`
  ADD CONSTRAINT `orderitemcolors_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `product` (`Id`),
  ADD CONSTRAINT `orderitemcolors_ibfk_2` FOREIGN KEY (`ColorOptionId`) REFERENCES `availablecoloroptions` (`Id`),
  ADD CONSTRAINT `orderitemcolors_ibfk_3` FOREIGN KEY (`OrderItemId`) REFERENCES `orderitems` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `orderitemsprintingoptions`
--
ALTER TABLE `orderitemsprintingoptions`
  ADD CONSTRAINT `orderitemsprintingoptions_ibfk_1` FOREIGN KEY (`OrderItemId`) REFERENCES `orderitems` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderitemsprintingoptions_ibfk_2` FOREIGN KEY (`PrintingOptionId`) REFERENCES `printingoptions` (`Id`);

--
-- Constraints for table `orderservices`
--
ALTER TABLE `orderservices`
  ADD CONSTRAINT `orderservices_ibfk_1` FOREIGN KEY (`OrderServiceOptionId`) REFERENCES `orderservicesoption` (`Id`);

--
-- Constraints for table `orderservicesmedia`
--
ALTER TABLE `orderservicesmedia`
  ADD CONSTRAINT `orderservicesmedia_ibfk_1` FOREIGN KEY (`OrderServicesId`) REFERENCES `orderservices` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `orderserviceunits`
--
ALTER TABLE `orderserviceunits`
  ADD CONSTRAINT `orderserviceunits_ibfk_1` FOREIGN KEY (`OrderServiceOptionId`) REFERENCES `orderservicesoption` (`Id`);

--
-- Constraints for table `productdetails`
--
ALTER TABLE `productdetails`
  ADD CONSTRAINT `productdetails_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `product` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productdetails_ibfk_2` FOREIGN KEY (`ProductCutOptionId`) REFERENCES `productcutoptions` (`Id`),
  ADD CONSTRAINT `productdetails_ibfk_3` FOREIGN KEY (`ProductSizeMeasurementId`) REFERENCES `productsizemeasurements` (`Id`);

--
-- Constraints for table `productsizemeasurements`
--
ALTER TABLE `productsizemeasurements`
  ADD CONSTRAINT `productsizemeasurements_ibfk_1` FOREIGN KEY (`SizeOptionsId`) REFERENCES `sizeoptions` (`Id`),
  ADD CONSTRAINT `productsizemeasurements_ibfk_2` FOREIGN KEY (`ProductCategoryId`) REFERENCES `productcategory` (`Id`),
  ADD CONSTRAINT `productsizemeasurements_ibfk_3` FOREIGN KEY (`ProductCutOptionId`) REFERENCES `productcutoptions` (`Id`);

--
-- Constraints for table `sizemeasurements`
--
ALTER TABLE `sizemeasurements`
  ADD CONSTRAINT `sizemeasurements_ibfk_1` FOREIGN KEY (`ProductSizeMeasurementsId`) REFERENCES `productsizemeasurements` (`Id`) ON DELETE CASCADE;
COMMIT;
