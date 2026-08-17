/**
 * MarketplaceForTeachers.com - Production cPanel PHP Build Sources
 * 
 * Standalone, 100% pure PHP 8.2+ / MySQL / Apache application sources
 * ZERO Node.js / Vite / Express dependencies.
 */

export const PHP_INDEX_PHP = `<?php
/**
 * ============================================================================
 * MarketplaceForTeachers.com - Master Production Front Controller
 * ============================================================================
 * Pure PHP 8.2+ Architecture - Zero Node.js / Vite / npm / Express dependencies
 */

declare(strict_types=1);

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/app/controllers/MarketplaceController.php';
require_once __DIR__ . '/app/services/EmailService.php';
require_once __DIR__ . '/app/services/PaymentService.php';

// Request URI Parsing
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. Static Asset Handling (Safety fallback if Apache rewrite didn't bypass)
if (preg_match('/\\.(?:png|jpg|jpeg|gif|svg|css|js|ico|woff2?|ttf)$/', $requestUri)) {
    $filePath = __DIR__ . $requestUri;
    if (file_exists($filePath)) {
        $mimeTypes = [
            'svg'  => 'image/svg+xml',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'css'  => 'text/css',
            'js'   => 'application/javascript',
            'ico'  => 'image/x-icon',
        ];
        $ext = pathinfo($filePath, PATHINFO_EXTENSION);
        header('Content-Type: ' . ($mimeTypes[$ext] ?? 'application/octet-stream'));
        readfile($filePath);
        exit;
    }
}

// 2. Routing Logic
switch ($requestUri) {
    case '/':
    case '/index.php':
        $pageTitle = "Marketplace For Teachers | Teacher-Created Resources & Supplies";
        $categories = MarketplaceController::getCategories();
        $featuredProducts = MarketplaceController::getProducts(['product_type' => '']);
        
        require __DIR__ . '/app/views/header.php';
        ?>
        <!-- Hero Section -->
        <section class="relative bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-16 sm:py-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div class="lg:col-span-7 space-y-6">
                        <div class="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-200">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Verified Educator Exchange • 100% Escrow Protection
                        </div>
                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            The Trusted Exchange for <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Teacher-Created</span> Resources.
                        </h1>
                        <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                            Buy and sell classroom-tested curriculum, lesson units, decor, and supplies. Keep 95% of your earnings with instant digital fulfillment and teacher verification.
                        </p>
                        <div class="flex flex-wrap gap-4 pt-2">
                            <a href="/marketplace" class="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2">
                                <i class="fa-solid fa-magnifying-glass"></i> Explore 10,000+ Resources
                            </a>
                            <a href="/sell" class="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl backdrop-blur-sm transition flex items-center gap-2">
                                <i class="fa-solid fa-store"></i> Open Teacher Store
                            </a>
                        </div>
                    </div>
                    <div class="lg:col-span-5 hidden lg:block">
                        <div class="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl space-y-4">
                            <div class="flex items-center justify-between border-b border-white/10 pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold">
                                        <i class="fa-solid fa-check"></i>
                                    </div>
                                    <div>
                                        <div class="font-bold text-sm">Escrow Buyer Protection</div>
                                        <div class="text-xs text-slate-400">Funds held until satisfaction</div>
                                    </div>
                                </div>
                                <span class="text-xs bg-emerald-500 text-white font-bold px-2 py-1 rounded-md">Active</span>
                            </div>
                            <div class="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2">
                                <div class="flex justify-between text-xs text-slate-400">
                                    <span>Teacher Earnings Split</span>
                                    <span class="font-bold text-emerald-400">95% Take-Home</span>
                                </div>
                                <div class="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div class="bg-emerald-500 h-full w-[95%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Explore by Category</h2>
                    <p class="text-slate-500 text-sm mt-1">Classroom-ready materials organized for busy teachers.</p>
                </div>
                <a href="/marketplace" class="text-sm font-bold text-blue-600 hover:text-blue-700">View All Categories &rarr;</a>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <?php foreach ($categories as $cat): ?>
                    <a href="/marketplace?category=<?= urlencode($cat['slug']) ?>" class="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-lg transition text-center flex flex-col items-center">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition">
                            <i class="fa-solid fa-folder-open"></i>
                        </div>
                        <span class="font-bold text-sm text-slate-800 group-hover:text-blue-600"><?= e($cat['name']) ?></span>
                    </a>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- Featured Products Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Featured Teacher Resources</h2>
                    <p class="text-slate-500 text-sm mt-1">High-impact curriculum units and classroom materials.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <?php if (empty($featuredProducts)): ?>
                    <div class="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                        <p class="font-semibold">Ready for teacher listings.</p>
                        <p class="text-xs mt-1">Be the first to list lesson plans, printables, or supplies.</p>
                        <a href="/sell" class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg">Create Listing</a>
                    </div>
                <?php else: ?>
                    <?php foreach ($featuredProducts as $product): ?>
                        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition flex flex-col">
                            <div class="h-48 bg-slate-100 relative overflow-hidden">
                                <img src="<?= e($product['primary_image_url']) ?>" alt="<?= e($product['title']) ?>" class="w-full h-full object-cover">
                                <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                                    <?= e($product['product_type']) ?>
                                </span>
                            </div>
                            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                    <div class="text-xs text-blue-600 font-bold"><?= e($product['category_name']) ?></div>
                                    <h3 class="font-bold text-slate-900 text-base leading-snug mt-1 line-clamp-2">
                                        <a href="/product/<?= urlencode($product['slug']) ?>" class="hover:text-blue-600">
                                            <?= e($product['title']) ?>
                                        </a>
                                    </h3>
                                </div>
                                <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div class="font-black text-lg text-slate-900">
                                        <?= $product['is_free'] ? 'FREE' : '$' . number_format((float)$product['price'], 2) ?>
                                    </div>
                                    <a href="/product/<?= urlencode($product['slug']) ?>" class="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>
        <?php
        require __DIR__ . '/app/views/footer.php';
        break;

    case '/marketplace':
        $pageTitle = "Explore Catalog | Marketplace For Teachers";
        $products = MarketplaceController::getProducts($_GET);
        $categories = MarketplaceController::getCategories();
        
        require __DIR__ . '/app/views/header.php';
        ?>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="mb-8">
                <h1 class="text-3xl font-black text-slate-900">Teacher Catalog</h1>
                <p class="text-slate-500 text-sm mt-1">Browse classroom-tested digital & physical materials.</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Filters Sidebar -->
                <aside class="space-y-6">
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                        <h3 class="font-bold text-slate-900 text-sm mb-4">Filter Catalog</h3>
                        <form action="/marketplace" method="GET" class="space-y-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Search Keywords</label>
                                <input type="text" name="search" value="<?= e($_GET['search'] ?? '') ?>" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs" placeholder="e.g. STEM, Math...">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Resource Type</label>
                                <select name="product_type" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs">
                                    <option value="">All Types</option>
                                    <option value="digital" <?= ($_GET['product_type'] ?? '') === 'digital' ? 'selected' : '' ?>>Digital Download</option>
                                    <option value="physical" <?= ($_GET['product_type'] ?? '') === 'physical' ? 'selected' : '' ?>>Physical Shipped</option>
                                    <option value="bundle" <?= ($_GET['product_type'] ?? '') === 'bundle' ? 'selected' : '' ?>>Curriculum Bundle</option>
                                </select>
                            </div>
                            <button type="submit" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition">Apply Filters</button>
                        </form>
                    </div>
                </aside>

                <!-- Products Grid -->
                <div class="lg:col-span-3">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <?php if (empty($products)): ?>
                            <div class="col-span-full py-16 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                                <p class="font-bold">No resources found matching your search.</p>
                                <a href="/marketplace" class="mt-3 inline-block text-xs text-blue-600 font-semibold">Reset all filters</a>
                            </div>
                        <?php else: ?>
                            <?php foreach ($products as $product): ?>
                                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col">
                                    <div class="h-44 bg-slate-100 relative">
                                        <img src="<?= e($product['primary_image_url']) ?>" alt="<?= e($product['title']) ?>" class="w-full h-full object-cover">
                                    </div>
                                    <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
                                        <div>
                                            <div class="text-[11px] font-bold text-blue-600"><?= e($product['category_name']) ?></div>
                                            <h3 class="font-bold text-slate-900 text-sm line-clamp-2 mt-1">
                                                <a href="/product/<?= urlencode($product['slug']) ?>"><?= e($product['title']) ?></a>
                                            </h3>
                                        </div>
                                        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                                            <span class="font-black text-sm text-slate-900">$<?= number_format((float)$product['price'], 2) ?></span>
                                            <a href="/product/<?= urlencode($product['slug']) ?>" class="text-xs font-bold text-blue-600 hover:underline">View &rarr;</a>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        <?php
        require __DIR__ . '/app/views/footer.php';
        break;

    case '/buyer-protection':
        $pageTitle = "100% Escrow Buyer Protection | Marketplace For Teachers";
        require __DIR__ . '/app/views/header.php';
        ?>
        <div class="max-w-4xl mx-auto px-4 py-16">
            <div class="text-center space-y-4 mb-12">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h1 class="text-4xl font-black text-slate-900">100% Escrow Buyer Protection</h1>
                <p class="text-slate-600 text-base max-w-xl mx-auto">
                    We secure your teaching funds. Your payment is held safely in escrow and only released to the seller once materials are delivered and verified.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
                    <div class="text-blue-600 text-2xl"><i class="fa-solid fa-lock"></i></div>
                    <h3 class="font-bold text-slate-900">1. Safe Checkout</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">Funds are securely captured and held in our institutional escrow vault.</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
                    <div class="text-indigo-600 text-2xl"><i class="fa-solid fa-download"></i></div>
                    <h3 class="font-bold text-slate-900">2. Instant Verification</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">Download or inspect your physical items within our 48-hour satisfaction guarantee.</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
                    <div class="text-emerald-600 text-2xl"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                    <h3 class="font-bold text-slate-900">3. Protected Payout</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">Once satisfied, the seller receives 95% of their funds automatically.</p>
                </div>
            </div>
        </div>
        <?php
        require __DIR__ . '/app/views/footer.php';
        break;

    case '/api/health':
        header('Content-Type: application/json');
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->query("SELECT 1");
            echo json_encode([
                'status'       => 'healthy',
                'architecture' => 'Native PHP 8.2+ / MySQL / Apache',
                'database'     => 'Connected (MySQL/MariaDB)',
                'timestamp'    => date('c')
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status'   => 'degraded',
                'error'    => $e->getMessage(),
                'timestamp'=> date('c')
            ]);
        }
        break;

    default:
        // Check if matching a product slug
        if (str_starts_with($requestUri, '/product/')) {
            $slug = substr($requestUri, 9);
            $product = MarketplaceController::getProductBySlug($slug);
            if ($product) {
                $pageTitle = e($product['title']) . " | Marketplace For Teachers";
                require __DIR__ . '/app/views/header.php';
                ?>
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div class="lg:col-span-7">
                            <div class="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                                <img src="<?= e($product['primary_image_url']) ?>" alt="<?= e($product['title']) ?>" class="w-full h-96 object-cover">
                            </div>
                        </div>
                        <div class="lg:col-span-5 space-y-6">
                            <div class="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                                <?= e($product['category_name']) ?>
                            </div>
                            <h1 class="text-3xl font-black text-slate-900 leading-tight"><?= e($product['title']) ?></h1>
                            <div class="text-3xl font-black text-slate-900">$<?= number_format((float)$product['price'], 2) ?></div>
                            <p class="text-slate-600 text-sm leading-relaxed"><?= nl2br(e($product['description'])) ?></p>
                            <div class="pt-4 border-t border-slate-200">
                                <button class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-cart-shopping"></i> Purchase with Escrow Protection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <?php
                require __DIR__ . '/app/views/footer.php';
                break;
            }
        }

        http_response_code(404);
        $pageTitle = "Page Not Found | Marketplace For Teachers";
        require __DIR__ . '/app/views/header.php';
        ?>
        <div class="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
            <h1 class="text-6xl font-black text-slate-900">404</h1>
            <p class="text-lg font-bold text-slate-700">Page Not Found</p>
            <p class="text-slate-500 text-sm">The resource you requested does not exist or has been moved.</p>
            <a href="/" class="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm">Return Home</a>
        </div>
        <?php
        require __DIR__ . '/app/views/footer.php';
        break;
}
`;

export const PHP_CONFIG_PHP = `<?php
/**
 * ============================================================================
 * MarketplaceForTeachers.com - Master cPanel PHP Production Configuration
 * ============================================================================
 * Standard cPanel Architecture: PHP 8.2+, MySQL 8.0+ / MariaDB 10.6+, Apache
 * Headquarters: 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
 * Official Contact: marketplaceforteachers.com@gmail.com
 * ============================================================================
 */

declare(strict_types=1);

// Error Handling: In production, log errors safely without crashing HTML rendering
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Session Security Configuration
if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
    @ini_set('session.cookie_httponly', '1');
    @ini_set('session.use_only_cookies', '1');
    @ini_set('session.cookie_samesite', 'Lax');
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        @ini_set('session.cookie_secure', '1');
    }
    @session_start();
}

// 1. DATABASE CONFIGURATION (Update with your cPanel MySQL Details)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'mktplace_teachers_db');
define('DB_USER', getenv('DB_USER') ?: 'mktplace_dbuser');
define('DB_PASS', getenv('DB_PASSWORD') ?: 'YourStrongMySQLPassword2026!');
define('DB_CHARSET', 'utf8mb4');

// 2. APP URL & DOMAIN
define('APP_NAME', 'MarketplaceForTeachers.com');
define('APP_URL', getenv('APP_URL') ?: 'https://marketplaceforteachers.com');
define('APP_VERSION', '3.0.0-php-cpanel');

// 3. TRANSACTIONAL EMAIL VIA RESEND REST API (Native HTTPS cURL - No SMTP Required)
define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: 're_YOUR_LIVE_RESEND_API_KEY');
define('RESEND_FROM_EMAIL', getenv('RESEND_FROM_EMAIL') ?: 'Marketplace For Teachers <notifications@marketplaceforteachers.com>');
define('RESEND_REPLY_TO_EMAIL', getenv('RESEND_REPLY_TO_EMAIL') ?: 'support@marketplaceforteachers.com');
define('ADMIN_SUPPORT_EMAIL', 'support@marketplaceforteachers.com');

// 4. PAYMENT GATEWAYS (Server-side Stripe & PayPal)
define('STRIPE_SECRET_KEY', getenv('STRIPE_SECRET_KEY') ?: '');
define('STRIPE_PUBLISHABLE_KEY', getenv('STRIPE_PUBLISHABLE_KEY') ?: '');
define('STRIPE_WEBHOOK_SECRET', getenv('STRIPE_WEBHOOK_SECRET') ?: '');

define('PAYPAL_CLIENT_ID', getenv('PAYPAL_CLIENT_ID') ?: '');
define('PAYPAL_CLIENT_SECRET', getenv('PAYPAL_CLIENT_SECRET') ?: '');
define('PAYPAL_MODE', getenv('PAYPAL_MODE') ?: 'sandbox'); // 'sandbox' or 'live'

// 5. SECURITY & CSRF
define('CSRF_TOKEN_KEY', 'mft_csrf_token');

/**
 * Returns the singleton PDO Database connection instance, or null if connection fails
 * Prevents HTTP 500 fatal unhandled crashes when MySQL is initializing or during setup.
 */
function getDbConnection(): ?PDO {
    static $pdo = null;
    static $hasAttempted = false;

    if ($pdo !== null) {
        return $pdo;
    }

    if ($hasAttempted) {
        return null;
    }

    $hasAttempted = true;

    // Check if PDO MySQL extension is enabled
    if (!extension_loaded('pdo_mysql')) {
        error_log("Notice: PHP pdo_mysql extension is not loaded in this environment.");
        return null;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Notice: MySQL Connection pending/unavailable: " . $e->getMessage());
        return null;
    }
}

/**
 * CSRF Protection Token Generator
 */
function generateCsrfToken(): string {
    if (empty($_SESSION[CSRF_TOKEN_KEY])) {
        try {
            $_SESSION[CSRF_TOKEN_KEY] = bin2hex(random_bytes(32));
        } catch (Exception $e) {
            $_SESSION[CSRF_TOKEN_KEY] = md5(uniqid((string)mt_rand(), true));
        }
    }
    return $_SESSION[CSRF_TOKEN_KEY];
}

/**
 * Verify CSRF Token
 */
function verifyCsrfToken(?string $token): bool {
    if (empty($token) || empty($_SESSION[CSRF_TOKEN_KEY])) {
        return false;
    }
    return hash_equals($_SESSION[CSRF_TOKEN_KEY], $token);
}

/**
 * Sanitize output HTML
 */
function e(?string $string): string {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}
`;

export const PHP_CONFIG_EXAMPLE_PHP = `<?php
/**
 * ============================================================================
 * MarketplaceForTeachers.com - Production Environment Configuration Example
 * ============================================================================
 * Rename this file to config.php or populate environment variables in cPanel.
 */

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'yourcpanel_mktplace_db');
define('DB_USER', 'yourcpanel_dbuser');
define('DB_PASS', 'YourStrongMySQLPassword2026!');

define('APP_NAME', 'MarketplaceForTeachers.com');
define('APP_URL', 'https://marketplaceforteachers.com');

define('RESEND_API_KEY', 're_YOUR_LIVE_RESEND_API_KEY');
define('RESEND_FROM_EMAIL', 'Marketplace For Teachers <notifications@marketplaceforteachers.com>');
define('RESEND_REPLY_TO_EMAIL', 'support@marketplaceforteachers.com');

define('STRIPE_SECRET_KEY', 'sk_live_YOUR_STRIPE_SECRET_KEY');
define('STRIPE_PUBLISHABLE_KEY', 'pk_live_YOUR_STRIPE_PUBLISHABLE_KEY');
define('STRIPE_WEBHOOK_SECRET', 'whsec_YOUR_STRIPE_WEBHOOK_SECRET');

define('PAYPAL_CLIENT_ID', 'YOUR_PAYPAL_LIVE_CLIENT_ID');
define('PAYPAL_CLIENT_SECRET', 'YOUR_PAYPAL_LIVE_CLIENT_SECRET');
define('PAYPAL_MODE', 'live');
`;

export const PHP_MARKETPLACE_CONTROLLER = `<?php
/**
 * ============================================================================
 * Marketplace Controller - Search, Filtering, Catalog, Single Product
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

class MarketplaceController {
    /**
     * Fallback Categories
     */
    private static function getFallbackCategories(): array {
        return [
            ['id' => 1, 'name' => 'Curriculum & Units', 'slug' => 'curriculum-units', 'display_order' => 1],
            ['id' => 2, 'name' => 'Classroom Decor & Themes', 'slug' => 'classroom-decor', 'display_order' => 2],
            ['id' => 3, 'name' => 'STEM & Science Labs', 'slug' => 'stem-science', 'display_order' => 3],
            ['id' => 4, 'name' => 'Literacy & Phonics Centers', 'slug' => 'literacy-reading', 'display_order' => 4],
            ['id' => 5, 'name' => 'Math Games & Manipulatives', 'slug' => 'math-activities', 'display_order' => 5],
            ['id' => 6, 'name' => 'Special Education & SEL', 'slug' => 'special-ed-sel', 'display_order' => 6],
            ['id' => 7, 'name' => 'Classroom Supplies & Storage', 'slug' => 'classroom-supplies', 'display_order' => 7],
            ['id' => 8, 'name' => 'Free Printables', 'slug' => 'free-resources', 'display_order' => 8],
        ];
    }

    /**
     * Fallback Products
     */
    private static function getFallbackProducts(): array {
        return [
            [
                'id' => 1,
                'title' => 'Complete 3rd Grade STEM Challenge Unit (Full Year)',
                'slug' => 'complete-3rd-grade-stem-challenge-unit',
                'description' => 'Comprehensive 36-week hands-on engineering challenges with printable student journal, teacher pacing guide, and grading rubrics aligned to Next Generation Science Standards (NGSS).',
                'price' => 24.50,
                'is_free' => 0,
                'product_type' => 'digital',
                'category_name' => 'STEM & Science Labs',
                'seller_name' => 'Sarah Jenkins, M.Ed.',
                'seller_badge' => 'Verified Master Teacher',
                'is_verified_teacher' => 1,
                'primary_image_url' => 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
                'is_featured' => 1
            ],
            [
                'id' => 2,
                'title' => 'Boho Neutral Classroom Decor & Organization Bundle',
                'slug' => 'boho-neutral-classroom-decor-bundle',
                'description' => 'Calm earthy color palette including printable alphabet banners, calendar kit, visual daily schedule cards, editable rolling cart labels, and binder covers.',
                'price' => 18.00,
                'is_free' => 0,
                'product_type' => 'digital',
                'category_name' => 'Classroom Decor & Themes',
                'seller_name' => 'Elena Rostova',
                'seller_badge' => 'Top Educator Author',
                'is_verified_teacher' => 1,
                'primary_image_url' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
                'is_featured' => 1
            ],
            [
                'id' => 3,
                'title' => 'Science of Reading Phonics & Decodable Readers Pack',
                'slug' => 'science-of-reading-phonics-decodables',
                'description' => '60 systematic decodable passages organized by phonetic progression (CVC, digraphs, blends, silent e, vowel teams) with comprehension questions.',
                'price' => 15.00,
                'is_free' => 0,
                'product_type' => 'digital',
                'category_name' => 'Literacy & Phonics Centers',
                'seller_name' => 'Marcus Vance',
                'seller_badge' => 'Literacy Specialist',
                'is_verified_teacher' => 1,
                'primary_image_url' => 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
                'is_featured' => 1
            ],
            [
                'id' => 4,
                'title' => 'Daily Classroom Morning Meeting & SEL Check-In Slides',
                'slug' => 'daily-morning-meeting-sel-slides',
                'description' => '180 days of engaging morning greeting prompts, emotional temperature check-ins, share topics, and cooperative classroom community builders.',
                'price' => 0.00,
                'is_free' => 1,
                'product_type' => 'digital',
                'category_name' => 'Special Education & SEL',
                'seller_name' => 'Rachel Hayes',
                'seller_badge' => 'Verified Teacher',
                'is_verified_teacher' => 1,
                'primary_image_url' => 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
                'is_featured' => 1
            ],
        ];
    }

    /**
     * Search & Filter Products
     */
    public static function getProducts(array $filters = []): array {
        $pdo = getDbConnection();
        if (!$pdo) {
            return self::getFilteredFallbackProducts($filters);
        }

        try {
            $sql = "
                SELECT p.*, c.name AS category_name, u.name AS seller_name, u.badge AS seller_badge, u.is_verified_teacher
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.seller_id = u.id
                WHERE p.status = 'published'
            ";
            $params = [];

            if (!empty($filters['category_id'])) {
                $sql .= " AND p.category_id = ?";
                $params[] = (int)$filters['category_id'];
            }

            if (!empty($filters['product_type'])) {
                $sql .= " AND p.product_type = ?";
                $params[] = $filters['product_type'];
            }

            if (!empty($filters['search'])) {
                $sql .= " AND (p.title LIKE ? OR p.description LIKE ?)";
                $searchTerm = '%' . $filters['search'] . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            if (!empty($filters['grade_level'])) {
                $sql .= " AND p.grade_level = ?";
                $params[] = $filters['grade_level'];
            }

            if (isset($filters['is_free']) && ($filters['is_free'] === '1' || $filters['is_free'] === 1 || $filters['is_free'] === true)) {
                $sql .= " AND p.is_free = 1";
            }

            $sql .= " ORDER BY p.is_featured DESC, p.created_at DESC LIMIT 50";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $results = $stmt->fetchAll();
            return !empty($results) ? $results : self::getFilteredFallbackProducts($filters);
        } catch (Exception $e) {
            error_log("Notice: Error in getProducts query: " . $e->getMessage());
            return self::getFilteredFallbackProducts($filters);
        }
    }

    private static function getFilteredFallbackProducts(array $filters): array {
        $products = self::getFallbackProducts();
        if (empty($filters)) {
            return $products;
        }

        return array_values(array_filter($products, function($p) use ($filters) {
            if (!empty($filters['product_type']) && $p['product_type'] !== $filters['product_type']) {
                return false;
            }
            if (isset($filters['is_free']) && ($filters['is_free'] === '1' || $filters['is_free'] === 1) && $p['is_free'] != 1) {
                return false;
            }
            if (!empty($filters['search'])) {
                $query = strtolower($filters['search']);
                if (stripos($p['title'], $query) === false && stripos($p['description'], $query) === false) {
                    return false;
                }
            }
            return true;
        }));
    }

    /**
     * Get Single Product by ID or Slug
     */
    public static function getProductBySlug(string $slug): ?array {
        $pdo = getDbConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("
                    SELECT p.*, c.name AS category_name, u.name AS seller_name, u.badge AS seller_badge, u.school_name, u.is_verified_teacher
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN users u ON p.seller_id = u.id
                    WHERE p.slug = ? AND p.status = 'published'
                    LIMIT 1
                ");
                $stmt->execute([$slug]);
                $product = $stmt->fetch();
                if ($product) {
                    return $product;
                }
            } catch (Exception $e) {
                error_log("Notice: Error in getProductBySlug: " . $e->getMessage());
            }
        }

        foreach (self::getFallbackProducts() as $p) {
            if ($p['slug'] === $slug) {
                return $p;
            }
        }
        return null;
    }

    /**
     * Get All Categories
     */
    public static function getCategories(): array {
        $pdo = getDbConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC");
                $results = $stmt->fetchAll();
                if (!empty($results)) {
                    return $results;
                }
            } catch (Exception $e) {
                error_log("Notice: Error in getCategories: " . $e->getMessage());
            }
        }
        return self::getFallbackCategories();
    }
}
`;

export const PHP_EMAIL_SERVICE = `<?php
/**
 * ============================================================================
 * Resend HTTPS REST Email Delivery Service (cURL - No SMTP Required)
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

class EmailService {
    /**
     * Send Transactional Email via Resend REST API
     */
    public static function send(string $to, string $subject, string $htmlContent, ?string $replyTo = null): array {
        $apiKey = RESEND_API_KEY;
        $fromEmail = RESEND_FROM_EMAIL;
        $replyToEmail = $replyTo ?: RESEND_REPLY_TO_EMAIL;

        // Fallback simulation mode if API key is not yet configured
        if (empty($apiKey) || str_starts_with($apiKey, 're_YOUR_LIVE')) {
            self::logEmail($to, $subject, 'simulated', 'API key placeholder active.');
            return ['success' => true, 'mode' => 'simulated', 'message' => 'Simulated mode: email logged to database.'];
        }

        $payload = [
            'from'     => $fromEmail,
            'to'       => [$to],
            'subject'  => $subject,
            'html'     => $htmlContent,
            'reply_to' => $replyToEmail,
        ];

        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
                'User-Agent: MarketplaceForTeachers-PHP/3.0'
            ],
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            self::logEmail($to, $subject, 'failed', $curlError);
            return ['success' => false, 'error' => $curlError];
        }

        $data = json_decode((string)$response, true);
        if ($httpCode >= 200 && $httpCode < 300) {
            $messageId = $data['id'] ?? 'resend_msg_' . time();
            self::logEmail($to, $subject, 'sent', null, $messageId);
            return ['success' => true, 'id' => $messageId];
        }

        $errorMsg = $data['message'] ?? "HTTP $httpCode response";
        self::logEmail($to, $subject, 'failed', $errorMsg);
        return ['success' => false, 'error' => $errorMsg];
    }

    /**
     * Log email to MySQL database
     */
    private static function logEmail(string $recipient, string $subject, string $status, ?string $error = null, ?string $msgId = null): void {
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->prepare("
                INSERT INTO email_logs (recipient_email, subject, resend_message_id, status, error_details)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$recipient, $subject, $msgId, $status, $error]);
        } catch (Exception $e) {
            error_log("Failed to write to email_logs: " . $e->getMessage());
        }
    }
}
`;

export const PHP_PAYMENT_SERVICE = `<?php
/**
 * ============================================================================
 * Payment & Escrow Buyer/Seller Protection Service
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

class PaymentService {
    /**
     * Calculate 5% Platform Fee & Teacher Payout Portion
     */
    public static function calculateSplit(float $subtotal): array {
        $platformFee = round($subtotal * 0.05, 2);
        $sellerPayout = round($subtotal - $platformFee, 2);
        return [
            'subtotal'       => $subtotal,
            'platform_fee'   => $platformFee,
            'seller_payout'  => $sellerPayout,
        ];
    }

    /**
     * Process Checkout Order with DB Transaction
     */
    public static function processOrder(int $buyerId, array $items, string $paymentMethod, string $paymentIntentId): array {
        $pdo = getDbConnection();
        $pdo->beginTransaction();

        try {
            $subtotal = 0.00;
            foreach ($items as $item) {
                $subtotal += ($item['price'] * $item['quantity']);
            }

            $split = self::calculateSplit($subtotal);
            $orderNumber = 'MFT-' . strtoupper(bin2hex(random_bytes(4))) . '-' . date('Ymd');

            // 1. Create Order Record
            $stmt = $pdo->prepare("
                INSERT INTO orders (order_number, buyer_id, subtotal, total_amount, platform_fee, payment_method, payment_status, payment_intent_id, escrow_release_status)
                VALUES (?, ?, ?, ?, ?, ?, 'paid', ?, 'held_in_escrow')
            ");
            $stmt->execute([$orderNumber, $buyerId, $subtotal, $subtotal, $split['platform_fee'], $paymentMethod, $paymentIntentId]);
            $orderId = (int)$pdo->lastInsertId();

            // 2. Insert Order Items & Escrow Protection Records
            foreach ($items as $item) {
                $itemTotal = $item['price'] * $item['quantity'];
                $itemSplit = self::calculateSplit($itemTotal);
                $accessToken = bin2hex(random_bytes(20));

                $itemStmt = $pdo->prepare("
                    INSERT INTO order_items (order_id, product_id, seller_id, unit_price, quantity, total_price, platform_fee_portion, seller_payout_amount, download_access_token)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $itemStmt->execute([
                    $orderId,
                    $item['product_id'],
                    $item['seller_id'],
                    $item['price'],
                    $item['quantity'],
                    $itemTotal,
                    $itemSplit['platform_fee'],
                    $itemSplit['seller_payout'],
                    $accessToken
                ]);

                // Create Escrow Protection Record
                $escrowStmt = $pdo->prepare("
                    INSERT INTO payment_protection_transactions (order_id, buyer_id, seller_id, amount, escrow_status)
                    VALUES (?, ?, ?, ?, 'held')
                ");
                $escrowStmt->execute([$orderId, $buyerId, $item['seller_id'], $itemSplit['seller_payout']]);

                // Increment Product Sales Count
                $prodStmt = $pdo->prepare("UPDATE products SET sales_count = sales_count + ? WHERE id = ?");
                $prodStmt->execute([$item['quantity'], $item['product_id']]);
            }

            $pdo->commit();
            return ['success' => true, 'order_id' => $orderId, 'order_number' => $orderNumber];
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log("Order processing failure: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
`;

export const PHP_HEADER_PHP = `<?php
/**
 * ============================================================================
 * Header Template - Responsive Modern Design & Accessible Navigation
 * ============================================================================
 */
require_once __DIR__ . '/../config/config.php';
$isLoggedIn = !empty($_SESSION['user_id']);
$userName = $_SESSION['user_name'] ?? 'Account';
$userRole = $_SESSION['user_role'] ?? 'guest';
$activePage = $activePage ?? 'home';
?>
<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle ?? 'Marketplace For Teachers | Teacher-Created Resources') ?></title>
    <meta name="description" content="<?= e($pageDescription ?? 'Buy and sell teacher-created curriculum, classroom decor, worksheets, and teaching materials with 100% Escrow Buyer Protection.') ?>">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
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
                        },
                        accent: {
                            50: '#f0fdf4',
                            500: '#22c55e',
                            600: '#16a34a',
                        }
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="flex flex-col min-h-full font-sans antialiased text-slate-900 bg-slate-50">

    <!-- Top Announcement Bar -->
    <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white text-xs py-2 px-4">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div class="flex items-center gap-2">
                <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                    <i class="fa-solid fa-shield-check mr-1"></i> Verified Teachers
                </span>
                <span>Oklahoma City, OK • 100% Escrow Buyer Protection • Only 5% Platform Fee</span>
            </div>
            <div class="flex items-center gap-4 text-[11px] text-blue-200">
                <a href="/buyer-protection" class="hover:text-white transition">Buyer Protection</a>
                <span class="text-blue-400">•</span>
                <a href="/wishlists" class="hover:text-white transition">Classroom Wishlists</a>
                <span class="text-blue-400">•</span>
                <a href="/community" class="hover:text-white transition">Teacher Lounge</a>
            </div>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20 gap-4">
                
                <!-- Brand Logo -->
                <a href="/" class="flex items-center gap-3 shrink-0">
                    <div class="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                        <i class="fa-solid fa-apple-whole text-2xl"></i>
                    </div>
                    <div>
                        <span class="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                            Marketplace<span class="text-blue-600">ForTeachers</span>
                        </span>
                        <span class="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">
                            Teacher-Powered Education
                        </span>
                    </div>
                </a>

                <!-- Search Form -->
                <form action="/marketplace" method="GET" class="hidden md:flex flex-1 max-w-xl mx-4">
                    <div class="relative w-full">
                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input 
                            type="text" 
                            name="search" 
                            value="<?= e($_GET['search'] ?? '') ?>"
                            placeholder="Search lesson plans, decor, worksheets, STEM bundles..." 
                            class="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                    </div>
                </form>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                    <a href="/sell" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition">
                        <i class="fa-solid fa-plus"></i> Sell Resource
                    </a>
                    <?php if ($isLoggedIn): ?>
                        <a href="/account" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                            <i class="fa-solid fa-user"></i> <?= e($userName) ?>
                        </a>
                    <?php else: ?>
                        <a href="/login" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In
                        </a>
                    <?php endif; ?>
                </div>

            </div>
        </div>
    </header>

    <main class="flex-1">
`;

export const PHP_FOOTER_PHP = `    </main>

    <!-- Master Footer -->
    <footer class="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                
                <!-- Brand Info -->
                <div class="lg:col-span-2 space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <i class="fa-solid fa-apple-whole text-xl"></i>
                        </div>
                        <span class="text-xl font-black tracking-tight text-white">
                            Marketplace<span class="text-blue-500">ForTeachers</span>
                        </span>
                    </div>
                    <p class="text-slate-400 text-sm leading-relaxed max-w-sm">
                        The trusted, independent digital & physical exchange built specifically for verified educators. 
                        Safe escrow transactions, transparent 5% platform fees, and classroom wishlist fundraising.
                    </p>
                    <div class="pt-2 text-xs text-slate-500 space-y-1">
                        <p><i class="fa-solid fa-location-dot mr-2 text-slate-400"></i> 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159</p>
                        <p><i class="fa-solid fa-envelope mr-2 text-slate-400"></i> marketplaceforteachers.com@gmail.com</p>
                    </div>
                </div>

                <!-- Marketplace Links -->
                <div>
                    <h4 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Marketplace</h4>
                    <ul class="space-y-2.5">
                        <li><a href="/marketplace" class="hover:text-white transition">All Resources</a></li>
                        <li><a href="/marketplace?category=curriculum-units" class="hover:text-white transition">Lesson Plans</a></li>
                        <li><a href="/marketplace?category=classroom-decor" class="hover:text-white transition">Classroom Decor</a></li>
                        <li><a href="/marketplace?is_free=1" class="hover:text-white transition">Free Printables</a></li>
                        <li><a href="/buyer-protection" class="hover:text-white transition">Buyer Protection</a></li>
                    </ul>
                </div>

                <!-- Community Links -->
                <div>
                    <h4 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Community</h4>
                    <ul class="space-y-2.5">
                        <li><a href="/wishlists" class="hover:text-white transition">Classroom Wishlists</a></li>
                        <li><a href="/community" class="hover:text-white transition">Teacher Lounge</a></li>
                        <li><a href="/stories" class="hover:text-white transition">Teacher Stories</a></li>
                        <li><a href="/verify-teacher" class="hover:text-white transition">Teacher Verification</a></li>
                        <li><a href="/sell" class="hover:text-white transition">Become a Seller</a></li>
                    </ul>
                </div>

                <!-- Legal & Trust -->
                <div>
                    <h4 class="text-white font-bold text-sm tracking-wider uppercase mb-4">Security & Trust</h4>
                    <ul class="space-y-2.5">
                        <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="/terms" class="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="/escrow-policy" class="hover:text-white transition">Escrow Safety Policy</a></li>
                        <li><a href="/admin" class="hover:text-white transition text-slate-500">Admin Portal</a></li>
                    </ul>
                </div>

            </div>

            <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <p>&copy; <?= date('Y') ?> MarketplaceForTeachers.com. All rights reserved.</p>
                <div class="flex items-center gap-4">
                    <span><i class="fa-solid fa-shield-check text-emerald-400 mr-1"></i> SSL 256-bit Encrypted</span>
                    <span><i class="fa-brands fa-stripe text-indigo-400 mr-1"></i> Stripe Verified</span>
                </div>
            </div>
        </div>
    </footer>

</body>
</html>
`;

export const PHP_ADMIN_INDEX_PHP = `<?php
/**
 * ============================================================================
 * MarketplaceForTeachers.com - Production Admin CMS
 * ============================================================================
 * Native PHP 8.2+ Administration Portal
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

$pageTitle = "Admin CMS Portal | Marketplace For Teachers";

// Retrieve System Metrics from MySQL
$dbConnected = false;
$stats = [
    'users_count'       => 0,
    'teachers_count'    => 0,
    'listings_count'    => 0,
    'orders_count'      => 0,
    'total_volume'      => 0.00,
    'platform_fees'     => 0.00,
    'pending_escrow'    => 0.00,
];

try {
    $pdo = getDbConnection();
    $dbConnected = true;

    $stats['users_count'] = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $stats['teachers_count'] = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'teacher' OR is_verified_teacher = 1")->fetchColumn();
    $stats['listings_count'] = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $stats['orders_count'] = (int)$pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $stats['total_volume'] = (float)$pdo->query("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'paid'")->fetchColumn();
    $stats['platform_fees'] = (float)$pdo->query("SELECT COALESCE(SUM(platform_fee), 0) FROM orders WHERE payment_status = 'paid'")->fetchColumn();
} catch (Exception $e) {
    // Database connection notice
}
?>
<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-100">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle) ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="min-h-full font-sans antialiased text-slate-900 flex flex-col">

    <!-- Admin Top Nav -->
    <header class="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                <i class="fa-solid fa-gauge-high"></i>
            </div>
            <div>
                <h1 class="font-bold text-sm leading-tight">Admin CMS Management Portal</h1>
                <p class="text-[10px] text-slate-400">MarketplaceForTeachers.com • Native PHP Production</p>
            </div>
        </div>
        <div class="flex items-center gap-3 text-xs">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium <?= $dbConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300' ?>">
                <span class="w-1.5 h-1.5 rounded-full <?= $dbConnected ? 'bg-emerald-400' : 'bg-rose-400' ?>"></span>
                <?= $dbConnected ? 'MySQL Connected' : 'DB Configuration Required' ?>
            </span>
            <a href="/" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md font-semibold text-slate-300 transition">View Website</a>
        </div>
    </header>

    <!-- Main Admin Dashboard -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span class="text-xs font-semibold text-slate-500">Gross Marketplace Volume</span>
                <div class="text-2xl font-black text-slate-900 mt-1">$<?= number_format($stats['total_volume'], 2) ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span class="text-xs font-semibold text-slate-500">Platform Revenue (5%)</span>
                <div class="text-2xl font-black text-emerald-600 mt-1">$<?= number_format($stats['platform_fees'], 2) ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span class="text-xs font-semibold text-slate-500">Active Teacher Accounts</span>
                <div class="text-2xl font-black text-blue-600 mt-1"><?= number_format($stats['teachers_count']) ?></div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span class="text-xs font-semibold text-slate-500">Total Orders Completed</span>
                <div class="text-2xl font-black text-slate-900 mt-1"><?= number_format($stats['orders_count']) ?></div>
            </div>
        </div>

        <!-- Management Modules -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                    <i class="fa-solid fa-user-check"></i>
                </div>
                <h3 class="font-bold text-slate-900">Teacher Verifications</h3>
                <p class="text-xs text-slate-500">Review teacher badge applications, school IDs, and state licenses.</p>
                <button class="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition">Review Applications</button>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h3 class="font-bold text-slate-900">Escrow & Payout Custody</h3>
                <p class="text-xs text-slate-500">Inspect held escrow funds, 48-hour release timers, and teacher payouts.</p>
                <button class="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition">Manage Escrow</button>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
                    <i class="fa-solid fa-envelope-circle-check"></i>
                </div>
                <h3 class="font-bold text-slate-900">Resend Email Logs</h3>
                <p class="text-xs text-slate-500">Track transactional email deliveries, bounce rates, and webhook events.</p>
                <button class="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition">View Delivery Logs</button>
            </div>
        </div>

    </div>

    <!-- Admin Footer -->
    <footer class="bg-white border-t border-slate-200 px-6 py-4 text-xs text-slate-500 flex items-center justify-between">
        <span>MarketplaceForTeachers.com Admin Engine</span>
        <span>PHP 8.2+ • MySQL 8.0+</span>
    </footer>

</body>
</html>
`;

export const PHP_CRON_MAINTENANCE = `<?php
/**
 * ============================================================================
 * MarketplaceForTeachers.com - Production Daily Maintenance Cron
 * ============================================================================
 * Set up in cPanel -> Cron Jobs:
 * /usr/local/bin/php /home/username/public_html/cron/daily_maintenance.php >/dev/null 2>&1
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

echo "[" . date('Y-m-d H:i:s') . "] Starting Marketplace Daily Maintenance Cron...\\n";

try {
    $pdo = getDbConnection();

    // 1. Automatically release escrow funds for orders delivered > 48 hours without dispute
    $stmt = $pdo->prepare("
        UPDATE orders 
        SET escrow_release_status = 'released_to_seller'
        WHERE order_status = 'delivered' 
          AND escrow_release_status = 'held_in_escrow'
          AND updated_at <= DATE_SUB(NOW(), INTERVAL 48 HOUR)
    ");
    $stmt->execute();
    $releasedOrders = $stmt->rowCount();
    echo "  -> Released escrow funds for $releasedOrders delivered orders.\\n";

    // 2. Clean up expired guest sessions / temp logs older than 30 days
    $cleanStmt = $pdo->prepare("DELETE FROM email_logs WHERE sent_at <= DATE_SUB(NOW(), INTERVAL 60 DAY)");
    $cleanStmt->execute();
    $cleanedLogs = $cleanStmt->rowCount();
    echo "  -> Cleaned $cleanedLogs old email log records.\\n";

    echo "[" . date('Y-m-d H:i:s') . "] Daily Maintenance Completed Successfully.\\n";
} catch (Exception $e) {
    echo "Cron Error: " . $e->getMessage() . "\\n";
}
`;

export const PHP_HTACCESS = `# ============================================================================
# MarketplaceForTeachers.com - Apache .htaccess Production Rules
# ============================================================================

# 1. Enable Rewrite Engine
RewriteEngine On
RewriteBase /

# 2. Force HTTPS / SSL on Production Domain
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 3. Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 4. Protect Sensitive Files and Directories
<FilesMatch "^\\.">
    Order allow,deny
    Deny from all
</FilesMatch>

<FilesMatch "(^#.*#|\\.(bak|config|dist|fla|inc|ini|log|psd|sh|sql|sw[op]|env))$">
    Order allow,deny
    Deny from all
</FilesMatch>

# 5. Route Static Assets Directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(assets/|uploads/|favicon\\.svg|robots\\.txt|sitemap\\.xml) - [L]

# 6. Route Admin Requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^admin/?(.*)$ admin/index.php [QSA,L]

# 7. Route All Website & API Requests to Front Controller
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
`;

export const PHP_README_CPANEL = `# MarketplaceForTeachers.com — cPanel Production Deployment Guide

## 1. System Architecture
- **Backend**: Native PHP 8.2+ with PDO MySQL driver
- **Database**: MySQL 8.0+ / MariaDB 10.6+ (16 Relational Tables)
- **Web Server**: Apache with mod_rewrite enabled (\`.htaccess\`)
- **Email Delivery**: Resend HTTPS REST API (Bypasses all cPanel SMTP blocks)
- **Node.js / npm / Vite / Express Requirement**: **NONE (0%)**

---

## 2. Fast 3-Step cPanel Deployment

### Step 1: Upload Files
1. Open cPanel **File Manager**.
2. Navigate to your domain's root (typically \`public_html/\`).
3. Upload and extract the contents of this deployment ZIP directly into \`public_html/\`.

### Step 2: Import Database
1. Open cPanel **MySQL Database Wizard** to create a database and user.
2. Open **phpMyAdmin**, select your new database, and click **Import**.
3. Select \`database/schema.sql\` and execute the import.

### Step 3: Configure Credentials
1. Rename \`config.example.php\` to \`config/config.php\` (or edit \`config/config.php\` directly).
2. Enter your MySQL database name, user, and password.
3. Add your \`RESEND_API_KEY\` for instant transactional email delivery.

---

## 3. Recommended Cron Job Setup
In cPanel -> **Cron Jobs**, add:
\`\`\`bash
0 2 * * * /usr/local/bin/php /home/YOUR_CPANEL_USER/public_html/cron/daily_maintenance.php >/dev/null 2>&1
\`\`\`
This automatically releases escrow funds 48 hours after delivery and maintains database logs.
`;
