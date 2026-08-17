# MarketplaceForTeachers.com - Production Deployment Guide
# Domain: https://marketplaceforteachers.com
# Business: MarketplaceForTeachers (Oklahoma City, OK 73159)

## 📦 What Was Built and Generated
1. **Frontend Distribution**: Compiled static production assets inside `/dist` (`index.html`, minified CSS/JS, Lucide icon assets).
2. **Backend Server Bundle**: Self-contained Node.js Express server inside `/dist/server.cjs` (compiled with esbuild).
3. **Database Schema**: Full production schema ready to import in phpMyAdmin located in `schema.sql`.
4. **Environment Template**: Complete `.env.example` mapping all required database, email, payment, and AI configuration keys.

---

## 🚀 How to Deploy on cPanel (Using "Setup Node.js App")

### Step 1: Create Database & User in cPanel
1. Log in to your cPanel dashboard.
2. Go to **Databases** ➔ **MySQL® Databases**.
3. Create a new database: e.g. `mktplace_teachers_db`.
4. Create a new database user: e.g. `mktplace_dbuser` with a strong password.
5. Under **Add User to Database**, select your user and database, click **Add**, and grant **ALL PRIVILEGES**.
6. Go back to cPanel ➔ **phpMyAdmin**, click your database, go to the **Import** tab, and upload `schema.sql` (or copy/paste its SQL statements).

---

### Step 2: Set Up Node.js Application in cPanel
1. In cPanel, click **Setup Node.js App** (CloudLinux / Phusion Passenger).
2. Click **Create Application**.
3. Configure the settings:
   - **Node.js version**: Choose `20.x` or `22.x`.
   - **Application mode**: `Production`.
   - **Application root**: `public_html` (or `mft-app` if you want it in a subfolder).
   - **Application URL**: `marketplaceforteachers.com`.
   - **Application startup file**: `dist/server.cjs` (or `server.ts` if using tsx).
4. Click **Create**.

---

### Step 3: Add Environment Variables in cPanel
In the **Setup Node.js App** interface, scroll to **Environment variables** and add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `3000` | Ingress port |
| `APP_URL` | `https://marketplaceforteachers.com` | Production URL |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `mktplace_teachers_db` | Your cPanel database name |
| `DB_USER` | `mktplace_dbuser` | Your cPanel database user |
| `DB_PASSWORD` | `YourStrongMySQLPassword2026!` | Your MySQL user password |
| `JWT_SECRET` | `mft_prod_secret_key_9905_okc_2026` | Token encryption secret |
| `RESEND_API_KEY` | `re_YOUR_LIVE_RESEND_API_KEY` | Resend API key |
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | Google Gemini AI key |
| `STRIPE_SECRET_KEY` | `sk_live_YOUR_STRIPE_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY`| `pk_live_YOUR_STRIPE_KEY` | Stripe publishable key |

---

### Step 4: Upload Code & Install Packages
1. In cPanel **File Manager**, upload all project files (including `package.json`, `dist/`, `server.ts`, and `.env.example`).
2. Go back to **Setup Node.js App** and click **Run NPM Install**.
3. Click **Restart Application**.

---

### Step 5: Verify Deployment
- Open `https://marketplaceforteachers.com` in your browser.
- Check backend health status at `https://marketplaceforteachers.com/api/health`.
- Test logging in as administrator at `/admin-login` with `admin@marketplaceforteachers.com` / `TeacherAdmin2025!` (2FA: `748291`).
