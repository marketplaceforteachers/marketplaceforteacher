# MarketplaceForTeachers.com - Production cPanel Node.js Deployment Manual
# Business: MarketplaceForTeachers
# Headquarters: 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159
# Production Domain: https://marketplaceforteachers.com

---

## 📋 System Requirements
- **cPanel Shared Hosting with "Setup Node.js App" (Phusion Passenger / CloudLinux)**
- **Node.js Version**: `20.x` or `22.x` (LTS Recommended)
- **Database**: MySQL 8.0+ or MariaDB 10.5+ (Managed via cPanel MySQL & phpMyAdmin)
- **Email Service**: Resend API (Server-Side Proxy)
- **AI Listing Service**: Google Gemini API (`gemini-3.6-flash`)
- **Payment Processing**: Stripe / Stripe Connect Marketplace

---

## 🛠️ Step-by-Step Production Deployment Guide

### STEP 1: Create the MySQL Database in cPanel
1. Log into your **cPanel Dashboard**.
2. Under **Databases**, click **MySQL® Databases**.
3. Create a new database name: (e.g. `mktplace_teachers_db`).
4. Under **MySQL Users**, create a new user: (e.g. `mktplace_dbuser`) with a strong password.
5. Under **Add User to Database**, select the user and database, click **Add**, and check **ALL PRIVILEGES**.

---

### STEP 2: Import the Database Schema
1. In cPanel, click **phpMyAdmin**.
2. Select your database (`mktplace_teachers_db`) from the left sidebar.
3. Click the **Import** tab at the top.
4. Choose the `schema.sql` file included in this package and click **Go**.
5. *Verification:* Verify that the `users`, `categories`, `products`, `orders`, and `disputes` tables are populated.

---

### STEP 3: Configure "Setup Node.js App" in cPanel
1. In cPanel, navigate to the **Software** section and click **Setup Node.js App**.
2. Click the blue **Create Application** button.
3. Fill in the application parameters:
   - **Node.js version**: Select `20.x` (or `22.x`).
   - **Application mode**: `Production`.
   - **Application root**: `public_html` (or `mft-app` if deploying in a subdirectory).
   - **Application URL**: `marketplaceforteachers.com`.
   - **Application startup file**: `dist/server.cjs`.
4. Click **Create** (this generates the base environment and `.htaccess` rewrite rules).

---

### STEP 4: Upload and Extract Deployment Files
1. In cPanel, open **File Manager**.
2. Navigate to your Application Root (e.g., `public_html`).
3. Upload `MarketplaceForTeachers-cpanel-node-production.zip`.
4. Right-click the uploaded ZIP and select **Extract**.
5. Ensure that `dist/`, `package.json`, `schema.sql`, and `README-CPANEL.md` are in your application directory.

---

### STEP 5: Configure Environment Variables in cPanel
In the **Setup Node.js App** management screen for your application, scroll to **Environment variables** and add:

| Variable Name | Description | Example / Production Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Ingress port | `3000` |
| `APP_URL` | Canonical Marketplace URL | `https://marketplaceforteachers.com` |
| `DB_HOST` | MySQL Server Host | `localhost` |
| `DB_PORT` | MySQL Port | `3306` |
| `DB_NAME` | cPanel Database Name | `mktplace_teachers_db` |
| `DB_USER` | cPanel Database User | `mktplace_dbuser` |
| `DB_PASSWORD` | cPanel Database Password | `YourStrongMySQLPassword2026!` |
| `JWT_SECRET` | Auth Token Secret | `mft_super_jwt_secret_9905_okc_2026` |
| `RESEND_API_KEY` | Resend API Key | `re_YOUR_RESEND_API_KEY` |
| `RESEND_FROM_EMAIL` | Transactional Sender | `Marketplace For Teachers <notifications@marketplaceforteachers.com>` |
| `RESEND_REPLY_TO_EMAIL` | Customer Support Reply | `support@marketplaceforteachers.com` |
| `GEMINI_API_KEY` | Google Gemini AI Key | `YOUR_GEMINI_API_KEY` |
| `STRIPE_SECRET_KEY` | Stripe Backend Key | `sk_live_YOUR_STRIPE_SECRET_KEY` |
| `STRIPE_PUBLISHABLE_KEY`| Stripe Client Key | `pk_live_YOUR_STRIPE_PUBLISHABLE_KEY` |

Click **Save** after entering variables.

---

### STEP 6: Install Production Dependencies & Start
1. In the **Setup Node.js App** screen, click **Run NPM Install** (or run `npm install --omit=dev` via cPanel Terminal).
2. Click the **Restart** button at the top of the Node.js application screen.

---

### STEP 7: Health Verification & Testing
1. Visit `https://marketplaceforteachers.com/api/health` in your browser. It should return:
   ```json
   {
     "status": "ok",
     "service": "MarketplaceForTeachers Production Engine",
     "environment": "production",
     "database": { "connected": true, "message": "MySQL/MariaDB connection pool active and healthy." }
   }
   ```
2. Visit `https://marketplaceforteachers.com/` to confirm the React SPA renders with full styling and Lucide icons.
3. Test SPA direct routing by visiting `https://marketplaceforteachers.com/marketplace` or `https://marketplaceforteachers.com/admin-login`.
4. Log into the Administrator Portal:
   - **Email:** `admin@marketplaceforteachers.com`
   - **Master Password:** `TeacherAdmin2025!`
   - **2FA Passcode:** `748291`
