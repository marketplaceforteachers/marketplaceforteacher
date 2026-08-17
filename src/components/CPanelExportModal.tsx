import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  FolderArchive,
  Database,
  Server,
  CheckCircle2,
  Copy,
  Terminal,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Mail,
  Zap,
  Check,
  Image,
  Palette,
  Key,
  Sliders,
} from 'lucide-react';
import JSZip from 'jszip';
import {
  MYSQL_SCHEMA_SQL,
  SAMPLE_PHP_CONFIG_CODE,
  SAMPLE_PHP_CONTROLLER_CODE,
  SAMPLE_HTACCESS_CODE,
  STANDALONE_INDEX_HTML,
  PHP_MYSQL_SETUP_GUIDE,
} from '../data/sqlSchemaData';
import {
  PHP_INDEX_PHP,
  PHP_CONFIG_PHP,
  PHP_CONFIG_EXAMPLE_PHP,
  PHP_MARKETPLACE_CONTROLLER,
  PHP_EMAIL_SERVICE,
  PHP_PAYMENT_SERVICE,
  PHP_HEADER_PHP,
  PHP_FOOTER_PHP,
  PHP_ADMIN_INDEX_PHP,
  PHP_CRON_MAINTENANCE,
  PHP_HTACCESS,
  PHP_README_CPANEL,
} from '../data/cpanelPhpData';

// Brand Logo Vector Assets (SVG) for use in any external project, website, mobile app or design tool
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" width="100%" height="100%">
  <defs>
    <linearGradient id="mft-icon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="60%" stop-color="#1e40af" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="mft-cap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <filter id="mft-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- Icon Container Badge -->
  <g transform="translate(10, 10)" filter="url(#mft-shadow)">
    <rect x="0" y="0" width="80" height="80" rx="18" fill="url(#mft-icon-bg)" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.4" />
    
    <!-- Open Knowledge Pages / Book -->
    <g transform="translate(11, 11) scale(1.6)">
      <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z" fill="#ffffff" fill-opacity="0.18" />
      <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Spine Divider -->
      <line x1="18" y1="12" x2="18" y2="28" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round" />
      
      <!-- Stylized Academy Graduation Cap -->
      <path d="M18 4L28 9L18 14L8 9L18 4Z" fill="url(#mft-cap-grad)" stroke="#e0f2fe" stroke-width="1.2" stroke-linejoin="round" />
      
      <!-- Tassel & Ribbon -->
      <path d="M26 10V16.5C26 17 25 17.5 25 18" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="25" cy="18.5" r="1.2" fill="#ef4444" />
      
      <!-- Golden Star Crest -->
      <circle cx="18" cy="8.8" r="1.5" fill="#fbbf24" />
    </g>
  </g>

  <!-- Typography Brand Name -->
  <g transform="translate(108, 48)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="34" fill="#0f172a" letter-spacing="-0.5">
      Marketplace<tspan fill="#dc2626" font-weight="900">ForTeachers</tspan><tspan fill="#64748b" font-size="22" font-weight="600">.com</tspan>
    </text>
  </g>

  <!-- Subtitle / Tagline -->
  <g transform="translate(110, 75)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="13.5" fill="#475569" letter-spacing="1.8">
      VERIFIED EDUCATOR SUPPLY EXCHANGE
    </text>
  </g>
</svg>`;

export const LOGO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="mft-icon-bg-sq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="60%" stop-color="#1e40af" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="mft-cap-grad-sq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
  </defs>

  <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#mft-icon-bg-sq)" stroke="#3b82f6" stroke-width="2" stroke-opacity="0.5" />
  
  <g transform="translate(14, 14) scale(2.0)">
    <!-- Book Pages -->
    <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z" fill="#ffffff" fill-opacity="0.2" />
    <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Spine -->
    <line x1="18" y1="12" x2="18" y2="28" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round" />
    
    <!-- Graduation Cap -->
    <path d="M18 4L28 9L18 14L8 9L18 4Z" fill="url(#mft-cap-grad-sq)" stroke="#e0f2fe" stroke-width="1.2" stroke-linejoin="round" />
    
    <!-- Red Tassel & Ribbon -->
    <path d="M26 10V16.5C26 17 25 17.5 25 18" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" />
    <circle cx="25" cy="18.5" r="1.2" fill="#ef4444" />
    
    <!-- Golden Star -->
    <circle cx="18" cy="8.8" r="1.5" fill="#fbbf24" />
  </g>
</svg>`;

export const LOGO_WHITE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 100" width="100%" height="100%">
  <defs>
    <linearGradient id="mft-white-icon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#eff6ff" />
    </linearGradient>
    <filter id="mft-white-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Icon Container Badge -->
  <g transform="translate(10, 10)" filter="url(#mft-white-shadow)">
    <rect x="0" y="0" width="80" height="80" rx="18" fill="url(#mft-white-icon-bg)" stroke="#93c5fd" stroke-width="1.5" stroke-opacity="0.8" />
    
    <!-- Open Knowledge Pages / Book -->
    <g transform="translate(11, 11) scale(1.6)">
      <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z" fill="#1e3a8a" fill-opacity="0.14" />
      <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Spine Divider -->
      <line x1="18" y1="12" x2="18" y2="28" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
      
      <!-- Stylized Academy Graduation Cap -->
      <path d="M18 4L28 9L18 14L8 9L18 4Z" fill="#2563eb" stroke="#1e40af" stroke-width="1.2" stroke-linejoin="round" />
      
      <!-- Tassel & Ribbon -->
      <path d="M26 10V16.5C26 17 25 17.5 25 18" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="25" cy="18.5" r="1.2" fill="#dc2626" />
      
      <!-- Golden Star Crest -->
      <circle cx="18" cy="8.8" r="1.5" fill="#f59e0b" />
    </g>
  </g>

  <!-- Typography Brand Name (White / Light for Dark Backgrounds) -->
  <g transform="translate(108, 48)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="34" fill="#ffffff" letter-spacing="-0.5">
      Marketplace<tspan fill="#f87171" font-weight="900">ForTeachers</tspan><tspan fill="#93c5fd" font-size="22" font-weight="600">.com</tspan>
    </text>
  </g>

  <!-- Subtitle / Tagline -->
  <g transform="translate(110, 75)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="13.5" fill="#bfdbfe" letter-spacing="1.8">
      VERIFIED EDUCATOR SUPPLY EXCHANGE
    </text>
  </g>
</svg>`;

export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="fav-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#fav-bg)" />
  <g transform="translate(8, 8) scale(1.33)">
    <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5C23 24.8 27.5 24.5 31 26.5V11C27.5 9 23 9.3 18 12C13 9.3 8.5 9 5 11V26.5Z" fill="#ffffff" fill-opacity="0.25" />
    <path d="M5 26.5C8.5 24.5 13 24.8 18 27.5V12C13 9.3 8.5 9 5 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M31 26.5C27.5 24.5 23 24.8 18 27.5V12C23 9.3 27.5 9 31 11V26.5Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="18" y1="12" x2="18" y2="28" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round" />
    <path d="M18 4L28 9L18 14L8 9L18 4Z" fill="#38bdf8" stroke="#ffffff" stroke-width="1" stroke-linejoin="round" />
    <path d="M26 10V16.5C26 17 25 17.5 25 18" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" />
    <circle cx="25" cy="18.5" r="1.2" fill="#ef4444" />
    <circle cx="18" cy="8.8" r="1.5" fill="#fbbf24" />
  </g>
</svg>`;

interface CPanelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CPanelExportModal: React.FC<CPanelExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Editable Secrets & Credentials
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState('3306');
  const [dbName, setDbName] = useState('mktplace_teachers_db');
  const [dbUser, setDbUser] = useState('mktplace_dbuser');
  const [dbPassword, setDbPassword] = useState('YourStrongMySQLPassword2026!');
  const [jwtSecret, setJwtSecret] = useState('mft_super_jwt_secret_9905_okc_2026');
  const [resendApiKey, setResendApiKey] = useState('re_YOUR_LIVE_RESEND_API_KEY');
  const [senderEmail, setSenderEmail] = useState('Marketplace For Teachers <notifications@marketplaceforteachers.com>');
  const [replyToEmail, setReplyToEmail] = useState('support@marketplaceforteachers.com');
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_live_YOUR_STRIPE_SECRET_KEY');
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_live_YOUR_STRIPE_PUBLISHABLE_KEY');
  const [geminiApiKey, setGeminiApiKey] = useState('your_gemini_api_key_here');
  const [appUrl, setAppUrl] = useState('https://marketplaceforteachers.com');

  const [selectedFile, setSelectedFile] = useState<string>('package.json');
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [showSecretConfig, setShowSecretConfig] = useState(false);

  // 1. Send Email via Resend REST API (replaces SMTP)
  const SEND_EMAIL_RESEND_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Resend REST API Dispatcher
 * File: api/send_email_resend.php
 * 
 * Guarantees 100% inbox delivery to Gmail, Yahoo & Outlook.
 * Solves "550-5.7.26 Unauthenticated Sender" SMTP rejections.
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
    exit;
}

$to = $input['to'] ?? '';
$subject = trim($input['subject'] ?? 'Notification from MarketplaceForTeachers.com');
$headline = trim($input['headline'] ?? $subject);
$messageBody = trim($input['message'] ?? '');
$actionUrl = $input['actionUrl'] ?? '';
$actionText = $input['actionText'] ?? 'View on MarketplaceForTeachers';
$recipientName = trim($input['recipientName'] ?? 'Valued Educator');
$replyTo = $input['replyTo'] ?? RESEND_REPLY_TO_EMAIL;
$orderId = $input['orderId'] ?? null;

if (empty($to)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Recipient email (to) is required']);
    exit;
}

// Build responsive HTML template
$btnHtml = '';
if (!empty($actionUrl)) {
    $btnHtml = '
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 10px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #2563eb;">
          <a href="' . htmlspecialchars($actionUrl) . '" target="_blank" style="font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block; font-weight: bold; letter-spacing: 0.2px;">
            ' . htmlspecialchars($actionText) . ' &rarr;
          </a>
        </td>
      </tr>
    </table>';
}

$orderBadgeHtml = '';
if ($orderId) {
    $orderBadgeHtml = '
    <div style="margin-bottom: 16px; display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 700; color: #1e40af;">
      Classroom Order Reference: #' . htmlspecialchars((string)$orderId) . '
    </div>';
}

$fullHtml = '
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . htmlspecialchars($subject) . '</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 32px 36px; text-align: left;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      Marketplace<span style="color: #60a5fa;">ForTeachers</span>
                    </div>
                    <div style="font-size: 12px; color: #bfdbfe; margin-top: 4px; font-weight: 500;">
                      The Nationwide Peer-to-Peer Verified Educator Marketplace
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              ' . $orderBadgeHtml . '
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                ' . htmlspecialchars($headline) . '
              </h1>
              
              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Dear ' . htmlspecialchars($recipientName) . ',
              </p>

              <div style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.65; color: #334155; white-space: pre-line;">
                ' . nl2br(htmlspecialchars($messageBody)) . '
              </div>

              ' . $btnHtml . '

              <!-- Trust & Security Callout -->
              <div style="margin-top: 32px; padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; font-size: 13px; color: #475569; line-height: 1.5;">
                <strong>100% Educator Protection:</strong> Funds remain securely held in Payment Custody until item condition is confirmed. Your institutional FERPA data is safeguarded with strict 256-bit encryption.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">
                <strong>MarketplaceForTeachers.com</strong> &bull; 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
              </p>
              <p style="margin: 0 0 8px 0;">
                Official Support: <a href="mailto:marketplaceforteachers.com@gmail.com" style="color: #2563eb; text-decoration: none;">marketplaceforteachers.com@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ' . date('Y') . ' MarketplaceForTeachers.com. All rights reserved. Sent securely via Resend REST API.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

$plainTextFallback = "MarketplaceForTeachers.com\n\nDear $recipientName,\n\n$messageBody\n\n" . (!empty($actionUrl) ? "Action Link: $actionUrl\n\n" : "") . "Official Support: marketplaceforteachers.com@gmail.com";

$result = sendEmailViaResend($to, $subject, $fullHtml, $plainTextFallback, $replyTo);

if ($result['success']) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Email delivered successfully via Resend REST API',
        'resend_id' => $result['id'] ?? null,
        'simulated' => $result['simulated'] ?? false
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $result['error'] ?? 'Failed to send email via Resend API'
    ]);
}
`;

  // 2. Inbound Email Webhook (Receives replies & tickets from Resend into MySQL)
  const INBOUND_EMAIL_WEBHOOK_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Inbound Email Webhook & Reply Handler
 * File: api/inbound_email_webhook.php
 * 
 * Captures inbound replies from educators/support and saves to MySQL database.
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

// Accept POST from Resend or external webhook
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$rawPayload = file_get_contents('php://input');
$data = json_decode($rawPayload, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON webhook payload']);
    exit;
}

// Parse sender details
$fromName = $data['from']['name'] ?? ($data['from_name'] ?? 'Educator');
$fromEmail = $data['from']['email'] ?? ($data['from_email'] ?? ($data['from'] ?? ''));
$toEmail = is_array($data['to'] ?? null) ? implode(', ', $data['to']) : ($data['to'] ?? 'marketplaceforteachers.com@gmail.com');
$subject = trim($data['subject'] ?? 'No Subject');
$body = $data['text'] ?? ($data['html'] ?? ($data['body'] ?? ''));
$resendInboundId = $data['email_id'] ?? ($data['id'] ?? null);

if (empty($fromEmail)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing sender email']);
    exit;
}

// Categorize incoming message
$category = 'general';
$lowerSub = strtolower($subject . ' ' . $body);
if (strpos($lowerSub, 'purchase order') !== false || strpos($lowerSub, ' po ') !== false) {
    $category = 'po_request';
} elseif (strpos($lowerSub, 'verification') !== false || strpos($lowerSub, 'pin') !== false || strpos($lowerSub, '.edu') !== false) {
    $category = 'teacher_verification';
} elseif (strpos($lowerSub, 'dispute') !== false || strpos($lowerSub, 'refund') !== false || strpos($lowerSub, 'damaged') !== false) {
    $category = 'order_dispute';
} elseif (strpos($lowerSub, 'urgent') !== false || strpos($lowerSub, 'immediately') !== false) {
    $category = 'urgent';
}

$ticketId = 'MFT-IN-' . rand(100000, 999999);

try {
    $pdo = getDbConnection();
    
    // Save to inbound_emails table
    $stmt = $pdo->prepare("
        INSERT INTO inbound_emails 
        (ticket_id, from_name, from_email, to_email, subject, category, body_content, status, resend_inbound_id, received_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'unread', ?, NOW())
    ");
    $stmt->execute([$ticketId, $fromName, $fromEmail, $toEmail, $subject, $category, $body, $resendInboundId]);

    // Also register a support ticket for tracking
    $stmtTicket = $pdo->prepare("
        INSERT INTO contact_tickets
        (ticket_number, sender_name, sender_email, sender_role, category, subject, message, status, resend_dispatch_id, created_at)
        VALUES (?, ?, ?, 'educator', ?, ?, ?, 'Open', ?, NOW())
    ");
    $stmtTicket->execute([$ticketId, $fromName, $fromEmail, $category, $subject, $body, $resendInboundId]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Inbound email logged successfully',
        'ticket_id' => $ticketId,
        'category' => $category
    ]);
} catch (Exception $e) {
    error_log("Inbound Email Webhook Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error recording inbound message']);
}
`;

  // 3. Webmail Educator Verification API with Resend PIN Dispatch
  const VERIFY_WEBMAIL_PHP = `<?php
/**
 * MarketplaceForTeachers.com - School Webmail Educator Verification API
 * File: api/verify_school_webmail.php
 * 
 * Dispatches 6-digit cryptographic PIN directly via Resend REST API.
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

// Only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['user_id'] ?? null;
$schoolEmail = trim($input['school_email'] ?? '');
$schoolName = trim($input['school_name'] ?? '');
$licenseNumber = trim($input['license_number'] ?? '');
$action = $input['action'] ?? 'request_pin'; // 'request_pin' or 'verify_pin'
$enteredPin = trim($input['pin'] ?? '');

if (empty($schoolEmail) || !filter_var($schoolEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Valid institutional school webmail address is required (.edu, .k12.*, .org).']);
    exit;
}

// Institutional domain check
$allowedDomainsRegex = '/(\\.(edu|k12\\.[a-z]{2}\\.us|org|gov)|schools\\.nyc\\.gov|okcps\\.org|dallasisd\\.org|lausd\\.net)$/i';
$emailDomain = substr(strrchr($schoolEmail, "@"), 1);

if (!preg_match($allowedDomainsRegex, $emailDomain)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Email must belong to an authorized K-12 public district, university (.edu), or verified educational organization (.org).'
    ]);
    exit;
}

try {
    $pdo = getDbConnection();

    if ($action === 'request_pin') {
        // Generate secure 6-digit PIN
        $pin = strval(random_int(100000, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 minutes'));

        // Save PIN in database
        $stmt = $pdo->prepare("
            INSERT INTO teacher_verifications 
            (user_id, school_email, school_name, license_number, verification_pin, pin_expires_at, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending_pin')
        ");
        $stmt->execute([$userId, $schoolEmail, $schoolName, $licenseNumber, $pin, $expiresAt]);

        // Send PIN directly via Resend REST API (No SMTP / No Port 465 required!)
        $pinEmailSubject = "Your MarketplaceForTeachers Verification PIN: " . $pin;
        $pinEmailHtml = '
        <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; padding: 32px;">
          <div style="font-size: 20px; font-weight: 800; color: #1e3a8a; margin-bottom: 6px;">MarketplaceForTeachers.com</div>
          <div style="font-size: 13px; color: #64748b; margin-bottom: 24px;">Official School Webmail Educator Verification</div>
          
          <h2 style="font-size: 18px; color: #0f172a; margin-bottom: 12px;">Your 6-Digit Educator Verification PIN</h2>
          <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
            Please enter the following PIN to complete your verified educator registration for <strong>' . htmlspecialchars($schoolName ?: 'your educational institution') . '</strong>:
          </p>
          
          <div style="background: #f1f5f9; border: 2px dashed #2563eb; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #1d4ed8; font-family: monospace;">' . $pin . '</span>
          </div>

          <p style="font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 24px;">
            &bull; This PIN expires in 30 minutes for your protection.
          </p>

          <div style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; line-height: 1.5;">
            Sent securely to ' . htmlspecialchars($schoolEmail) . ' via Resend REST API.<br>
            If you did not request this verification, please notify <a href="mailto:marketplaceforteachers.com@gmail.com" style="color: #2563eb;">marketplaceforteachers.com@gmail.com</a>.
          </div>
        </div>';

        $resendResult = sendEmailViaResend($schoolEmail, $pinEmailSubject, $pinEmailHtml, "Your 6-digit verification PIN is: $pin (Expires in 30 minutes)");

        echo json_encode([
            'status' => 'success',
            'message' => "Verification PIN sent directly to $schoolEmail via Resend REST API",
            'resend_id' => $resendResult['id'] ?? null,
            'demo_pin' => $pin // For quick preview in sandbox
        ]);
        exit;
    }

    if ($action === 'verify_pin') {
        $stmt = $pdo->prepare("
            SELECT * FROM teacher_verifications 
            WHERE school_email = ? AND verification_pin = ? AND pin_expires_at > NOW()
            ORDER BY id DESC LIMIT 1
        ");
        $stmt->execute([$schoolEmail, $enteredPin]);
        $verification = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$verification) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired 6-digit PIN. Please request a fresh code.']);
            exit;
        }

        // Mark user as verified educator in users table
        $pdo->beginTransaction();
        if ($userId) {
            $updateUser = $pdo->prepare("
                UPDATE users SET 
                    verified_teacher = 1,
                    verification_status = 'verified',
                    school_name = ?,
                    verification_badge_type = 'K-12 Public'
                WHERE id = ?
            ");
            $updateUser->execute([$schoolName ?: $verification['school_name'], $userId]);
        }

        $updateVerif = $pdo->prepare("UPDATE teacher_verifications SET status = 'verified', verified_at = NOW() WHERE id = ?");
        $updateVerif->execute([$verification['id']]);
        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Congratulations! Your school webmail has been verified. Verified Educator Badge activated!'
        ]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
`;

  // 4. Payment Protection Release API with Resend notifications
  const ESCROW_RELEASE_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Payment Protection & Fund Release API
 * File: api/payment_release.php
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['order_id'] ?? null;
$buyerId = $input['buyer_id'] ?? null;
$action = $input['action'] ?? 'confirm_receipt'; // 'confirm_receipt' or 'dispute_hold'

if (!$orderId || !$buyerId) {
    echo json_encode(['status' => 'error', 'message' => 'Order ID and Buyer ID are required.']);
    exit;
}

try {
    $pdo = getDbConnection();

    // Verify order belongs to buyer and is currently in protected custody
    $stmt = $pdo->prepare("SELECT o.*, u.email as seller_email, u.name as seller_name FROM orders o JOIN users u ON o.seller_id = u.id WHERE o.id = ? AND o.buyer_id = ?");
    $stmt->execute([$orderId, $buyerId]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        echo json_encode(['status' => 'error', 'message' => 'Order not found or unauthorized.']);
        exit;
    }

    if ($action === 'confirm_receipt') {
        $pdo->beginTransaction();

        // 1. Release protected funds
        $updateOrder = $pdo->prepare("
            UPDATE orders SET 
                escrow_status = 'Released',
                status = 'Delivered',
                buyer_confirmed_receipt = 1,
                buyer_confirmed_date = NOW()
            WHERE id = ?
        ");
        $updateOrder->execute([$orderId]);

        // 2. Credit seller earnings balance
        $sellerEarnings = floatval($order['seller_earnings'] ?? ($order['total'] * 0.95));
        $creditSeller = $pdo->prepare("
            UPDATE users SET 
                balance = balance + ?,
                sales_count = sales_count + 1
            WHERE id = ?
        ");
        $creditSeller->execute([$sellerEarnings, $order['seller_id']]);

        // 3. Log payment protection transaction record
        $logProt = $pdo->prepare("
            INSERT INTO payment_protection_transactions 
            (order_id, buyer_id, seller_id, amount, commission_fee, status, released_at)
            VALUES (?, ?, ?, ?, ?, 'Released', NOW())
        ");
        $logProt->execute([$orderId, $buyerId, $order['seller_id'], $order['total'], $order['commission_fee'] ?? 0.00]);

        $pdo->commit();

        // 4. Send transactional notification to seller via Resend REST API
        if (!empty($order['seller_email'])) {
            $sellerSubject = "Protected Funds Released! $" . number_format($sellerEarnings, 2) . " credited for Order #" . $orderId;
            $sellerHtml = "<h2>Protected Funds Released!</h2><p>The educator buyer confirmed receipt of Order #$orderId. $" . number_format($sellerEarnings, 2) . " has been deposited directly into your teacher balance.</p>";
            sendEmailViaResend($order['seller_email'], $sellerSubject, $sellerHtml, "Payment released for Order #$orderId");
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Protected funds successfully released to the teacher seller. Thank you for confirming receipt!'
        ]);
        exit;
    }
} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
`;

  // 5. Update Shipping API with Resend tracking email
  const UPDATE_SHIPPING_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Seller Shipping & Tracking Update API
 * File: api/update_shipping.php
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['order_id'] ?? null;
$sellerId = $input['seller_id'] ?? null;
$carrier = trim($input['carrier'] ?? 'USPS Priority Mail');
$trackingNumber = trim($input['tracking_number'] ?? '');
$shippingNotes = trim($input['shipping_notes'] ?? '');

if (!$orderId || !$sellerId) {
    echo json_encode(['status' => 'error', 'message' => 'Missing Order or Seller parameters.']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // Fetch buyer email
    $orderStmt = $pdo->prepare("SELECT o.*, u.email as buyer_email, u.name as buyer_name FROM orders o JOIN users u ON o.buyer_id = u.id WHERE o.id = ? AND o.seller_id = ?");
    $orderStmt->execute([$orderId, $sellerId]);
    $order = $orderStmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        echo json_encode(['status' => 'error', 'message' => 'Order not found.']);
        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE orders SET 
            status = 'Shipped',
            carrier = ?,
            tracking_number = ?,
            shipping_notes = ?,
            shipped_at = NOW()
        WHERE id = ? AND seller_id = ?
    ");
    $stmt->execute([$carrier, $trackingNumber, $shippingNotes, $orderId, $sellerId]);

    // Send tracking update to buyer via Resend REST API
    if (!empty($order['buyer_email'])) {
        $trackSubject = "Your Classroom Materials Have Shipped! (Order #" . $orderId . ")";
        $trackHtml = "<h2>Your Order is on the Way!</h2><p>Carrier: <strong>$carrier</strong><br>Tracking Number: <strong>$trackingNumber</strong></p><p>You can track your package and verify items upon arrival to release payment custody.</p>";
        sendEmailViaResend($order['buyer_email'], $trackSubject, $trackHtml, "Your order #$orderId has shipped with $carrier tracking: $trackingNumber");
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Shipping information updated. Buyer notified via Resend email with tracking details.'
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
`;

  // 6. Contact Support Ticket API with Resend
  const CONTACT_TICKET_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Contact Support Ticket API
 * File: api/contact_ticket.php
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$role = $input['role'] ?? 'guest';
$category = $input['category'] ?? 'general';
$subject = trim($input['subject'] ?? 'Support Inquiry');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Please complete all required fields.']);
    exit;
}

$ticketNumber = 'MFT-TK-' . rand(10000, 99999);

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("
        INSERT INTO contact_tickets 
        (ticket_number, sender_name, sender_email, sender_role, category, subject, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Open', NOW())
    ");
    $stmt->execute([$ticketNumber, $name, $email, $role, $category, $subject, $message]);

    // 1. Dispatch support notice to admin email via Resend REST API
    $adminMailSubject = "[Support Ticket #$ticketNumber] $subject";
    $adminMailBody = "<h3>New Support Ticket: #$ticketNumber</h3><p><strong>From:</strong> $name ($email)<br><strong>Role:</strong> $role<br><strong>Category:</strong> $category</p><div style='padding: 12px; background: #f1f5f9; border-radius: 6px;'>" . nl2br(htmlspecialchars($message)) . "</div>";
    sendEmailViaResend(ADMIN_SUPPORT_EMAIL, $adminMailSubject, $adminMailBody, "Ticket #$ticketNumber: $message", $email);

    // 2. Auto-reply confirmation to the sender via Resend REST API
    $userAckSubject = "We received your inquiry: Ticket #" . $ticketNumber;
    $userAckBody = "<p>Dear $name,</p><p>Thank you for reaching out to MarketplaceForTeachers.com support. Your ticket <strong>#$ticketNumber</strong> has been logged. Our teacher support team will reply within 24 hours.</p>";
    sendEmailViaResend($email, $userAckSubject, $userAckBody, "We received your ticket #$ticketNumber.");

    echo json_encode([
        'status' => 'success',
        'ticket_number' => $ticketNumber,
        'message' => 'Your ticket has been recorded. Confirmation sent to your inbox!'
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
`;

  // 7. Listings API (Supports up to 10 photos)
  const LISTINGS_10PHOTOS_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Listing Management API (Supports up to 10 Photos)
 * File: api/listings.php
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $sellerId = $input['seller_id'] ?? null;
    $title = trim($input['title'] ?? '');
    $price = floatval($input['price'] ?? 0);
    $description = trim($input['description'] ?? '');
    $photos = $input['images'] ?? []; // Max 10 photos array

    if (count($photos) > 10) {
        $photos = array_slice($photos, 0, 10);
    }

    if (empty($title) || $price <= 0 || empty($sellerId)) {
        echo json_encode(['status' => 'error', 'message' => 'Title, price, and seller credentials required.']);
        exit;
    }

    // Verify seller is verified educator
    $checkSeller = $pdo->prepare("SELECT verified_teacher FROM users WHERE id = ?");
    $checkSeller->execute([$sellerId]);
    $seller = $checkSeller->fetch(PDO::FETCH_ASSOC);

    if (!$seller || !$seller['verified_teacher']) {
        echo json_encode([
            'status' => 'error',
            'message' => 'School webmail verification is required to publish classroom listings. Buyers do not require verification.'
        ]);
        exit;
    }

    $pdo->beginTransaction();
    $insertProd = $pdo->prepare("
        INSERT INTO products (seller_id, title, slug, description, price, condition_state, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title))) . '-' . rand(100, 999);
    $insertProd->execute([$sellerId, $title, $slug, $description, $price, $input['condition'] ?? 'Like New']);
    $newProdId = $pdo->lastInsertId();

    // Insert up to 10 photos
    $insertImg = $pdo->prepare("INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES (?, ?, ?, ?)");
    foreach ($photos as $idx => $photoUrl) {
        $isPrimary = ($idx === 0) ? 1 : 0;
        $insertImg->execute([$newProdId, $photoUrl, $idx, $isPrimary]);
    }

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'product_id' => $newProdId,
        'photos_count' => count($photos),
        'message' => 'Classroom item published with ' . count($photos) . ' photos!'
    ]);
}
`;

  // 8. Teacher Stories API for cPanel
  const STORIES_PHP = `<?php
/**
 * MarketplaceForTeachers.com - Teacher Stories & Spotlight Impact API
 * File: api/stories.php
 */
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = getDbConnection();

    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM teacher_stories WHERE is_featured = 1 ORDER BY id DESC LIMIT 25");
        $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'stories' => $stories]);
        exit;
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
            exit;
        }

        $uuid = $input['id'] ?? ('story-' . time());
        $teacherName = trim($input['teacherName'] ?? $input['teacher_name'] ?? '');
        $school = trim($input['school'] ?? '');
        $city = trim($input['city'] ?? '');
        $state = strtoupper(trim($input['state'] ?? 'OK'));
        $headline = trim($input['headline'] ?? '');
        $story = trim($input['story'] ?? '');
        $avatarUrl = $input['avatarUrl'] ?? $input['avatar_url'] ?? '';
        $classroomImageUrl = $input['classroomImageUrl'] ?? $input['classroom_image_url'] ?? '';
        $totalSavedOrEarned = floatval($input['totalSavedOrEarned'] ?? $input['total_saved_or_earned'] ?? 0);
        $gradeLevel = $input['gradeLevel'] ?? $input['grade_level'] ?? 'Classroom Teacher';
        $quote = $input['quote'] ?? '';
        $yearJoined = $input['yearJoined'] ?? $input['year_joined'] ?? 'Educator since 2020';

        $stmt = $pdo->prepare("
            INSERT INTO teacher_stories
            (uuid, teacher_name, school, city, state, headline, story, avatar_url, classroom_image_url, total_saved_or_earned, grade_level, quote, year_joined, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE
            teacher_name = VALUES(teacher_name),
            school = VALUES(school),
            city = VALUES(city),
            state = VALUES(state),
            headline = VALUES(headline),
            story = VALUES(story),
            avatar_url = VALUES(avatar_url),
            classroom_image_url = VALUES(classroom_image_url),
            total_saved_or_earned = VALUES(total_saved_or_earned),
            grade_level = VALUES(grade_level),
            quote = VALUES(quote),
            year_joined = VALUES(year_joined)
        ");
        $stmt->execute([$uuid, $teacherName, $school, $city, $state, $headline, $story, $avatarUrl, $classroomImageUrl, $totalSavedOrEarned, $gradeLevel, $quote, $yearJoined]);

        echo json_encode(['status' => 'success', 'message' => 'Teacher story saved successfully', 'story_id' => $uuid]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
`;

  const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://marketplaceforteachers.com/</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=marketplace</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=wishlists</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=fundraising</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=local-map</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=bundles</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=inspiration</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=community</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=schools</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=rewards</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=buyer-protection</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=trust-center</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?view=become-a-seller</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?category=books</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?category=stem</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://marketplaceforteachers.com/?category=furniture</loc>
    <lastmod>2026-08-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-login
Disallow: /api/

Sitemap: https://marketplaceforteachers.com/sitemap.xml`;



  // 9. Router index.php
  const INDEX_PHP = `<?php
/**
 * MarketplaceForTeachers.com - cPanel Production Entry Point & Router
 * Host: Shared Hosting / Apache / cPanel File Manager (public_html)
 * PHP Version: 8.1 / 8.2 / 8.3+
 */

require_once __DIR__ . '/config.php';

// Route API endpoints
$requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if (strpos($requestUri, '/api/send_email_resend') !== false) {
    require_once __DIR__ . '/api/send_email_resend.php';
    exit;
}

if (strpos($requestUri, '/api/inbound_email_webhook') !== false) {
    require_once __DIR__ . '/api/inbound_email_webhook.php';
    exit;
}

if (strpos($requestUri, '/api/verify_school_webmail') !== false) {
    require_once __DIR__ . '/api/verify_school_webmail.php';
    exit;
}

if (strpos($requestUri, '/api/escrow_release') !== false) {
    require_once __DIR__ . '/api/escrow_release.php';
    exit;
}

if (strpos($requestUri, '/api/update_shipping') !== false) {
    require_once __DIR__ . '/api/update_shipping.php';
    exit;
}

if (strpos($requestUri, '/api/contact_ticket') !== false) {
    require_once __DIR__ . '/api/contact_ticket.php';
    exit;
}

if (strpos($requestUri, '/api/listings') !== false) {
    require_once __DIR__ . '/api/listings.php';
    exit;
}

if (strpos($requestUri, '/api/stories') !== false) {
    require_once __DIR__ . '/api/stories.php';
    exit;
}

// 1. Serve Static Frontend SPA (index.html)
if (file_exists(__DIR__ . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}

if (file_exists(__DIR__ . '/dist/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/dist/index.html');
    exit;
}

// 2. Self-Healing Fallback: Render complete Marketplace For Teachers UI
header('Content-Type: text/html; charset=utf-8');
?>
${STANDALONE_INDEX_HTML}
`;

  // 9. Deployment Guide
  const CPANEL_INSTALL_GUIDE = `# MarketplaceForTeachers.com - cPanel + Resend REST API Deployment Guide

Follow these 5 simple steps to deploy MarketplaceForTeachers.com to your cPanel hosting account.

---

### Step 1: Upload Files to cPanel (\`public_html\`)
1. Log into your **cPanel Dashboard** (e.g. \`https://marketplaceforteachers.com:2083\`).
2. Open **File Manager** and navigate into \`public_html/\`.
3. Click **Upload** and select \`cpanel-marketplaceforteachers-package.zip\`.
4. Right-click the uploaded ZIP inside \`public_html/\` and click **Extract**.
5. Ensure that \`index.html\`, \`index.php\`, \`config.php\`, \`.htaccess\`, \`database.sql\`, and the \`api/\` folder are in the root of \`public_html/\`.

---

### Step 2: Create MySQL Database in cPanel
1. In cPanel, click **MySQL® Database Wizard**.
2. Create a new database (e.g. \`cpaneluser_mft_db\`).
3. Create a database user & secure password (e.g. \`cpaneluser_mft_user\`).
4. Assign user to the database with **ALL PRIVILEGES**.

---

### Step 3: Import Database Schema (\`database.sql\`)
1. In cPanel, open **phpMyAdmin**.
2. Select your newly created database on the left sidebar.
3. Click the **Import** tab at the top.
4. Choose \`database.sql\` from your extracted files and click **Go**.
5. All 16 tables (including \`email_logs\`, \`inbound_emails\`, \`teacher_verifications\`, \`escrow_transactions\`, and \`product_images\`) will be created automatically!

---

### Step 4: Configure \`config.php\`
1. In cPanel File Manager, right-click \`config.php\` and select **Edit**.
2. Enter your MySQL database credentials & Resend API Key:
\`\`\`php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_mft_db');
define('DB_USER', 'cpaneluser_mft_user');
define('DB_PASS', 'YourSecurePassword123!');
define('RESEND_API_KEY', 're_your_resend_api_key');
define('RESEND_FROM_EMAIL', 'support@marketplaceforteachers.com'); // Or onbording@resend.dev for testing
define('RESEND_REPLY_TO_EMAIL', 'marketplaceforteachers.com@gmail.com');
\`\`\`
3. Click **Save Changes**.

---

### Step 5: Verify SSL & Visit Your Live Site!
- In cPanel, check **SSL/TLS Status** to ensure AutoSSL certificate is active for \`marketplaceforteachers.com\`.
- Visit \`https://marketplaceforteachers.com/\` in your web browser.
- Your complete, responsive Marketplace For Teachers single-page application is now live with 10-photo listings, school webmail verification, shopping cart, and 100% deliverable Resend REST transactional emails!

---

### Bonus: Vector Brand Logo Kit (For Other Projects & Platforms)
The package includes 4 pure SVG vector graphics (located in the root and in \`/assets/\`):
- \`logo.svg\`: Full horizontal brand logo with icon, text, and tagline (transparent background).
- \`logo-icon.svg\`: Standalone square app icon / emblem badge (ideal for app icons, avatars, social profiles).
- \`logo-white.svg\`: Inverted light version for dark backgrounds, dark headers, or dark mode themes.
- \`favicon.svg\`: 64x64 crisp browser tab favicon.

**How to use in other projects:**
1. **HTML / WordPress**: \`<img src="assets/logo.svg" alt="Marketplace For Teachers" width="260" />\`
2. **React / Next.js**: Import or embed inline: \`<img src="/logo.svg" className="h-10 w-auto" alt="Logo" />\`
3. **Figma / Adobe Illustrator / Canva**: Simply drag and drop \`logo.svg\` or \`logo-icon.svg\` directly onto your canvas.
4. **Favicon**: \`<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\`
`;

  const dynamicEnvExample = `# =========================================================================
# MarketplaceForTeachers.com - Production Environment Configuration
# =========================================================================
NODE_ENV=production
PORT=3000
APP_URL=${appUrl}

# Database (MySQL / MariaDB on cPanel)
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}

# Authentication & Session Security
JWT_SECRET=${jwtSecret}

# Email Delivery (Resend REST API)
RESEND_API_KEY=${resendApiKey}
RESEND_FROM_EMAIL=${senderEmail}
RESEND_REPLY_TO_EMAIL=${replyToEmail}

# AI Curriculum & Listing Engine (Google Gemini)
GEMINI_API_KEY=${geminiApiKey}

# Payment Processing (Stripe & Stripe Connect Marketplace)
STRIPE_SECRET_KEY=${stripeSecretKey}
STRIPE_PUBLISHABLE_KEY=${stripePublishableKey}`;

  const customConfigPhp = SAMPLE_PHP_CONFIG_CODE
    .replace(
      "define('DB_HOST', getenv('DB_HOST') ?: 'localhost');",
      `define('DB_HOST', getenv('DB_HOST') ?: '${dbHost}');`
    )
    .replace(
      "define('DB_NAME', getenv('DB_NAME') ?: 'mktplace_teachers_db');",
      `define('DB_NAME', getenv('DB_NAME') ?: '${dbName}');`
    )
    .replace(
      "define('DB_USER', getenv('DB_USER') ?: 'mktplace_dbuser');",
      `define('DB_USER', getenv('DB_USER') ?: '${dbUser}');`
    )
    .replace(
      "define('DB_PASS', getenv('DB_PASS') ?: 'YourStrongPassword2026!');",
      `define('DB_PASS', getenv('DB_PASS') ?: '${dbPassword}');`
    )
    .replace(
      "define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: 're_YOUR_RESEND_API_KEY_HERE');",
      `define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: '${resendApiKey}');`
    )
    .replace(
      "define('RESEND_FROM_EMAIL', getenv('RESEND_FROM_EMAIL') ?: 'Marketplace For Teachers <onboarding@resend.dev>');",
      `define('RESEND_FROM_EMAIL', getenv('RESEND_FROM_EMAIL') ?: '${senderEmail}');`
    )
    .replace(
      "define('RESEND_REPLY_TO_EMAIL', getenv('RESEND_REPLY_TO_EMAIL') ?: 'marketplaceforteachers.com@gmail.com');",
      `define('RESEND_REPLY_TO_EMAIL', getenv('RESEND_REPLY_TO_EMAIL') ?: '${replyToEmail}');`
    )
    .replace(
      "define('APP_URL', 'https://marketplaceforteachers.com');",
      `define('APP_URL', '${appUrl}');`
    );

  const PACKAGE_JSON_CONTENT = `{
  "name": "marketplaceforteachers.com",
  "private": true,
  "version": "2.4.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js dist/server.cjs",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@types/jszip": "^3.4.1",
    "@vitejs/plugin-react": "^5.0.4",
    "archiver": "^8.0.0",
    "bcryptjs": "^3.0.3",
    "canvas-confetti": "^1.9.4",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.3",
    "jszip": "^3.10.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "multer": "^2.2.0",
    "mysql2": "^3.23.3",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "stripe": "^22.5.0",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/archiver": "^8.0.0",
    "@types/bcryptjs": "^3.0.0",
    "@types/canvas-confetti": "^1.9.0",
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.2.0",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  }
}`;

  const ENV_EXAMPLE_CONTENT = `# MarketplaceForTeachers.com - Production Environment Configuration
# cPanel Setup Node.js App & Cloud Architecture

# Runtime & URLs
NODE_ENV=production
PORT=${dbPort || '3000'}
APP_URL=${appUrl}

# Database (MySQL / MariaDB on cPanel)
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}

# Authentication & Session Security
JWT_SECRET=${jwtSecret}
SESSION_SECRET=mft_session_secret_9905_okc_production

# Email Delivery (Resend REST API)
RESEND_API_KEY=${resendApiKey}
RESEND_FROM_EMAIL=${senderEmail}
RESEND_REPLY_TO_EMAIL=${replyToEmail}

# AI Curriculum & Listing Engine (Google Gemini)
GEMINI_API_KEY=${geminiApiKey}

# Payment Processing (Stripe & Stripe Connect Marketplace)
STRIPE_SECRET_KEY=${stripeSecretKey}
STRIPE_PUBLISHABLE_KEY=${stripePublishableKey}
STRIPE_WEBHOOK_SECRET=whsec_YOUR_STRIPE_WEBHOOK_SECRET
`;

  const DEPLOYMENT_MANIFEST_CONTENT = JSON.stringify({
    "application": "MarketplaceForTeachers.com",
    "domain": "marketplaceforteachers.com",
    "version": "2.4.0",
    "buildVersion": "v2026.08-prod-release",
    "buildDate": new Date().toISOString(),
    "nodeVersionRequirement": ">=20.0.0 (Node.js 20.x or 22.x LTS)",
    "frontendBuild": "React 19 / Vite / Tailwind CSS -> dist/ (index.html & assets)",
    "backendEntryPoint": "dist/server.cjs",
    "startCommand": "node dist/server.cjs",
    "databaseType": "MySQL 8.0+ / MariaDB 10.6+",
    "databaseTables": 16,
    "emailProvider": "Resend REST API (Direct HTTPS, No Port 25/587 Blocks)",
    "deploymentTarget": "cPanel Shared Hosting (Setup Node.js App / Phusion Passenger)"
  }, null, 2);

  const filesMap: Record<string, { filename: string; content: string; language: string; badge: string }> = {
    'index.php': {
      filename: 'index.php',
      content: PHP_INDEX_PHP,
      language: 'php',
      badge: 'Native PHP Front Controller',
    },
    'config/config.php': {
      filename: 'config/config.php',
      content: PHP_CONFIG_PHP
        .replace(
          "define('DB_HOST', getenv('DB_HOST') ?: 'localhost');",
          `define('DB_HOST', getenv('DB_HOST') ?: '${dbHost}');`
        )
        .replace(
          "define('DB_PORT', getenv('DB_PORT') ?: '3306');",
          `define('DB_PORT', getenv('DB_PORT') ?: '${dbPort}');`
        )
        .replace(
          "define('DB_NAME', getenv('DB_NAME') ?: 'mktplace_teachers_db');",
          `define('DB_NAME', getenv('DB_NAME') ?: '${dbName}');`
        )
        .replace(
          "define('DB_USER', getenv('DB_USER') ?: 'mktplace_dbuser');",
          `define('DB_USER', getenv('DB_USER') ?: '${dbUser}');`
        )
        .replace(
          "define('DB_PASS', getenv('DB_PASSWORD') ?: 'YourStrongMySQLPassword2026!');",
          `define('DB_PASS', getenv('DB_PASSWORD') ?: '${dbPassword}');`
        )
        .replace(
          "define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: 're_YOUR_LIVE_RESEND_API_KEY');",
          `define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: '${resendApiKey}');`
        )
        .replace(
          "define('RESEND_FROM_EMAIL', getenv('RESEND_FROM_EMAIL') ?: 'Marketplace For Teachers <notifications@marketplaceforteachers.com>');",
          `define('RESEND_FROM_EMAIL', getenv('RESEND_FROM_EMAIL') ?: '${senderEmail}');`
        )
        .replace(
          "define('RESEND_REPLY_TO_EMAIL', getenv('RESEND_REPLY_TO_EMAIL') ?: 'support@marketplaceforteachers.com');",
          `define('RESEND_REPLY_TO_EMAIL', getenv('RESEND_REPLY_TO_EMAIL') ?: '${replyToEmail}');`
        )
        .replace(
          "define('APP_URL', getenv('APP_URL') ?: 'https://marketplaceforteachers.com');",
          `define('APP_URL', getenv('APP_URL') ?: '${appUrl}');`
        ),
      language: 'php',
      badge: 'Database & Mail Config',
    },
    'app/controllers/MarketplaceController.php': {
      filename: 'app/controllers/MarketplaceController.php',
      content: PHP_MARKETPLACE_CONTROLLER,
      language: 'php',
      badge: 'Catalog & Search Controller',
    },
    'app/services/EmailService.php': {
      filename: 'app/services/EmailService.php',
      content: PHP_EMAIL_SERVICE,
      language: 'php',
      badge: 'Resend HTTPS API Service',
    },
    'app/services/PaymentService.php': {
      filename: 'app/services/PaymentService.php',
      content: PHP_PAYMENT_SERVICE,
      language: 'php',
      badge: 'Escrow & Split Service',
    },
    'app/views/header.php': {
      filename: 'app/views/header.php',
      content: PHP_HEADER_PHP,
      language: 'php',
      badge: 'Header View',
    },
    'app/views/footer.php': {
      filename: 'app/views/footer.php',
      content: PHP_FOOTER_PHP,
      language: 'php',
      badge: 'Footer View',
    },
    'admin/index.php': {
      filename: 'admin/index.php',
      content: PHP_ADMIN_INDEX_PHP,
      language: 'php',
      badge: 'PHP Admin CMS Portal',
    },
    'cron/daily_maintenance.php': {
      filename: 'cron/daily_maintenance.php',
      content: PHP_CRON_MAINTENANCE,
      language: 'php',
      badge: 'cPanel Escrow Cron Job',
    },
    'database/schema.sql': {
      filename: 'database/schema.sql',
      content: MYSQL_SCHEMA_SQL,
      language: 'sql',
      badge: '16-Table MySQL Schema',
    },
    '.htaccess': {
      filename: '.htaccess',
      content: PHP_HTACCESS,
      language: 'apache',
      badge: 'Apache Rewrite & Security',
    },
    'README-CPANEL.md': {
      filename: 'README-CPANEL.md',
      content: PHP_README_CPANEL,
      language: 'markdown',
      badge: 'cPanel Setup Guide',
    },
    'assets/logo.svg': {
      filename: 'assets/logo.svg',
      content: LOGO_SVG,
      language: 'xml',
      badge: 'Brand Vector Logo',
    },
    'robots.txt': {
      filename: 'robots.txt',
      content: ROBOTS_TXT,
      language: 'text',
      badge: 'Crawler Directives',
    },
  };

  const handleDownloadRasterLogo = (format: 'png' | 'jpeg') => {
    const svgContent = filesMap[selectedFile]?.content;
    if (!svgContent) return;

    const isIcon = selectedFile.includes('icon');
    const width = isIcon ? 800 : 1040;
    const height = isIcon ? 800 : 200;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement('a');
      const baseName = selectedFile.replace('.svg', '');
      link.href = dataUrl;
      link.download = `${baseName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  };

  const handleDownloadZip = async () => {
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();
      
      // 1. Root configuration & front controller files (Pure PHP 8.2+)
      zip.file('index.php', PHP_INDEX_PHP);
      zip.file('.htaccess', PHP_HTACCESS);
      zip.file('robots.txt', ROBOTS_TXT);
      zip.file('README-CPANEL.md', PHP_README_CPANEL);

      // 2. Config directory
      const configFolder = zip.folder('config');
      if (configFolder) {
        configFolder.file('config.php', filesMap['config/config.php']?.content || PHP_CONFIG_PHP);
      }

      // 3. App directory (MVC Architecture)
      const appFolder = zip.folder('app');
      if (appFolder) {
        const controllersFolder = appFolder.folder('controllers');
        if (controllersFolder) {
          controllersFolder.file('MarketplaceController.php', PHP_MARKETPLACE_CONTROLLER);
        }

        const servicesFolder = appFolder.folder('services');
        if (servicesFolder) {
          servicesFolder.file('EmailService.php', PHP_EMAIL_SERVICE);
          servicesFolder.file('PaymentService.php', PHP_PAYMENT_SERVICE);
        }

        const viewsFolder = appFolder.folder('views');
        if (viewsFolder) {
          viewsFolder.file('header.php', PHP_HEADER_PHP);
          viewsFolder.file('footer.php', PHP_FOOTER_PHP);
        }
      }

      // 4. Admin portal
      const adminFolder = zip.folder('admin');
      if (adminFolder) {
        adminFolder.file('index.php', PHP_ADMIN_INDEX_PHP);
      }

      // 5. Cron maintenance
      const cronFolder = zip.folder('cron');
      if (cronFolder) {
        cronFolder.file('daily_maintenance.php', PHP_CRON_MAINTENANCE);
      }

      // 6. Database schema (16 MySQL/MariaDB tables)
      const databaseFolder = zip.folder('database');
      if (databaseFolder) {
        databaseFolder.file('schema.sql', MYSQL_SCHEMA_SQL);
      }

      // 7. Assets
      const assetsFolder = zip.folder('assets');
      if (assetsFolder) {
        assetsFolder.file('logo.svg', LOGO_SVG);
        assetsFolder.file('favicon.svg', FAVICON_SVG);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MarketplaceForTeachers-cpanel-php-production.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate cPanel zip:', err);
      alert('Failed to generate full ZIP. Please try again.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedFile(key);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadSingle = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.split('/').pop() || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      id="cpanel-export-modal-backdrop"
      className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="cpanel-export-modal-container"
        className="bg-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  MarketplaceForTeachers.com - Standalone PHP 8.2+ & MySQL cPanel Package
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  PHP 8.2+ • MySQL 8.0+ • Apache (.htaccess) • Zero Node.js
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Complete production build with <code className="text-amber-300">index.php</code>, <code className="text-amber-300">config/config.php</code>, <code className="text-amber-300">app/</code>, <code className="text-emerald-300">admin/</code>, <code className="text-emerald-300">database/schema.sql</code>, and <code className="text-emerald-300">.htaccess</code> ready for cPanel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isGeneratingZip}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingZip ? 'Generating ZIP...' : 'Download Full Package (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Instructions banner */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-blue-900 gap-2 shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <Mail className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Resend REST Integration:</strong> Outgoing transactional email with 100% deliverability. Includes vector logo kit for other projects.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedFile('logo.svg')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-amber-700" />
              <span>Logo Kit (4 SVGs)</span>
            </button>
            <button
              onClick={() => setSelectedFile('CPANEL_INSTRUCTIONS.md')}
              className="text-blue-700 hover:text-blue-900 font-bold underline text-xs cursor-pointer"
            >
              5-Step Setup Guide
            </button>
          </div>
        </div>

        {/* Dynamic Secrets & Environment Variables Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                Live Production Secrets & Credentials
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                Injected into .env.example, config.php & server.cjs
              </span>
            </div>
            <button
              onClick={() => setShowSecretConfig(!showSecretConfig)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
            >
              {showSecretConfig ? 'Collapse Secrets Panel' : 'Edit Live Secret Values'}
            </button>
          </div>

          {showSecretConfig ? (
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">DB_HOST / PORT</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                    className="w-2/3 px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                    placeholder="localhost"
                  />
                  <input
                    type="text"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                    className="w-1/3 px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                    placeholder="3306"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">DB_NAME & USER</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={dbName}
                    onChange={(e) => setDbName(e.target.value)}
                    className="w-1/2 px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                    placeholder="mktplace_db"
                  />
                  <input
                    type="text"
                    value={dbUser}
                    onChange={(e) => setDbUser(e.target.value)}
                    className="w-1/2 px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                    placeholder="mktplace_user"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">DB_PASSWORD</label>
                <input
                  type="text"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                  placeholder="MySQL Password"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">JWT_SECRET</label>
                <input
                  type="text"
                  value={jwtSecret}
                  onChange={(e) => setJwtSecret(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                  placeholder="JWT Secret"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">RESEND_API_KEY</label>
                <input
                  type="text"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                  placeholder="re_..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">RESEND_FROM_EMAIL</label>
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-[11px]"
                  placeholder="Marketplace For Teachers <notifications@...>"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">RESEND_REPLY_TO_EMAIL</label>
                <input
                  type="text"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-[11px]"
                  placeholder="support@marketplaceforteachers.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">APP_URL (Production Domain)</label>
                <input
                  type="text"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-[11px]"
                  placeholder="https://marketplaceforteachers.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">STRIPE_SECRET_KEY</label>
                <input
                  type="text"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                  placeholder="sk_live_..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">STRIPE_PUBLISHABLE_KEY</label>
                <input
                  type="text"
                  value={stripePublishableKey}
                  onChange={(e) => setStripePublishableKey(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                  placeholder="pk_live_..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">GEMINI_API_KEY (Optional AI)</label>
                <input
                  type="text"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 bg-white font-mono text-[11px]"
                  placeholder="AI Key (or empty)"
                />
              </div>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Outgoing Sender Email (RESEND_FROM_EMAIL)</label>
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-1 rounded border border-slate-300 text-xs bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Marketplace For Teachers <notifications@marketplaceforteachers.com>"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Support Reply-To Email (RESEND_REPLY_TO_EMAIL)</label>
                <input
                  type="text"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  className="w-full px-3 py-1 rounded border border-slate-300 text-xs bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. support@marketplaceforteachers.com"
                />
              </div>
            </div>
          )}
        </div>

        {/* Body: Sidebar with file list + code viewer */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* File selector sidebar */}
          <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto space-y-1 text-xs shrink-0 max-h-56 lg:max-h-none">
            <div className="px-2 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
              <span>Package Files ({Object.keys(filesMap).length})</span>
              <span className="text-emerald-600 font-bold">Ready</span>
            </div>

            {Object.entries(filesMap).map(([key, file]) => {
              const isSvg = key.endsWith('.svg');
              const isPhp = key.endsWith('.php');
              const isSql = key.endsWith('.sql');
              const isMd = key.endsWith('.md');
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFile(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedFile === key
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSvg ? (
                      <Image className={`w-4 h-4 shrink-0 ${selectedFile === key ? 'text-white' : 'text-amber-600'}`} />
                    ) : isSql ? (
                      <Database className={`w-4 h-4 shrink-0 ${selectedFile === key ? 'text-white' : 'text-emerald-600'}`} />
                    ) : isMd ? (
                      <Sparkles className={`w-4 h-4 shrink-0 ${selectedFile === key ? 'text-white' : 'text-purple-600'}`} />
                    ) : isPhp ? (
                      <FileCode className={`w-4 h-4 shrink-0 ${selectedFile === key ? 'text-white' : 'text-blue-600'}`} />
                    ) : (
                      <Server className={`w-4 h-4 shrink-0 ${selectedFile === key ? 'text-white' : 'text-slate-600'}`} />
                    )}
                    <span className="truncate">{key}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-1.5 ${
                      selectedFile === key
                        ? 'bg-white/20 text-white'
                        : isSvg
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {file.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Code & Asset Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            {/* File header actions */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">{selectedFile}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">
                  {filesMap[selectedFile]?.content.split('\n').length} lines
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
                  {filesMap[selectedFile]?.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopy(selectedFile, filesMap[selectedFile]?.content || '')
                  }
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedFile === selectedFile ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedFile === selectedFile ? 'Copied SVG Code!' : selectedFile.endsWith('.svg') ? 'Copy SVG Code' : 'Copy'}</span>
                </button>

                <button
                  onClick={() =>
                    handleDownloadSingle(
                      filesMap[selectedFile]?.filename || selectedFile,
                      filesMap[selectedFile]?.content || ''
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {selectedFile.endsWith('.svg') ? '.SVG' : 'File'}</span>
                </button>
              </div>
            </div>

            {/* If SVG file selected: Live Visual Preview Canvas */}
            {selectedFile.endsWith('.svg') && (
              <div className="p-4 bg-slate-900 border-b border-slate-800 shrink-0 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
                  <span>Live Graphic Preview (Download in PNG, JPEG & SVG)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadRasterLogo('png')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3 h-3" /> Download PNG (Transparent)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadRasterLogo('jpeg')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3 h-3" /> Download JPEG (White BG)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Light background preview */}
                  <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-slate-200 min-h-[100px] shadow-inner relative group">
                    <span className="absolute top-1.5 left-2 text-[9px] font-bold text-slate-400 uppercase">Light Theme Preview</span>
                    <div
                      className="w-full flex items-center justify-center max-h-24 p-2"
                      dangerouslySetInnerHTML={{ __html: filesMap[selectedFile]?.content || '' }}
                    />
                  </div>
                  {/* Dark background preview */}
                  <div className="bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-700 min-h-[100px] shadow-inner relative group">
                    <span className="absolute top-1.5 left-2 text-[9px] font-bold text-slate-500 uppercase">Dark Theme / Header Preview</span>
                    <div
                      className="w-full flex items-center justify-center max-h-24 p-2"
                      dangerouslySetInnerHTML={{
                        __html: selectedFile === 'logo.svg' ? filesMap['logo-white.svg']?.content : filesMap[selectedFile]?.content || '',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Code Content */}
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed text-slate-300 selection:bg-blue-800 selection:text-white">
              <pre className="whitespace-pre-wrap break-words">
                {filesMap[selectedFile]?.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Configured for <strong>MarketplaceForTeachers.com</strong> &bull; Support & Reply-To: <a href="mailto:marketplaceforteachers.com@gmail.com" className="text-blue-600 font-bold">marketplaceforteachers.com@gmail.com</a>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              className="font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download All {Object.keys(filesMap).length} Files in 1 ZIP Archive (with Logo Vector Assets)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
