-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2024 at 02:36 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_password` char(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
