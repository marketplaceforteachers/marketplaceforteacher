-- ============================================================
-- MarketplaceForTeachers.com - Production Database Schema
-- Optimized for MySQL 8.0+ / MariaDB 10.5+ (cPanel phpMyAdmin)
-- Host: cPanel Shared Hosting / Cloud / VPS
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & AUTHENTICATION TABLE
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('guest', 'buyer', 'teacher', 'admin', 'moderator') NOT NULL DEFAULT 'teacher',
  `school_name` VARCHAR(200) NULL,
  `district` VARCHAR(200) NULL,
  `state` VARCHAR(2) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `zip_code` VARCHAR(10) NOT NULL,
  `profile_photo` VARCHAR(255) NULL,
  `verified_teacher` TINYINT(1) NOT NULL DEFAULT 0,
  `verification_badge_type` ENUM('K-12 Public', 'Private/Charter', 'Homeschool', 'Higher Ed') NULL,
  `verification_status` ENUM('unverified', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'unverified',
  `verification_document_url` VARCHAR(255) NULL,
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `sales_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `bio` TEXT NULL,
  `phone` VARCHAR(25) NULL,
  `two_factor_secret` VARCHAR(255) NULL,
  `two_factor_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `email_verified_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_location` (`state`, `city`, `zip_code`),
  INDEX `idx_users_verified` (`verified_teacher`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES TABLE
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Tag',
  `description` TEXT NULL,
  `featured_image` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PRODUCTS & LISTINGS TABLE
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `seller_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` LONGTEXT NOT NULL,
  `condition` ENUM('Brand New', 'Like New', 'Gently Used', 'Fair') NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NULL,
  `stock` INT UNSIGNED NOT NULL DEFAULT 1,
  `status` ENUM('active', 'pending_approval', 'sold', 'draft', 'flagged') NOT NULL DEFAULT 'active',
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `saves_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `state` VARCHAR(2) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `zip_code` VARCHAR(10) NOT NULL,
  `shipping_flat_rate` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
  INDEX `idx_products_status` (`status`, `featured`),
  INDEX `idx_products_price` (`price`),
  INDEX `idx_products_location` (`state`, `zip_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ORDERS TABLE
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `buyer_id` INT UNSIGNED NULL,
  `buyer_name` VARCHAR(120) NOT NULL,
  `buyer_email` VARCHAR(150) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `shipping_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `commission_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'stripe',
  `payment_status` ENUM('Pending', 'Paid', 'Failed', 'Refunded', 'Partially_Refunded') NOT NULL DEFAULT 'Paid',
  `order_status` ENUM('Processing', 'Shipped', 'Delivered', 'Completed', 'Disputed', 'Cancelled') NOT NULL DEFAULT 'Processing',
  `payout_status` ENUM('Pending', 'Held_In_Escrow', 'Eligible', 'Released', 'Refunded') NOT NULL DEFAULT 'Held_In_Escrow',
  `state_name` VARCHAR(50) NOT NULL,
  `state_tax_rate` DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  `shipping_full_name` VARCHAR(120) NOT NULL,
  `shipping_address_line1` VARCHAR(200) NOT NULL,
  `shipping_city` VARCHAR(100) NOT NULL,
  `shipping_state` VARCHAR(2) NOT NULL,
  `shipping_zip` VARCHAR(10) NOT NULL,
  `shipping_phone` VARCHAR(25) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_number` (`order_number`),
  INDEX `idx_orders_status` (`order_status`, `payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DISPUTES TABLE
DROP TABLE IF EXISTS `disputes`;
CREATE TABLE `disputes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `case_number` VARCHAR(50) NOT NULL UNIQUE,
  `opened_by_user_id` INT UNSIGNED NULL,
  `reason` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('open', 'under_review', 'resolved_buyer_refund', 'resolved_seller_payout', 'closed') NOT NULL DEFAULT 'open',
  `refund_amount` DECIMAL(10,2) NULL,
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SEED DEFAULT ADMIN & CATEGORIES
INSERT INTO `categories` (`slug`, `name`, `icon_name`, `description`) VALUES
('hands-on-math', 'Manipulatives & Math Centers', 'Calculator', 'Base ten blocks, fraction towers, counting bears, and geometry kits.'),
('classroom-books', 'Classroom Library Books', 'BookOpen', 'Leveled reader sets, chapter books, picture book collections.'),
('science-stem', 'STEM & Science Kits', 'Microscope', 'Robotics sets, circuit builders, microscopes, and lab kits.'),
('art-crafts', 'Art & Craft Supplies', 'Palette', 'Paint sets, heavy-duty easels, scissors packs, paper assortments.'),
('furniture-storage', 'Storage & Organization', 'Archive', 'Rolling carts, book bins, cubby organizers, teacher desk storage.'),
('bulletin-decor', 'Bulletin Boards & Room Decor', 'Sparkles', 'Borders, calendar pocket charts, educational posters.');

INSERT INTO `users` (`uuid`, `name`, `email`, `password_hash`, `role`, `school_name`, `district`, `state`, `city`, `zip_code`, `verified_teacher`, `rating`, `review_count`, `sales_count`) VALUES
('usr-super-admin-01', 'Platform Operations HQ (Super Admin)', 'admin@marketplaceforteachers.com', '$2a$10$32rJ12x/i0UqJ6.lT5kQyODsQ5N/W.N.1sP9j5B4Q7A9aE1k8jB.G', 'admin', 'Platform Operations HQ', 'Marketplace For Teachers Admin Network', 'OK', 'Oklahoma City', '73159', 1, 5.00, 380, 1420);

SET FOREIGN_KEY_CHECKS = 1;
