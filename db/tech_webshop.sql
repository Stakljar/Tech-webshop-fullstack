-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2024 at 04:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tech_webshop`
--
CREATE DATABASE IF NOT EXISTS `tech_webshop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tech_webshop`;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_password` char(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

-- Password is `n532h5unfe`
INSERT INTO `employee` (`username`, `user_password`) VALUES
('employee1', '$2y$10$VFBwaILURaaUL1JZcDan8eB3qS4PaSJN4VNJ.CqDNpHS6X5VQCz2W');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` char(13) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `image_path` varchar(40) DEFAULT NULL,
  `price` decimal(7,2) NOT NULL,
  `product_type` varchar(16) DEFAULT NULL CHECK (`product_type` in ('desktop computer','laptop','monitor','headphones','mouse','keyboard','mousepad')),
  `brand` varchar(6) DEFAULT NULL CHECK (`brand` in ('asus','acer','lenovo','hp','msi','razer','other')),
  `specifications` varchar(520) DEFAULT NULL,
  `current_amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `product_name`, `image_path`, `price`, `product_type`, `brand`, `specifications`, `current_amount`) VALUES
('66a26312dc629', 'ASUS Laptop', 'images/asus_laptop.jpg', 899.99, 'laptop', 'asus', '16GB RAM, 512GB SSD, Intel i7', 10),
('66a263242dc82', 'Acer Desktop', 'images/acer_desktop.jpg', 499.99, 'desktop computer', 'acer', '8GB RAM, 1TB HDD, Intel i5', 5),
('66a26330ea011', 'Lenovo Monitor', 'images/lenovo_monitor.jpg', 149.99, 'monitor', 'lenovo', '24-inch, Full HD', 20),
('66a2634021752', 'HP Laptop', 'images/hp_laptop.jpg', 749.99, 'laptop', 'hp', '16GB RAM, 256GB SSD, Intel i5', 8),
('66a26340a068f', 'MSI Gaming Mouse', 'images/msi_mouse.jpg', 49.99, 'mouse', 'msi', 'RGB, 16000 DPI', 30),
('66a26341084f9', 'Razer Keyboard', 'images/razer_keyboard.jpg', 129.99, 'keyboard', 'razer', 'Mechanical, RGB', 15),
('66a2634154377', 'Acer Monitor', 'images/acer_monitor.jpg', 199.99, 'monitor', 'acer', '27-inch, 4K', 12),
('66a26353c2847', 'Lenovo Mousepad', 'images/lenovo_mousepad.jpg', 19.99, 'mousepad', 'lenovo', 'XXL, Non-slip', 50),
('66a263540153a', 'HP Headphones', 'images/hp_headphones.jpg', 59.99, 'headphones', 'hp', 'Noise-cancelling, Over-ear', 25),
('66a26354297af', 'Asus Desktop', 'images/asus_desktop.jpg', 1099.99, 'desktop computer', 'asus', '32GB RAM, 1TB SSD, Intel i9', 3),
('66a2635473743', 'Razer Laptop', 'images/razer_laptop.jpg', 1499.99, 'laptop', 'razer', '32GB RAM, 1TB SSD, Intel i9', 4),
('66a26366acbf1', 'MSI Monitor', 'images/msi_monitor.jpg', 299.99, 'monitor', 'msi', '32-inch, 144Hz', 10),
('66a2636703089', 'Acer Headphones', 'images/acer_headphones.jpg', 79.99, 'headphones', 'acer', 'Wireless, Over-ear', 18),
('66a263675764e', 'Lenovo Keyboard', 'images/lenovo_keyboard.jpg', 89.99, 'keyboard', 'lenovo', 'Membrane, RGB', 22),
('66a26367c66d7', 'HP Mouse', 'images/hp_mouse.jpg', 39.99, 'mouse', 'hp', 'Wireless, 8000 DPI', 35);

-- --------------------------------------------------------

--
-- Table structure for table `product_transaction`
--

CREATE TABLE `product_transaction` (
  `id` char(13) NOT NULL,
  `user_username` char(13) DEFAULT NULL,
  `product_id` char(13) DEFAULT NULL,
  `recipient_name` varchar(30) NOT NULL,
  `recipient_surname` varchar(40) NOT NULL,
  `recipient_email` varchar(100) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `recipient_address` varchar(150) NOT NULL,
  `recipient_city` varchar(150) NOT NULL,
  `recipient_zip` varchar(13) NOT NULL,
  `recipient_country` varchar(60) NOT NULL,
  `amount` int(11) NOT NULL,
  `transaction_status` varchar(16) DEFAULT 'pending' CHECK (`transaction_status` in ('pending','confirmed','delivered')),
  `order_date` varchar(80) DEFAULT NULL,
  `delivery_date` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_transaction`
--

INSERT INTO `product_transaction` (`id`, `user_username`, `product_id`, `recipient_name`, `recipient_surname`, `recipient_email`, `recipient_phone`, `recipient_address`, `recipient_city`, `recipient_zip`, `recipient_country`, `amount`, `transaction_status`, `order_date`, `delivery_date`) VALUES
('66a263893ee6d', 'user1', '66a26312dc629', 'John', 'Doe', 'john@example.com', '1234567890', '123 Main St', 'New York', '10001', 'USA', 1, 'pending', '2024-07-01', NULL),
('66a2638f61e9b', 'user2', '66a263242dc82', 'Jane', 'Smith', 'jane@example.com', '0987654321', '456 Elm St', 'Los Angeles', '90001', 'USA', 1, 'confirmed', '2024-07-02', NULL),
('66a2638fb83bf', 'user1', '66a26330ea011', 'John', 'Doe', 'john@example.com', '1234567890', '123 Main St', 'New York', '10001', 'USA', 1, 'delivered', '2024-07-03', '2024-07-05'),
('66a263901253f', 'user2', '66a2634021752', 'Jane', 'Smith', 'jane@example.com', '0987654321', '456 Elm St', 'Los Angeles', '90001', 'USA', 1, 'pending', '2024-07-04', NULL),
('66a2639d119df', 'user1', '66a26340a068f', 'John', 'Doe', 'john@example.com', '1234567890', '123 Main St', 'New York', '10001', 'USA', 1, 'confirmed', '2024-07-05', NULL),
('66a263e2b7c09', 'user2', '66a26341084f9', 'Jane', 'Smith', 'jane@example.com', '0987654321', '456 Elm St', 'Los Angeles', '90001', 'USA', 1, 'delivered', '2024-07-06', '2024-07-08');

--
-- Triggers `product_transaction`
--
DELIMITER $$
CREATE TRIGGER `TR_product_transaction_amount` BEFORE INSERT ON `product_transaction` FOR EACH ROW IF NEW.amount > (SELECT current_amount FROM product WHERE id = NEW.product_id LIMIT 1) THEN
		SET @output_text = CONCAT('Ordered amount is greater than the available amount of product in cart: ', (SELECT product_name FROM product WHERE id = NEW.product_id LIMIT 1));
		SIGNAL SQLSTATE '40001'
        SET MESSAGE_TEXT = @output_text;
	END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `TR_product_transaction_date` BEFORE INSERT ON `product_transaction` FOR EACH ROW IF NEW.delivery_date IS NOT NULL AND NEW.transaction_status != 'delivered' THEN
		SIGNAL SQLSTATE '40002'
        SET MESSAGE_TEXT = 'Delivery date cannot be set if status is not changed from confirmed or pending';
	END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `shop_user`
--

CREATE TABLE `shop_user` (
  `username` varchar(30) NOT NULL,
  `user_password` char(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop_user`
--

INSERT INTO `shop_user` (`username`, `user_password`) VALUES
('user1', '$2y$10$RqM/INfpWBdm3R2QYsz6LulN7z.8BImqYQMo7.MmVbqqvi3ASegmO'), -- Password is `h7zu32ghnt`
('user2', '$2y$10$Q/nXhGe5LU7adiCTdTUNwerBlWsfElEXdN/1qbHK24mGJ.5EeZsuq'); -- Password is `casf375m52`

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_transaction`
--
ALTER TABLE `product_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `frkey_product_transaction_user_username` (`user_username`),
  ADD KEY `frkey_product_transaction_product_id` (`product_id`);

--
-- Indexes for table `shop_user`
--
ALTER TABLE `shop_user`
  ADD PRIMARY KEY (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product_transaction`
--
ALTER TABLE `product_transaction`
  ADD CONSTRAINT `frkey_product_transaction_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `frkey_product_transaction_user_username` FOREIGN KEY (`user_username`) REFERENCES `shop_user` (`username`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
