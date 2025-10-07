INSERT INTO `app_rights` (`id`, `name`, `group_by`, `CreatedOn`, `CreatedBy`)
VALUES
-- Dashboard
(1, 'View Dashboard', 'Dashboard', NOW(), 'system'),

-- Orders
(2, 'View Orders', 'Orders', NOW(), 'system'),
(3, 'Add Orders', 'Orders', NOW(), 'system'),
(4, 'Update Orders', 'Orders', NOW(), 'system'),
(5, 'Delete Orders', 'Orders', NOW(), 'system'),
(6, 'Re-Order', 'Orders', NOW(), 'system'),

-- Products
(7, 'View Product', 'Products', NOW(), 'system'),
(8, 'Add Product', 'Products', NOW(), 'system'),
(9, 'Update Product', 'Products', NOW(), 'system'),
(10, 'Delete Product', 'Products', NOW(), 'system'),
(11, 'Change Product Status', 'Products', NOW(), 'system'),

-- Product Definitions
(12, 'View Product Definition', 'Product Definitions', NOW(), 'system'),
(13, 'Add Product Definition', 'Product Definitions', NOW(), 'system'),
(14, 'Update Product Definition', 'Product Definitions', NOW(), 'system'),
(15, 'Delete Product Definition', 'Product Definitions', NOW(), 'system'),

-- Shipments
(16, 'View Shipment', 'Shipments', NOW(), 'system'),
(17, 'Add Shipment', 'Shipments', NOW(), 'system'),
(18, 'Update Shipment', 'Shipments', NOW(), 'system'),
(19, 'Delete Shipment', 'Shipments', NOW(), 'system'),

-- Audit Logs
(20, 'View Audit Logs', 'Audit Logs', NOW(), 'system'),

-- Admin Settings
(21, 'View Admin Settings', 'Admin Settings', NOW(), 'system'),
(22, 'Add Admin Settings', 'Admin Settings', NOW(), 'system'),
(23, 'Update Admin Settings', 'Admin Settings', NOW(), 'system'),
(24, 'Delete Admin Settings', 'Admin Settings', NOW(), 'system'),

-- Users
(25, 'View Users', 'Users', NOW(), 'system'),
(26, 'Add Users', 'Users', NOW(), 'system'),
(27, 'Update Users', 'Users', NOW(), 'system'),
(28, 'Delete Users', 'Users', NOW(), 'system'),

-- Roles & Rights
(29, 'View Roles & Rights', 'Roles & Rights', NOW(), 'system'),
(30, 'Add Roles & Rights', 'Roles & Rights', NOW(), 'system'),
(31, 'Update Roles & Rights', 'Roles & Rights', NOW(), 'system'),
(32, 'Delete Roles & Rights', 'Roles & Rights', NOW(), 'system'),

-- Clients
(33, 'View Clients', 'Clients', NOW(), 'system'),
(34, 'Add Clients', 'Clients', NOW(), 'system'),
(35, 'Update Clients', 'Clients', NOW(), 'system'),
(36, 'Delete Clients', 'Clients', NOW(), 'system'),

-- Carriers
(37, 'View Carriers', 'Carriers', NOW(), 'system'),
(38, 'Add Carriers', 'Carriers', NOW(), 'system'),
(39, 'Update Carriers', 'Carriers', NOW(), 'system'),
(40, 'Delete Carriers', 'Carriers', NOW(), 'system'),

-- Events
(41, 'View Events', 'Events', NOW(), 'system'),
(42, 'Add Events', 'Events', NOW(), 'system'),
(43, 'Update Events', 'Events', NOW(), 'system'),
(44, 'Delete Events', 'Events', NOW(), 'system'),

-- Suppliers
(45, 'View Suppliers', 'Suppliers', NOW(), 'system'),
(46, 'Add Suppliers', 'Suppliers', NOW(), 'system'),
(47, 'Update Suppliers', 'Suppliers', NOW(), 'system'),
(48, 'Delete Suppliers', 'Suppliers', NOW(), 'system'),

-- Unit of Measure
(49, 'View Unit of Measure', 'Unit of Measure', NOW(), 'system'),
(50, 'Add Unit of Measure', 'Unit of Measure', NOW(), 'system'),
(51, 'Update Unit of Measure', 'Unit of Measure', NOW(), 'system'),
(52, 'Delete Unit of Measure', 'Unit of Measure', NOW(), 'system'),

-- Inventory Transactions
(53, 'View Inventory Transactions', 'Inventory Transactions', NOW(), 'system'),
(54, 'Add Inventory Transactions', 'Inventory Transactions', NOW(), 'system'),
(55, 'Update Inventory Transactions', 'Inventory Transactions', NOW(), 'system'),
(56, 'Delete Inventory Transactions', 'Inventory Transactions', NOW(), 'system'),

-- Inventory Items
(57, 'View Inventory Items', 'Inventory Items', NOW(), 'system'),
(58, 'Add Inventory Items', 'Inventory Items', NOW(), 'system'),
(59, 'Update Inventory Items', 'Inventory Items', NOW(), 'system'),
(60, 'Delete Inventory Items', 'Inventory Items', NOW(), 'system'),

-- Inventory Sub Category
(61, 'View Inventory Sub Category', 'Inventory Sub Category', NOW(), 'system'),
(62, 'Add Inventory Sub Category', 'Inventory Sub Category', NOW(), 'system'),
(63, 'Update Inventory Sub Category', 'Inventory Sub Category', NOW(), 'system'),
(64, 'Delete Inventory Sub Category', 'Inventory Sub Category', NOW(), 'system'),

-- Inventory Category
(65, 'View Inventory Category', 'Inventory Category', NOW(), 'system'),
(66, 'Add Inventory Category', 'Inventory Category', NOW(), 'system'),
(67, 'Update Inventory Category', 'Inventory Category', NOW(), 'system'),
(68, 'Delete Inventory Category', 'Inventory Category', NOW(), 'system');
