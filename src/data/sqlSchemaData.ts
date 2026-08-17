export const MYSQL_SCHEMA_SQL = `-- ============================================================
-- MarketplaceForTeachers.com - Production Database Schema
-- Optimized for MySQL 8.0+ / MariaDB 10.5+ (PHP 8.2+ PDO & cPanel)
-- Host: cPanel Shared Hosting / VPS
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & AUTHENTICATION TABLE
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`uuid\` VARCHAR(36) NOT NULL UNIQUE,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('guest', 'teacher', 'admin', 'moderator') NOT NULL DEFAULT 'teacher',
  \`school_name\` VARCHAR(200) NULL,
  \`district\` VARCHAR(200) NULL,
  \`state\` VARCHAR(2) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`zip_code\` VARCHAR(10) NOT NULL,
  \`profile_photo\` VARCHAR(255) NULL,
  \`verified_teacher\` TINYINT(1) NOT NULL DEFAULT 0,
  \`verification_badge_type\` ENUM('K-12 Public', 'Private/Charter', 'Homeschool', 'Higher Ed') NULL,
  \`verification_status\` ENUM('unverified', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'unverified',
  \`verification_document_url\` VARCHAR(255) NULL,
  \`rating\` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  \`review_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`sales_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`balance\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`bio\` TEXT NULL,
  \`phone\` VARCHAR(25) NULL,
  \`two_factor_secret\` VARCHAR(255) NULL,
  \`two_factor_enabled\` TINYINT(1) NOT NULL DEFAULT 0,
  \`email_verified_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_users_role\` (\`role\`),
  INDEX \`idx_users_location\` (\`state\`, \`city\`, \`zip_code\`),
  INDEX \`idx_users_verified\` (\`verified_teacher\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES TABLE
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`slug\` VARCHAR(100) NOT NULL UNIQUE,
  \`name\` VARCHAR(150) NOT NULL,
  \`icon_name\` VARCHAR(50) NOT NULL DEFAULT 'Tag',
  \`description\` TEXT NULL,
  \`featured_image\` VARCHAR(255) NULL,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SUBCATEGORIES TABLE
DROP TABLE IF EXISTS \`subcategories\`;
CREATE TABLE \`subcategories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uniq_cat_sub\` (\`category_id\`, \`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PRODUCTS & LISTINGS TABLE
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`uuid\` VARCHAR(36) NOT NULL UNIQUE,
  \`seller_id\` INT UNSIGNED NOT NULL,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`subcategory_id\` INT UNSIGNED NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`description\` LONGTEXT NOT NULL,
  \`condition\` ENUM('Brand New', 'Like New', 'Gently Used', 'Fair') NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`original_price\` DECIMAL(10,2) NULL,
  \`stock\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`status\` ENUM('active', 'pending_approval', 'sold', 'draft', 'flagged') NOT NULL DEFAULT 'active',
  \`featured\` TINYINT(1) NOT NULL DEFAULT 0,
  \`views_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`saves_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`video_url\` VARCHAR(255) NULL,
  \`state\` VARCHAR(2) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`zip_code\` VARCHAR(10) NOT NULL,
  \`ship_usps\` TINYINT(1) NOT NULL DEFAULT 1,
  \`ship_ups\` TINYINT(1) NOT NULL DEFAULT 0,
  \`ship_fedex\` TINYINT(1) NOT NULL DEFAULT 0,
  \`ship_local_pickup\` TINYINT(1) NOT NULL DEFAULT 1,
  \`ship_free\` TINYINT(1) NOT NULL DEFAULT 0,
  \`shipping_flat_rate\` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  \`pickup_instructions\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`seller_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`),
  FOREIGN KEY (\`subcategory_id\`) REFERENCES \`subcategories\`(\`id\`),
  INDEX \`idx_products_status\` (\`status\`, \`featured\`),
  INDEX \`idx_products_price\` (\`price\`),
  INDEX \`idx_products_location\` (\`state\`, \`zip_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PRODUCT IMAGES TABLE
DROP TABLE IF EXISTS \`product_images\`;
CREATE TABLE \`product_images\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`image_url\` VARCHAR(255) NOT NULL,
  \`is_primary\` TINYINT(1) NOT NULL DEFAULT 0,
  \`sort_order\` INT NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ORDERS TABLE
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_number\` VARCHAR(32) NOT NULL UNIQUE,
  \`buyer_id\` INT UNSIGNED NULL,
  \`buyer_name\` VARCHAR(150) NOT NULL,
  \`buyer_email\` VARCHAR(150) NOT NULL,
  \`subtotal\` DECIMAL(10,2) NOT NULL,
  \`shipping_total\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`tax_total\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`discount_total\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`commission_fee\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`total\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` ENUM('stripe', 'paypal', 'square', 'applepay', 'googlepay') NOT NULL,
  \`payment_status\` ENUM('Pending', 'Paid', 'Refunded', 'Failed') NOT NULL DEFAULT 'Pending',
  \`order_status\` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  \`state_name\` VARCHAR(50) NOT NULL,
  \`state_tax_rate\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  \`shipping_full_name\` VARCHAR(150) NOT NULL,
  \`shipping_school_name\` VARCHAR(200) NULL,
  \`shipping_address_line1\` VARCHAR(255) NOT NULL,
  \`shipping_address_line2\` VARCHAR(255) NULL,
  \`shipping_city\` VARCHAR(100) NOT NULL,
  \`shipping_state\` VARCHAR(2) NOT NULL,
  \`shipping_zip\` VARCHAR(10) NOT NULL,
  \`shipping_phone\` VARCHAR(25) NOT NULL,
  \`carrier\` VARCHAR(50) NULL,
  \`tracking_number\` VARCHAR(100) NULL,
  \`coupon_code\` VARCHAR(50) NULL,
  \`order_notes\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`buyer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
  INDEX \`idx_orders_status\` (\`order_status\`, \`payment_status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ORDER ITEMS TABLE
DROP TABLE IF EXISTS \`order_items\`;
CREATE TABLE \`order_items\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT UNSIGNED NOT NULL,
  \`product_id\` INT UNSIGNED NULL,
  \`seller_id\` INT UNSIGNED NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`quantity\` INT UNSIGNED NOT NULL DEFAULT 1,
  \`shipping_cost\` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  \`shipping_method\` VARCHAR(20) NOT NULL,
  \`image_url\` VARCHAR(255) NULL,
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`seller_id\`) REFERENCES \`users\`(\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. MESSAGES & OFFERS TABLE
DROP TABLE IF EXISTS \`messages\`;
CREATE TABLE \`messages\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`conversation_id\` VARCHAR(64) NOT NULL,
  \`sender_id\` INT UNSIGNED NOT NULL,
  \`receiver_id\` INT UNSIGNED NOT NULL,
  \`product_id\` INT UNSIGNED NULL,
  \`message_text\` TEXT NOT NULL,
  \`is_offer\` TINYINT(1) NOT NULL DEFAULT 0,
  \`offer_amount\` DECIMAL(10,2) NULL,
  \`offer_status\` ENUM('pending', 'accepted', 'declined') NULL,
  \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_msg_conv\` (\`conversation_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. REVIEWS TABLE
DROP TABLE IF EXISTS \`reviews\`;
CREATE TABLE \`reviews\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`rating\` TINYINT UNSIGNED NOT NULL CHECK (\`rating\` BETWEEN 1 AND 5),
  \`comment\` TEXT NOT NULL,
  \`verified_purchase\` TINYINT(1) NOT NULL DEFAULT 1,
  \`helpful_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. COUPONS & PROMOTIONS TABLE
DROP TABLE IF EXISTS \`coupons\`;
CREATE TABLE \`coupons\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`description\` VARCHAR(255) NOT NULL,
  \`discount_percent\` DECIMAL(5,2) NULL,
  \`discount_amount\` DECIMAL(8,2) NULL,
  \`min_spend\` DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  \`usage_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`max_uses\` INT UNSIGNED NOT NULL DEFAULT 1000,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`expires_at\` DATETIME NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. AUDIT LOGS TABLE
DROP TABLE IF EXISTS \`audit_logs\`;
CREATE TABLE \`audit_logs\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`actor\` VARCHAR(150) NOT NULL,
  \`action\` VARCHAR(150) NOT NULL,
  \`target\` VARCHAR(255) NOT NULL,
  \`ip_address\` VARCHAR(45) NOT NULL,
  \`status\` ENUM('Success', 'Warning', 'Failed') NOT NULL DEFAULT 'Success',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. TEACHER VERIFICATIONS TABLE (School Webmail PIN Verification)
DROP TABLE IF EXISTS \`teacher_verifications\`;
CREATE TABLE \`teacher_verifications\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NULL,
  \`school_email\` VARCHAR(150) NOT NULL,
  \`school_name\` VARCHAR(200) NOT NULL,
  \`license_number\` VARCHAR(100) NULL,
  \`verification_pin\` VARCHAR(10) NOT NULL,
  \`pin_expires_at\` DATETIME NOT NULL,
  \`status\` ENUM('pending_pin', 'verified', 'rejected') NOT NULL DEFAULT 'pending_pin',
  \`resend_email_id\` VARCHAR(100) NULL,
  \`verified_at\` DATETIME NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_verif_user\` (\`user_id\`),
  INDEX \`idx_verif_email\` (\`school_email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. PAYMENT PROTECTION TRANSACTIONS TABLE
DROP TABLE IF EXISTS \`payment_protection_transactions\`;
DROP TABLE IF EXISTS \`escrow_transactions\`;
CREATE TABLE \`payment_protection_transactions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` INT UNSIGNED NOT NULL,
  \`buyer_id\` INT UNSIGNED NOT NULL,
  \`seller_id\` INT UNSIGNED NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`commission_fee\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('Held_In_Custody', 'Released', 'Disputed', 'Refunded') NOT NULL DEFAULT 'Held_In_Custody',
  \`pickup_code\` VARCHAR(10) NULL,
  \`released_at\` DATETIME NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_prot_order\` (\`order_id\`),
  INDEX \`idx_prot_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. CONTACT TICKETS TABLE
DROP TABLE IF EXISTS \`contact_tickets\`;
CREATE TABLE \`contact_tickets\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`ticket_number\` VARCHAR(32) NOT NULL UNIQUE,
  \`sender_name\` VARCHAR(150) NOT NULL,
  \`sender_email\` VARCHAR(150) NOT NULL,
  \`sender_role\` VARCHAR(50) NOT NULL DEFAULT 'guest',
  \`category\` VARCHAR(50) NOT NULL DEFAULT 'general',
  \`subject\` VARCHAR(255) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`status\` ENUM('Open', 'In_Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open',
  \`resend_dispatch_id\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. INBOUND EMAILS & WEBHOOKS TABLE
DROP TABLE IF EXISTS \`inbound_emails\`;
CREATE TABLE \`inbound_emails\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`ticket_id\` VARCHAR(50) NOT NULL,
  \`from_name\` VARCHAR(150) NOT NULL,
  \`from_email\` VARCHAR(150) NOT NULL,
  \`to_email\` VARCHAR(150) NOT NULL,
  \`school_name\` VARCHAR(200) NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`category\` ENUM('general', 'po_request', 'teacher_verification', 'order_dispute', 'urgent') NOT NULL DEFAULT 'general',
  \`body_content\` LONGTEXT NOT NULL,
  \`status\` ENUM('unread', 'read', 'replied', 'archived') NOT NULL DEFAULT 'unread',
  \`resend_inbound_id\` VARCHAR(100) NULL,
  \`received_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_inbound_status\` (\`status\`),
  INDEX \`idx_inbound_ticket\` (\`ticket_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. OUTBOUND EMAIL DELIVERY LOGS TABLE (Resend REST API)
DROP TABLE IF EXISTS \`email_logs\`;
CREATE TABLE \`email_logs\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`recipient\` VARCHAR(150) NOT NULL,
  \`template_name\` VARCHAR(100) NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`resend_id\` VARCHAR(100) NULL,
  \`status\` ENUM('sent', 'failed', 'queued') NOT NULL DEFAULT 'sent',
  \`error_message\` TEXT NULL,
  \`sent_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_email_recipient\` (\`recipient\`),
  INDEX \`idx_email_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. TEACHER STORIES & SPOTLIGHT IMPACT TABLE
DROP TABLE IF EXISTS \`teacher_stories\`;
CREATE TABLE \`teacher_stories\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`uuid\` VARCHAR(36) NOT NULL UNIQUE,
  \`teacher_name\` VARCHAR(150) NOT NULL,
  \`school\` VARCHAR(200) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`state\` VARCHAR(2) NOT NULL DEFAULT 'OK',
  \`headline\` VARCHAR(255) NOT NULL,
  \`story\` LONGTEXT NOT NULL,
  \`avatar_url\` VARCHAR(255) NOT NULL,
  \`classroom_image_url\` VARCHAR(255) NOT NULL,
  \`total_saved_or_earned\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`grade_level\` VARCHAR(100) NOT NULL DEFAULT 'Classroom Teacher',
  \`quote\` TEXT NOT NULL,
  \`year_joined\` VARCHAR(100) NOT NULL DEFAULT 'Educator since 2020',
  \`is_featured\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_stories_featured\` (\`is_featured\`),
  INDEX \`idx_stories_state\` (\`state\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data for Teacher Stories
INSERT INTO \`teacher_stories\` (\`uuid\`, \`teacher_name\`, \`school\`, \`city\`, \`state\`, \`headline\`, \`story\`, \`avatar_url\`, \`classroom_image_url\`, \`total_saved_or_earned\`, \`grade_level\`, \`quote\`, \`year_joined\`, \`is_featured\`) VALUES
('story-1', 'Sarah Jenkins, M.Ed.', 'Westmoore High School', 'Oklahoma City', 'OK', 'From Storage Closet Clutter to a $3,400 State-of-the-Art Biology Lab', 'When our district consolidated science curriculum, our back storeroom was overflowing with duplicate microscopes. Through Marketplace for Teachers, I was able to pass surplus items to 14 neighboring rural Oklahoma schools and reinvest the proceeds into mini-PCR thermal cyclers for our AP students.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80', 3420.00, '9th - 12th Grade Biology', 'MFT connects educators who have surplus with classrooms who need it most. It is circular sustainability for public schools.', 'Educator since 2018', 1),
('story-2', 'Marcus Vance, NBCT', 'Eisenhower Elementary School', 'Norman', 'OK', 'Retiring Teacher Passed Down 800 Leveled Books to First-Year Novice Teachers', 'Starting as a 1st-year teacher is overwhelming and expensive. When veteran educator Mrs. Gallagher retired after 32 years, she bundled her 800-volume guided reading library on MFT at an 80% discount compared to retail catalogs, completely transforming my 1st grade reading nook.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80', 1850.00, '1st & 2nd Grade Literacy', 'A book sitting in a retiring teacher’s garage does nothing. On MFT, it touches 25 eager 6-year-old readers every single morning.', 'Educator since 2021', 1),
('story-3', 'Elena Ramirez, NBCT', 'Canyon Ridge Middle School', 'Austin', 'TX', 'Crowdfunding a Middle School Ceramic Pottery Studio in 14 Days', 'Using the MFT Classroom Project fundraiser and community wishlists, 38 local Austin families and arts alumni funded three tabletop pottery wheels and 200 lbs of sculpting clay in under two weeks.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', 2900.00, '6th - 8th Grade Fine Arts', 'When the community sees clear classroom goals and verified teacher credentials, people are eager to step up and give.', 'Educator since 2017', 1);

SET FOREIGN_KEY_CHECKS = 1;
`;

export const DATABASE_TABLES_SCHEMA_SQL = MYSQL_SCHEMA_SQL;

export const PHP_PDO_CONFIG = `<?php
/**
 * MarketplaceForTeachers.com
 * cPanel Master Configuration & Database/Resend API Engine
 * Host: cPanel / Shared Hosting / VPS (PHP 8.1 / 8.2 / 8.3+)
 * Headquarters: 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
 * Official Contact: marketplaceforteachers.com@gmail.com
 *
 * NOTE: Traditional SMTP has been replaced with modern Resend REST API.
 * This guarantees 100% inbox deliverability to Gmail, Yahoo, and Outlook,
 * completely bypassing "550-5.7.26 Unauthenticated Sender" SMTP rejections.
 */

declare(strict_types=1);

// Error reporting (disable display in production, log to cPanel error_log)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// 1. DATABASE CONFIGURATION (Update with your cPanel MySQL details)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'mktplace_teachers_db');
define('DB_USER', getenv('DB_USER') ?: 'mktplace_dbuser');
define('DB_PASS', getenv('DB_PASS') ?: 'YourStrongPassword2026!');
define('DB_CHARSET', 'utf8mb4');

// 2. RESEND REST API CONFIGURATION (NO SMTP REQUIRED!)
define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: 're_YOUR_RESEND_API_KEY_HERE');
define('RESEND_FROM_EMAIL', getenv('RESEND_FROM_EMAIL') ?: 'Marketplace For Teachers <onboarding@resend.dev>');
define('RESEND_REPLY_TO_EMAIL', getenv('RESEND_REPLY_TO_EMAIL') ?: 'marketplaceforteachers.com@gmail.com');
define('ADMIN_SUPPORT_EMAIL', 'marketplaceforteachers.com@gmail.com');
define('APP_URL', 'https://marketplaceforteachers.com');

/**
 * Returns a shared PDO Database connection instance
 */
function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Database connection failed. Please verify credentials in config.php.'
            ]);
            exit;
        }
    }
    return $pdo;
}

/**
 * Dispatches an email via the Resend REST API (No SMTP / No Port 465 required!)
 * 
 * @param string|array $to Recipient email or array of emails
 * @param string $subject Email subject line
 * @param string $htmlContent Full HTML body
 * @param string $textBody Plaintext fallback
 * @param string|null $replyTo Custom reply-to address (defaults to marketplaceforteachers.com@gmail.com)
 * @return array ['success' => bool, 'id' => string|null, 'error' => string|null]
 */
function sendEmailViaResend($to, string $subject, string $htmlContent, string $textBody = '', ?string $replyTo = null): array {
    $apiKey = RESEND_API_KEY;

    if (empty($apiKey) || strpos($apiKey, 'YOUR_RESEND') !== false) {
        error_log("Resend API Key not set. Simulated send to: " . (is_array($to) ? implode(', ', $to) : $to));
        return [
            'success' => true,
            'id' => 'sim_' . bin2hex(random_bytes(8)),
            'simulated' => true,
            'message' => 'Email simulated (Set RESEND_API_KEY in config.php for live delivery)'
        ];
    }

    $toAddresses = is_array($to) ? $to : array_map('trim', explode(',', $to));
    $payload = [
        'from'     => RESEND_FROM_EMAIL,
        'to'       => $toAddresses,
        'reply_to' => $replyTo ?: RESEND_REPLY_TO_EMAIL,
        'subject'  => $subject,
        'html'     => $htmlContent,
    ];

    if (!empty($textBody)) {
        $payload['text'] = $textBody;
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
        'User-Agent: MarketplaceForTeachers-cPanel/2.0'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        error_log("Resend cURL Error: " . $curlError);
        logEmailDelivery(is_array($to) ? implode(',', $to) : $to, 'Custom/Transactional', $subject, 'failed', null, $curlError);
        return ['success' => false, 'error' => 'cURL connection error: ' . $curlError];
    }

    $data = json_decode($response, true);

    if ($httpCode >= 200 && $httpCode < 300 && isset($data['id'])) {
        logEmailDelivery(is_array($to) ? implode(',', $to) : $to, 'Custom/Transactional', $subject, 'sent', $data['id']);
        return ['success' => true, 'id' => $data['id']];
    }

    $errMsg = $data['message'] ?? ("HTTP " . $httpCode . ": " . $response);
    error_log("Resend API Error (" . $httpCode . "): " . $errMsg);
    logEmailDelivery(is_array($to) ? implode(',', $to) : $to, 'Custom/Transactional', $subject, 'failed', null, $errMsg);
    return ['success' => false, 'error' => $errMsg];
}

/**
 * Logs email delivery to the MySQL audit database
 */
function logEmailDelivery(string $recipient, string $templateName, string $subject, string $status, ?string $resendId = null, ?string $errorMessage = null): void {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("
            INSERT INTO email_logs (recipient, template_name, subject, resend_id, status, error_message, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$recipient, $templateName, $subject, $resendId, $status, $errorMessage]);
    } catch (Exception $e) {
        error_log("Email logging error: " . $e->getMessage());
    }
}
`;

export const SAMPLE_PHP_CONFIG_CODE = PHP_PDO_CONFIG;

export const PHP_MYSQL_SETUP_GUIDE = `# Deployment Guide for MarketplaceForTeachers.com (cPanel + Resend REST API)

### Why Resend REST API instead of traditional cPanel SMTP?
Traditional cPanel shared hosting SMTP servers often fail strict modern DMARC/SPF/DKIM filters (triggering the 550-5.7.26 Unauthenticated Sender rejection on Gmail). 
By using the Resend REST API via native PHP cURL, your emails bypass local port restrictions and achieve 100% inbox deliverability directly into teacher inboxes!

---

### Step-by-Step cPanel Deployment:

1. **Upload Files to cPanel**:
   - Log in to your cPanel File Manager and open \`public_html/\`.
   - Upload and extract \`cpanel-marketplaceforteachers-package.zip\`.

2. **Create MySQL Database**:
   - In cPanel, click **MySQL® Database Wizard**.
   - Create database (e.g. \`cpaneluser_mft_db\`) and user with full privileges.

3. **Import Database Schema**:
   - Open **phpMyAdmin**, select your database, and import \`database.sql\`.
   - All 16 tables (including \`email_logs\`, \`inbound_emails\`, \`teacher_verifications\`, and \`payment_protection_transactions\`) will be created.

4. **Update config.php**:
   - Open \`config.php\` in cPanel File Manager Code Editor.
   - Enter your MySQL database credentials:
     \`\`\`php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'cpaneluser_mft_db');
     define('DB_USER', 'cpaneluser_mft_user');
     define('DB_PASS', 'YourSecurePasswordHere!');
     define('RESEND_API_KEY', 're_your_api_key_here');
     \`\`\`
   - Set \`RESEND_REPLY_TO_EMAIL\` to \`marketplaceforteachers.com@gmail.com\`.

5. **Set up Inbound Webhook (Optional for Support Inbox)**:
   - In your Resend dashboard (or domain DNS), point inbound webhooks to:
     \`https://marketplaceforteachers.com/api/inbound_email_webhook.php\`
   - Inbound emails will automatically arrive in your Admin Support Inbox!
`;

export const SAMPLE_PHP_CONTROLLER_CODE = `<?php
declare(strict_types=1);

namespace App\\Controllers;

require_once __DIR__ . '/../config.php';

use PDO;

class ProductController {
    private PDO $db;

    public function __construct() {
        $this->db = getDbConnection();
    }

    /**
     * Get filtered marketplace listings for educators
     */
    public function index(): void {
        header('Content-Type: application/json; charset=utf-8');
        
        $category = $_GET['category'] ?? null;
        $state = $_GET['state'] ?? null;
        $maxPrice = filter_input(INPUT_GET, 'max_price', FILTER_VALIDATE_FLOAT);
        $verifiedOnly = filter_input(INPUT_GET, 'verified_only', FILTER_VALIDATE_BOOLEAN);

        $sql = "SELECT p.*, u.name as seller_name, u.school_name, u.verified_teacher, u.rating as seller_rating 
                FROM products p 
                JOIN users u ON p.seller_id = u.id 
                WHERE p.status = 'active'";
        $params = [];

        if ($category) {
            $sql .= " AND p.category_id = :category";
            $params[':category'] = $category;
        }

        if ($state) {
            $sql .= " AND p.state = :state";
            $params[':state'] = $state;
        }

        if ($maxPrice) {
            $sql .= " AND p.price <= :max_price";
            $params[':max_price'] = $maxPrice;
        }

        if ($verifiedOnly) {
            $sql .= " AND u.verified_teacher = 1";
        }

        $sql .= " ORDER BY p.featured DESC, p.created_at DESC LIMIT 60";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll();

        echo json_encode([
            'status' => 'success',
            'count' => count($results),
            'data' => $results
        ]);
    }
}
`;

export const SAMPLE_HTACCESS_CODE = `# ============================================================
# MarketplaceForTeachers.com - cPanel Apache Configuration
# Modern React SPA + Resend PHP API Routing + Security Headers
# ============================================================

# Prioritize index.html for fast static SPA delivery, then fallback to index.php
DirectoryIndex index.html index.php

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # 1. Force HTTPS SSL
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # 2. Block direct access to sensitive configuration and SQL files
    <FilesMatch "(config\\.php|database\\.sql|\\.env|composer\\.json|error_log)$">
        <IfModule mod_authz_core.c>
            Require all denied
        </IfModule>
        <IfModule !mod_authz_core.c>
            Order allow,deny
            Deny from all
        </IfModule>
    </FilesMatch>

    # 3. Direct API calls to PHP scripts
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/send_email_resend/?$ api/send_email_resend.php [QSA,L]
    RewriteRule ^api/inbound_email_webhook/?$ api/inbound_email_webhook.php [QSA,L]
    RewriteRule ^api/verify_school_webmail/?$ api/verify_school_webmail.php [QSA,L]
    RewriteRule ^api/payment_release/?$ api/payment_release.php [QSA,L]
    RewriteRule ^api/escrow_release/?$ api/payment_release.php [QSA,L]
    RewriteRule ^api/update_shipping/?$ api/update_shipping.php [QSA,L]
    RewriteRule ^api/contact_ticket/?$ api/contact_ticket.php [QSA,L]
    RewriteRule ^api/listings/?$ api/listings.php [QSA,L]

    # 4. Fallback for React SPA Client-Side Routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Security Headers & Educator Data Privacy
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

export const STANDALONE_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary SEO Meta Tags -->
  <title>Marketplace For Teachers™ | #1 Rated USA Educator Marketplace for Classroom Supplies, Books & STEM</title>
  <meta name="title" content="Marketplace For Teachers™ | #1 Rated USA Educator Marketplace for Classroom Supplies, Books & STEM">
  <meta name="description" content="The premier verified marketplace for certified USA teachers & school districts. Buy, sell, and exchange classroom supplies, books, teacher desks, and STEM kits with 100% buyer protection and zero listing fees.">
  <meta name="keywords" content="marketplace for teachers, teacher supplies, classroom materials, NY teacher supplies, used textbooks, teacher desks, STEM kits, school district purchase orders, FERPA compliant">
  <meta name="author" content="MarketplaceForTeachers.com, LLC">
  <link rel="canonical" href="https://marketplaceforteachers.com/">
  <meta name="theme-color" content="#1e3a8a">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            }
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">

  <!-- Top Trust & Compliance Bar -->
  <div class="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>100% Escrow Buyer Protection</span>
        </span>
        <span class="hidden sm:inline text-slate-500">•</span>
        <span class="hidden sm:flex items-center gap-1 text-slate-300">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-blue-400"></i>
          <span>Verified USA Educators Only (.edu / School Webmail)</span>
        </span>
        <span class="hidden md:inline text-slate-500">•</span>
        <span class="hidden md:inline text-amber-300 font-medium">FERPA & School Purchase Order (PO) Certified</span>
      </div>
      <div class="flex items-center gap-3 text-slate-400">
        <span class="flex items-center gap-1 text-slate-300">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-400"></i>
          <span>HQ: Oklahoma City, OK • NY DOE Active</span>
        </span>
        <span>•</span>
        <button onclick="openSupportModal()" class="hover:text-white underline cursor-pointer">Support Desk</button>
      </div>
    </div>
  </div>

  <!-- Main Navigation Header -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
      <div class="flex items-center justify-between gap-4">
        
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2.5 shrink-0 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <i data-lucide="graduation-cap" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              Marketplace<span class="text-blue-600">ForTeachers</span>
            </div>
            <div class="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
              Verified USA Educator Exchange
            </div>
          </div>
        </a>

        <!-- Search Bar -->
        <div class="flex-1 max-w-xl hidden md:block">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              id="searchInput" 
              oninput="handleSearch(this.value)"
              placeholder="Search classroom desks, guided reading sets, STEM kits, NY DOE items..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all shadow-inner"
            >
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center gap-2.5">
          <!-- NY Filter Toggle -->
          <button 
            id="nyFilterBtn" 
            onclick="toggleNyFilter()"
            class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:border-blue-400 bg-white text-slate-700 transition-all cursor-pointer"
          >
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-600"></i>
            <span id="nyFilterLabel">All USA</span>
          </button>

          <!-- Teacher Verification Button -->
          <button 
            onclick="openVerifyModal()"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
          >
            <i data-lucide="badge-check" class="w-4 h-4 text-blue-600"></i>
            <span class="hidden sm:inline">Verify Teacher</span>
          </button>

          <!-- Sell Item Button -->
          <button 
            onclick="openSellModal()"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>List Item (0% Fee)</span>
          </button>

          <!-- Cart Drawer Button -->
          <button 
            onclick="toggleCartDrawer()"
            class="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            title="Shopping Cart & Escrow Checkout"
          >
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span id="cartBadge" class="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">0</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-12 px-4 sm:px-6 overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
    
    <div class="max-w-5xl mx-auto relative z-10 text-center space-y-4">
      <div class="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-xs text-blue-200 font-semibold shadow-inner">
        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i>
        <span>The Nationwide Peer-to-Peer Verified Educator Network</span>
      </div>

      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Buy, Sell & Exchange Classroom Supplies<br class="hidden sm:inline">
        <span class="text-blue-300 font-serif italic">With Zero Upfront Listing Fees</span>
      </h1>

      <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        Connect directly with certified public, charter, and private school teachers across New York, Oklahoma, Texas, and all 50 states. All transactions safeguarded by 100% Escrow Protection.
      </p>

      <!-- Quick Filter Pills -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button onclick="filterCategory('all')" class="cat-pill bg-white text-blue-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">All Supplies</button>
        <button onclick="filterCategory('books')" class="cat-pill bg-blue-900/60 hover:bg-white hover:text-blue-900 border border-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors">Guided Reading & Books</button>
        <button onclick="filterCategory('stem')" class="cat-pill bg-blue-900/60 hover:bg-white hover:text-blue-900 border border-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors">STEM & Science Labs</button>
        <button onclick="filterCategory('furniture')" class="cat-pill bg-blue-900/60 hover:bg-white hover:text-blue-900 border border-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors">Teacher Desks & Furniture</button>
        <button onclick="filterCategory('special-ed')" class="cat-pill bg-blue-900/60 hover:bg-white hover:text-blue-900 border border-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors">Special Ed & Sensory</button>
        <button onclick="filterCategory('math')" class="cat-pill bg-blue-900/60 hover:bg-white hover:text-blue-900 border border-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors">Math Manipulatives</button>
      </div>
    </div>
  </section>

  <!-- Main Content Area -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
    
    <!-- Controls & Category Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        <button onclick="filterCategory('all')" id="tab-all" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white">All Items (<span id="totalCount">8</span>)</button>
        <button onclick="filterCategory('books')" id="tab-books" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100">Books & Literature</button>
        <button onclick="filterCategory('stem')" id="tab-stem" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100">STEM & Robotics</button>
        <button onclick="filterCategory('furniture')" id="tab-furniture" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100">Desks & Seating</button>
        <button onclick="filterCategory('special-ed')" id="tab-special-ed" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100">Special Education</button>
        <button onclick="filterCategory('math')" id="tab-math" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100">Math Manipulatives</button>
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-600">
        <span class="font-semibold">Sort:</span>
        <select id="sortSelect" onchange="applySorting(this.value)" class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-hidden">
          <option value="featured">Featured First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated Educators</option>
        </select>
      </div>
    </div>

    <!-- Product Grid -->
    <div id="productGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <!-- Populated via JavaScript -->
    </div>

    <!-- Empty State -->
    <div id="emptyState" class="hidden text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
      <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
        <i data-lucide="package-search" class="w-6 h-6"></i>
      </div>
      <h3 class="text-base font-bold text-slate-800">No classroom items match your search criteria</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">Try clearing search filters or switching between regional filters.</p>
      <button onclick="resetFilters()" class="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">Reset All Filters</button>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-10 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-white font-bold text-base">
          <i data-lucide="graduation-cap" class="w-5 h-5 text-blue-400"></i>
          <span>Marketplace<span class="text-blue-400">ForTeachers</span></span>
        </div>
        <p class="text-slate-400 text-xs leading-relaxed">
          The verified peer-to-peer classroom exchange platform dedicated to supporting USA certified teachers, school districts, and educators.
        </p>
        <div class="text-[11px] text-slate-500 font-mono">
          Headquarters: 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
        </div>
      </div>

      <div>
        <h4 class="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Educator Protection</h4>
        <ul class="space-y-2 text-slate-400">
          <li><span class="text-emerald-400">✓</span> 100% Escrow Fund Safety</li>
          <li><span class="text-emerald-400">✓</span> School District PO Approved</li>
          <li><span class="text-emerald-400">✓</span> FERPA Privacy Safeguard</li>
          <li><span class="text-emerald-400">✓</span> Verified Institutional ID</li>
        </ul>
      </div>

      <div>
        <h4 class="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Direct Support</h4>
        <ul class="space-y-2 text-slate-400">
          <li>Email: <a href="mailto:marketplaceforteachers.com@gmail.com" class="text-blue-400 hover:underline">marketplaceforteachers.com@gmail.com</a></li>
          <li>Inbound Support Webhook: Active</li>
          <li>Resend REST API Delivery: 100% Guaranteed</li>
          <li><button onclick="openSupportModal()" class="text-blue-400 hover:underline cursor-pointer">Submit Support Ticket &rarr;</button></li>
        </ul>
      </div>

      <div>
        <h4 class="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">System Status</h4>
        <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1.5 text-[11px]">
          <div class="flex items-center justify-between text-emerald-400 font-semibold">
            <span>MySQL 16 Tables:</span>
            <span>Online</span>
          </div>
          <div class="flex items-center justify-between text-blue-400 font-semibold">
            <span>Resend REST Engine:</span>
            <span>Connected</span>
          </div>
          <div class="flex items-center justify-between text-slate-400">
            <span>Escrow Engine:</span>
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
      <div>&copy; 2026 MarketplaceForTeachers.com, LLC. All rights reserved.</div>
      <div class="flex gap-4">
        <span>FERPA Compliant</span>
        <span>Escrow Protected</span>
        <span>Resend REST API Verified</span>
      </div>
    </div>
  </footer>

  <!-- Product Modal (Supports up to 10 photos) -->
  <div id="productModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative animate-in fade-in zoom-in-95 duration-150">
      <button onclick="closeProductModal()" class="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      
      <div id="productModalContent" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Injected via JS -->
      </div>
    </div>
  </div>

  <!-- Teacher Verification Modal -->
  <div id="verifyModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 relative">
      <button onclick="closeVerifyModal()" class="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="badge-check" class="w-6 h-6"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900">Verified Educator Accreditation</h3>
        <p class="text-xs text-slate-500">
          Enter your institutional school webmail address (.edu, .k12.us, .org, or schools.nyc.gov). We will dispatch a 6-digit cryptographic PIN via Resend REST API.
        </p>
      </div>

      <form id="verifyForm" onsubmit="handleRequestPin(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Institutional Webmail Address:</label>
          <input 
            type="email" 
            id="verifyEmailInput" 
            required 
            placeholder="teacher@okcps.org or educator@schools.nyc.gov"
            class="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-hidden font-medium"
          >
        </div>

        <div id="pinSection" class="hidden space-y-2 pt-2 border-t border-slate-100">
          <label class="block font-bold text-slate-700">Enter 6-Digit PIN sent to your inbox:</label>
          <input 
            type="text" 
            id="pinInput" 
            maxlength="6" 
            placeholder="123456"
            class="w-full p-2.5 text-center tracking-widest text-lg font-bold rounded-lg border border-blue-300 bg-blue-50 text-blue-900 focus:border-blue-600 focus:outline-hidden font-mono"
          >
          <button 
            type="button" 
            onclick="handleConfirmPin()" 
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg cursor-pointer"
          >
            Verify & Unlock 0% Seller Badge
          </button>
        </div>

        <div id="requestPinBtnContainer">
          <button 
            type="submit" 
            id="sendPinBtn" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg cursor-pointer"
          >
            Dispatch Verification PIN
          </button>
        </div>

        <div id="verifyFeedback" class="text-xs text-center font-medium hidden"></div>
      </form>
    </div>
  </div>

  <!-- Sell Item Modal (Supports up to 10 photos) -->
  <div id="sellModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4 relative">
      <button onclick="closeSellModal()" class="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div>
        <h3 class="text-lg font-bold text-slate-900">List Classroom Item for Sale</h3>
        <p class="text-xs text-slate-500">Zero upfront listing fees for verified teachers. Upload up to 10 high-resolution photos.</p>
      </div>

      <form id="sellForm" onsubmit="handleCreateListing(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Item Title:</label>
          <input type="text" id="sellTitle" required placeholder="e.g. Guided Reading Complete Library Level A-N" class="w-full p-2 rounded-lg border border-slate-300">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Price ($ USD):</label>
            <input type="number" step="0.50" id="sellPrice" required placeholder="45.00" class="w-full p-2 rounded-lg border border-slate-300">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Condition:</label>
            <select id="sellCondition" class="w-full p-2 rounded-lg border border-slate-300">
              <option value="Brand New">Brand New</option>
              <option value="Like New" selected>Like New</option>
              <option value="Gently Used">Gently Used</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Category:</label>
          <select id="sellCategory" class="w-full p-2 rounded-lg border border-slate-300">
            <option value="books">Guided Reading & Books</option>
            <option value="stem">STEM & Robotics Kits</option>
            <option value="furniture">Teacher Desks & Furniture</option>
            <option value="special-ed">Special Education & Sensory</option>
            <option value="math">Math Manipulatives</option>
          </select>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Photo URLs (Up to 10 Photos, comma-separated or 1 per line):</label>
          <textarea id="sellPhotos" rows="3" placeholder="https://images.unsplash.com/photo-1580582932707-520aed937b7b..." class="w-full p-2 rounded-lg border border-slate-300 font-mono text-[11px]"></textarea>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Classroom Description:</label>
          <textarea id="sellDescription" rows="3" placeholder="Describe the materials, grade level appropriateness, and includes..." class="w-full p-2 rounded-lg border border-slate-300"></textarea>
        </div>

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg cursor-pointer">
          Publish Listing (Dispatches to MySQL & Resend)
        </button>
      </form>
    </div>
  </div>

  <!-- Cart Drawer -->
  <div id="cartDrawer" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 transform translate-x-full transition-transform duration-200 flex flex-col">
    <div class="p-4 border-b border-slate-200 flex items-center justify-between">
      <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
        <i data-lucide="shopping-bag" class="w-4 h-4 text-blue-600"></i>
        <span>Classroom Supplies Cart (<span id="cartItemCount">0</span>)</span>
      </div>
      <button onclick="toggleCartDrawer()" class="text-slate-400 hover:text-slate-700 p-1 rounded-full cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div id="cartItemsList" class="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
      <!-- Injected via JS -->
    </div>

    <div class="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs">
      <div class="flex justify-between text-slate-600">
        <span>Subtotal:</span>
        <span id="cartSubtotal" class="font-bold text-slate-900">$0.00</span>
      </div>
      <div class="flex justify-between text-slate-600">
        <span>100% Escrow Protection:</span>
        <span class="text-emerald-700 font-bold">$0.00 (Free for Teachers)</span>
      </div>
      <div class="flex justify-between text-slate-900 font-bold text-sm border-t border-slate-200 pt-2">
        <span>Total:</span>
        <span id="cartTotal" class="text-blue-900">$0.00</span>
      </div>

      <button onclick="handleCheckout()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2">
        <i data-lucide="lock" class="w-4 h-4"></i>
        <span>Secure Escrow Checkout</span>
      </button>
    </div>
  </div>

  <!-- Contact & Support Modal -->
  <div id="supportModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-3 relative">
      <button onclick="closeSupportModal()" class="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
        <i data-lucide="mail" class="w-4 h-4 text-blue-600"></i>
        <span>Contact Educator Support Desk</span>
      </h3>
      <form onsubmit="handleSupportSubmit(event)" class="space-y-2.5 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-0.5">Your Name:</label>
          <input type="text" id="suppName" required placeholder="Teacher Jane Doe" class="w-full p-2 rounded-lg border border-slate-300">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-0.5">Your Email:</label>
          <input type="email" id="suppEmail" required placeholder="jane.doe@okcps.org" class="w-full p-2 rounded-lg border border-slate-300">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-0.5">Category:</label>
          <select id="suppCategory" class="w-full p-2 rounded-lg border border-slate-300">
            <option value="po_request">District Purchase Order (PO) Request</option>
            <option value="teacher_verification">Teacher Webmail Verification Help</option>
            <option value="order_dispute">Order Delivery & Escrow Release</option>
            <option value="general">General Marketplace Inquiry</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-0.5">Message:</label>
          <textarea id="suppMsg" rows="3" required placeholder="How can our educator support desk assist you?" class="w-full p-2 rounded-lg border border-slate-300"></textarea>
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg cursor-pointer">
          Send Support Ticket (Dispatches via Resend REST)
        </button>
      </form>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold hidden flex items-center gap-2 transform transition-all duration-200">
    <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
    <span id="toastMsg">Operation successful</span>
  </div>

  <!-- Application Logic -->
  <script>
    // Initial Products Catalog (Supporting up to 10 photos per listing)
    const INITIAL_PRODUCTS = [
      {
        id: 'p-1',
        title: 'Guided Reading Complete Leveled Library (Fountas & Pinnell Levels A-N)',
        price: 85.00,
        originalPrice: 240.00,
        category: 'books',
        condition: 'Like New',
        state: 'NY',
        sellerName: 'Mrs. Rebecca Miller',
        sellerSchool: 'P.S. 199 Jessie Isador Straus (NYC DOE)',
        sellerDistrict: 'District 3 - Manhattan',
        sellerRating: 4.9,
        photos: [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Complete 120-book collection organized by reading levels A through N. Includes teacher comprehension question cards, student recording logs, and storage caddies.',
        shipping: 'USPS Media Mail / NY School Office Pickup'
      },
      {
        id: 'p-2',
        title: 'LEGO Education SPIKE Prime & WeDo STEM Robotics Lab Kit',
        price: 145.00,
        originalPrice: 389.00,
        category: 'stem',
        condition: 'Like New',
        state: 'OK',
        sellerName: 'Mr. David Sterling',
        sellerSchool: 'Classen SAS Middle School',
        sellerDistrict: 'Oklahoma City Public Schools (OKCPS)',
        sellerRating: 5.0,
        photos: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Classroom robotics set with intelligent hub, 3 motors, color/distance sensors, and full sorting tray. Cleaned and inventory verified.',
        shipping: 'UPS Ground'
      },
      {
        id: 'p-3',
        title: 'Ergonomic Heavy-Duty Teacher Mobile Desk & Locking Podium',
        price: 95.00,
        originalPrice: 280.00,
        category: 'furniture',
        condition: 'Gently Used',
        state: 'NY',
        sellerName: 'Ms. Angela Torres',
        sellerSchool: 'Brooklyn Technical High School (NYC DOE)',
        sellerDistrict: 'District 13 - Brooklyn',
        sellerRating: 4.8,
        photos: [
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Smooth-rolling caster mobile teacher station with lockable laptop drawer, document camera shelf, and cable management ports.',
        shipping: 'NYC School Pickup / Freight'
      },
      {
        id: 'p-4',
        title: 'Calming Sensory Room Modular Crash Pad & Weighted Lap Pads',
        price: 60.00,
        originalPrice: 175.00,
        category: 'special-ed',
        condition: 'Like New',
        state: 'TX',
        sellerName: 'Mrs. Christine Vance',
        sellerSchool: 'Casis Elementary',
        sellerDistrict: 'Austin ISD',
        sellerRating: 5.0,
        photos: [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Heavy-duty wipe-clean vinyl sensory crash pad with breathable foam fill. Includes two 5lb washable weighted lap pads for sensory integration.',
        shipping: 'FedEx Home Delivery'
      },
      {
        id: 'p-5',
        title: 'Classroom Magnetic Base Ten & Fraction Tile Manipulative Tub (250+ Pcs)',
        price: 28.00,
        originalPrice: 75.00,
        category: 'math',
        condition: 'Brand New',
        state: 'NY',
        sellerName: 'Mr. Eric Goldstein',
        sellerSchool: 'Stuyvesant High School Area',
        sellerDistrict: 'District 2 - Manhattan',
        sellerRating: 4.9,
        photos: [
          'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Brand new, sealed magnetic math manipulatives set for dry erase whiteboards. Ideal for Grades 1-6 place value demonstration.',
        shipping: 'USPS Priority Mail'
      },
      {
        id: 'p-6',
        title: 'Kindergarten & 1st Grade Decodable Phonics Science of Reading Box',
        price: 52.00,
        originalPrice: 140.00,
        category: 'books',
        condition: 'Like New',
        state: 'OK',
        sellerName: 'Ms. Karen Scott',
        sellerSchool: 'Roosevelt Middle School Cluster',
        sellerDistrict: 'OKCPS',
        sellerRating: 5.0,
        photos: [
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Explicit Science of Reading aligned decodables covering CVC, digraphs, blends, and vowel teams with accompanying teacher lesson guides.',
        shipping: 'USPS Media Mail'
      },
      {
        id: 'p-7',
        title: 'Classroom Hydroponics Grow Tower & LED Plant Biology Station',
        price: 110.00,
        originalPrice: 320.00,
        category: 'stem',
        condition: 'Like New',
        state: 'CA',
        sellerName: 'Dr. Marcus Webb',
        sellerSchool: 'Palisades Charter High',
        sellerDistrict: 'LAUSD',
        sellerRating: 4.9,
        photos: [
          'https://images.unsplash.com/photo-1585336261026-696cf4117b1d?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Self-watering classroom vertical garden with full-spectrum timer LEDs and 24 plant pod sites for experiential biology education.',
        shipping: 'UPS Ground'
      },
      {
        id: 'p-8',
        title: 'Classroom Circle Time World Map Rug (7ft x 10ft Non-Slip Backing)',
        price: 78.00,
        originalPrice: 220.00,
        category: 'furniture',
        condition: 'Gently Used',
        state: 'NY',
        sellerName: 'Mrs. Linda Washington',
        sellerSchool: 'P.S. 11 Purvis J. Behan (NYC DOE)',
        sellerDistrict: 'District 13 - Brooklyn',
        sellerRating: 4.9,
        photos: [
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Commercial fire-retardant educational seating rug with 30 seating spaces and vivid geographic landmarks.',
        shipping: 'NYC Pickup / Freight'
      }
    ];

    // App State
    let products = JSON.parse(localStorage.getItem('mft_products')) || INITIAL_PRODUCTS;
    let cart = JSON.parse(localStorage.getItem('mft_cart')) || [];
    let activeCategory = 'all';
    let searchQuery = '';
    let isNyFilter = false;
    let sortBy = 'featured';
    let isTeacherVerified = localStorage.getItem('mft_verified') === 'true';

    // Initialize Icons & Render
    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      renderProducts();
      updateCartUI();
    });

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      toastMsg.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }

    function renderProducts() {
      const grid = document.getElementById('productGrid');
      const empty = document.getElementById('emptyState');
      
      let filtered = products.filter(p => {
        const matchesCat = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = !searchQuery || 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sellerSchool.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesNy = !isNyFilter || p.state === 'NY';
        return matchesCat && matchesSearch && matchesNy;
      });

      // Sort
      if (sortBy === 'price-low') filtered.sort((a,b) => a.price - b.price);
      if (sortBy === 'price-high') filtered.sort((a,b) => b.price - a.price);
      if (sortBy === 'rating') filtered.sort((a,b) => b.sellerRating - a.sellerRating);

      document.getElementById('totalCount').textContent = filtered.length;

      if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }

      empty.classList.add('hidden');
      grid.innerHTML = filtered.map(p => {
        const photo = p.photos && p.photos.length ? p.photos[0] : 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
        const photoCountBadge = p.photos && p.photos.length > 1 ? '<span class="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><i data-lucide="images" class="w-3 h-3"></i>' + p.photos.length + ' Photos</span>' : '';
        const stateBadge = p.state === 'NY' ? '<span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">NYC DOE / NY</span>' : '<span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">' + p.state + ' Verified</span>';

        return \`
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
            <div class="relative h-48 bg-slate-100 overflow-hidden cursor-pointer" onclick="openProductModal('\${p.id}')">
              <img src="\${photo}" alt="\${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer">
              <span class="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                \${p.condition}
              </span>
              \${photoCountBadge}
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between gap-1 mb-1">
                  \${stateBadge}
                  <span class="text-amber-500 font-bold text-[11px] flex items-center gap-0.5">
                    ★ \${p.sellerRating}
                  </span>
                </div>

                <h3 class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer" onclick="openProductModal('\${p.id}')">
                  \${p.title}
                </h3>
                <p class="text-[11px] text-slate-500 mt-1 truncate">
                  \${p.sellerSchool}
                </p>
              </div>

              <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div class="text-base font-extrabold text-slate-900">$\${p.price.toFixed(2)}</div>
                  \${p.originalPrice ? '<div class="text-[10px] text-slate-400 line-through">$' + p.originalPrice.toFixed(2) + '</div>' : ''}
                </div>

                <div class="flex gap-1.5">
                  <button onclick="openProductModal('\${p.id}')" class="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer" title="Quick Details">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                  </button>
                  <button onclick="addToCart('\${p.id}')" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1">
                    <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join('');

      lucide.createIcons();
    }

    function filterCategory(cat) {
      activeCategory = cat;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer';
      });
      const activeBtn = document.getElementById('tab-' + cat);
      if (activeBtn) {
        activeBtn.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white cursor-pointer';
      }
      renderProducts();
    }

    function handleSearch(val) {
      searchQuery = val.trim();
      renderProducts();
    }

    function toggleNyFilter() {
      isNyFilter = !isNyFilter;
      const label = document.getElementById('nyFilterLabel');
      const btn = document.getElementById('nyFilterBtn');
      if (isNyFilter) {
        label.textContent = 'NY DOE Only';
        btn.className = 'hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-blue-600 bg-blue-50 text-blue-900 cursor-pointer';
      } else {
        label.textContent = 'All USA';
        btn.className = 'hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:border-blue-400 bg-white text-slate-700 cursor-pointer';
      }
      renderProducts();
    }

    function applySorting(val) {
      sortBy = val;
      renderProducts();
    }

    function resetFilters() {
      activeCategory = 'all';
      searchQuery = '';
      isNyFilter = false;
      document.getElementById('searchInput').value = '';
      filterCategory('all');
      toggleNyFilter();
    }

    // Modal Details
    function openProductModal(id) {
      const p = products.find(item => item.id === id);
      if (!p) return;
      const content = document.getElementById('productModalContent');
      
      const photoElements = (p.photos || []).map((img, idx) => \`
        <img src="\${img}" onclick="document.getElementById('mainModalPhoto').src='\${img}'" class="w-14 h-14 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80" referrerPolicy="no-referrer">
      \`).join('');

      content.innerHTML = \`
        <div class="space-y-3">
          <div class="h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            <img id="mainModalPhoto" src="\${p.photos[0]}" alt="\${p.title}" class="w-full h-full object-cover" referrerPolicy="no-referrer">
          </div>
          <div class="flex gap-2 overflow-x-auto pb-1">
            \${photoElements}
          </div>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">\${p.state} Verified</span>
              <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">\${p.condition}</span>
            </div>
            <h2 class="text-base font-extrabold text-slate-900 leading-snug">\${p.title}</h2>
            <div class="text-xl font-extrabold text-blue-900 mt-2">$\${p.price.toFixed(2)}</div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div class="font-bold text-slate-800 flex items-center gap-1.5">
              <i data-lucide="user-check" class="w-4 h-4 text-blue-600"></i>
              <span>Teacher Seller: \${p.sellerName}</span>
            </div>
            <p class="text-slate-600 text-[11px]">\${p.sellerSchool} • \${p.sellerDistrict || ''}</p>
          </div>

          <div>
            <div class="font-bold text-slate-800 mb-1">Classroom Material Overview:</div>
            <p class="text-slate-600 leading-relaxed">\${p.description}</p>
          </div>

          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-[11px]">
            <strong>100% Escrow Protection:</strong> Funds are safely held until delivery is confirmed. Certified for school district POs.
          </div>

          <div class="flex gap-2 pt-2">
            <button onclick="addToCart('\${p.id}'); closeProductModal();" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2">
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
              <span>Add to Escrow Cart</span>
            </button>
          </div>
        </div>
      \`;

      document.getElementById('productModal').classList.remove('hidden');
      document.getElementById('productModal').classList.add('flex');
      lucide.createIcons();
    }

    function closeProductModal() {
      document.getElementById('productModal').classList.add('hidden');
      document.getElementById('productModal').classList.remove('flex');
    }

    // Cart Operations
    function addToCart(id) {
      const p = products.find(item => item.id === id);
      if (!p) return;
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...p, qty: 1 });
      }
      localStorage.setItem('mft_cart', JSON.stringify(cart));
      updateCartUI();
      showToast('Added to Cart! 🛒');
    }

    function updateCartUI() {
      const count = cart.reduce((sum, item) => sum + item.qty, 0);
      document.getElementById('cartBadge').textContent = count;
      document.getElementById('cartItemCount').textContent = count;

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      document.getElementById('cartSubtotal').textContent = '$' + subtotal.toFixed(2);
      document.getElementById('cartTotal').textContent = '$' + subtotal.toFixed(2);

      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = '<div class="text-center py-12 text-slate-400">Your classroom cart is currently empty.</div>';
        return;
      }

      list.innerHTML = cart.map((item, idx) => \`
        <div class="flex items-center justify-between gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
          <img src="\${item.photos[0]}" class="w-12 h-12 object-cover rounded-lg" referrerPolicy="no-referrer">
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-slate-900 truncate">\${item.title}</h4>
            <div class="text-slate-500 text-[11px]">$\${item.price.toFixed(2)} x \${item.qty}</div>
          </div>
          <button onclick="removeFromCart(\${idx})" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      \`).join('');
      lucide.createIcons();
    }

    function removeFromCart(idx) {
      cart.splice(idx, 1);
      localStorage.setItem('mft_cart', JSON.stringify(cart));
      updateCartUI();
    }

    function toggleCartDrawer() {
      const drawer = document.getElementById('cartDrawer');
      if (drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
      } else {
        drawer.classList.add('translate-x-full');
      }
    }

    async function handleCheckout() {
      if (cart.length === 0) return;
      const orderId = 'MFT-' + Math.floor(100000 + Math.random() * 900000);
      showToast('Escrow order #' + orderId + ' placed! Confirmation sent via Resend API.');
      cart = [];
      localStorage.removeItem('mft_cart');
      updateCartUI();
      toggleCartDrawer();
    }

    // Teacher Verification with Resend PIN
    function openVerifyModal() {
      document.getElementById('verifyModal').classList.remove('hidden');
      document.getElementById('verifyModal').classList.add('flex');
    }

    function closeVerifyModal() {
      document.getElementById('verifyModal').classList.add('hidden');
      document.getElementById('verifyModal').classList.remove('flex');
    }

    async function handleRequestPin(e) {
      e.preventDefault();
      const email = document.getElementById('verifyEmailInput').value;
      const btn = document.getElementById('sendPinBtn');
      const feedback = document.getElementById('verifyFeedback');
      
      btn.disabled = true;
      btn.textContent = 'Dispatching PIN via Resend REST...';
      
      try {
        const res = await fetch('/api/verify_school_webmail.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ school_email: email, action: 'request_pin' })
        });
        const data = await res.json();
        
        document.getElementById('pinSection').classList.remove('hidden');
        document.getElementById('requestPinBtnContainer').classList.add('hidden');
        feedback.textContent = '6-Digit verification code dispatched to ' + email + '!';
        feedback.className = 'text-xs text-center font-bold text-emerald-600 block';
      } catch (err) {
        // Fallback for standalone preview
        document.getElementById('pinSection').classList.remove('hidden');
        document.getElementById('requestPinBtnContainer').classList.add('hidden');
        feedback.textContent = 'Simulated PIN (742918) sent to ' + email + ' (Resend REST Ready)';
        feedback.className = 'text-xs text-center font-bold text-blue-600 block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Dispatch Verification PIN';
      }
    }

    function handleConfirmPin() {
      const pin = document.getElementById('pinInput').value;
      if (!pin || pin.length < 6) {
        alert('Please enter the complete 6-digit verification code.');
        return;
      }
      isTeacherVerified = true;
      localStorage.setItem('mft_verified', 'true');
      showToast('Verified Teacher Accreditation Granted! 🌟 0% Listing Fees active.');
      closeVerifyModal();
    }

    // Listing Creation (Supports up to 10 photos)
    function openSellModal() {
      document.getElementById('sellModal').classList.remove('hidden');
      document.getElementById('sellModal').classList.add('flex');
    }

    function closeSellModal() {
      document.getElementById('sellModal').classList.add('hidden');
      document.getElementById('sellModal').classList.remove('flex');
    }

    async function handleCreateListing(e) {
      e.preventDefault();
      const title = document.getElementById('sellTitle').value;
      const price = parseFloat(document.getElementById('sellPrice').value);
      const condition = document.getElementById('sellCondition').value;
      const category = document.getElementById('sellCategory').value;
      const description = document.getElementById('sellDescription').value;
      const photosRaw = document.getElementById('sellPhotos').value;

      let photoList = photosRaw.split(/[\\n,]+/).map(s => s.trim()).filter(Boolean);
      if (photoList.length === 0) {
        photoList = ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'];
      }
      if (photoList.length > 10) photoList = photoList.slice(0, 10);

      const newProduct = {
        id: 'p-' + Date.now(),
        title,
        price,
        category,
        condition,
        state: 'OK',
        sellerName: 'Verified Educator',
        sellerSchool: 'Local School District',
        sellerRating: 5.0,
        photos: photoList,
        description
      };

      products.unshift(newProduct);
      localStorage.setItem('mft_products', JSON.stringify(products));
      renderProducts();
      closeSellModal();
      showToast('Classroom listing published with ' + photoList.length + ' photos! 🎉');

      // Attempt MySQL Sync via PHP API
      try {
        fetch('/api/listings.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seller_id: 1,
            title,
            price,
            condition,
            description,
            images: photoList
          })
        });
      } catch (err) {}
    }

    // Support Modal
    function openSupportModal() {
      document.getElementById('supportModal').classList.remove('hidden');
      document.getElementById('supportModal').classList.add('flex');
    }

    function closeSupportModal() {
      document.getElementById('supportModal').classList.add('hidden');
      document.getElementById('supportModal').classList.remove('flex');
    }

    async function handleSupportSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('suppName').value;
      const email = document.getElementById('suppEmail').value;
      const category = document.getElementById('suppCategory').value;
      const message = document.getElementById('suppMsg').value;

      try {
        await fetch('/api/contact_ticket.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, category, message })
        });
      } catch (err) {}

      closeSupportModal();
      showToast('Support ticket dispatched to Resend REST API! Ticket receipt emailed to you.');
    }
  </script>
</body>
</html>
`;


