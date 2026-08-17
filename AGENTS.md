# PERMANENT GOOGLE AI STUDIO PROJECT RULES
# MARKETPLACEFORTEACHERS.COM

## SINGLE SOURCE OF TRUTH
- You are working on the EXISTING MarketplaceForTeachers.com application.
- The files currently in this AI Studio project are the SINGLE SOURCE OF TRUTH.
- NEVER create a separate replacement application when asked to build, fix, export, compile, package, or deploy the project.
- Every future change must be made to THIS EXISTING PROJECT.

## 1. NEVER CREATE A SECOND PROJECT
DO NOT:
- create a new project
- create a simplified project
- create a demo project
- create a different frontend
- create a different backend
- rebuild the application from scratch
- replace working functionality
- create a separate "export version"
- generate a fake deployment package

When asked to modify the website, modify the CURRENT PROJECT. The current project is always the source of truth.

## 2. HOSTING ENVIRONMENT
- The production hosting is: **cPanel Shared Hosting**
- The cPanel account SUPPORTS NODE.JS.
- The application stack:
  - Frontend: React 19, TypeScript, Vite, Tailwind CSS
  - Backend: Node.js, Express 4
  - Database: MySQL 8.0+ / MariaDB 10.6+
- DO NOT convert the project to PHP.
- DO NOT replace Node.js with PHP.
- DO NOT use the AI Studio development server as the production server.

## 3. PRODUCTION APPLICATION
The production application must contain:
- Frontend: React/Vite production build (`dist/`)
- Backend: Node.js/Express production server (`dist/server.cjs` / `server.ts` compiled via esbuild)
- Database: MySQL/MariaDB (`src/services/db.ts` / pool)
- The Node.js server must:
  - start in production
  - use the `PORT` supplied by cPanel (`process.env.PORT || 3000`)
  - serve the compiled React application
  - serve the Express API
  - connect to MySQL
  - support React SPA routes
  - work with the production domain (`marketplaceforteachers.com`)
- Production must NOT depend on localhost, 127.0.0.1, AI Studio preview, Vite development server, or development watchers.

## 4. ADMIN DEPLOYMENT CENTER
- Maintain a dedicated **ADMIN → DEPLOYMENT CENTER** inside the existing Admin CMS.
- The Deployment Center manages the REAL CURRENT PROJECT deployment:
  - Application Name: MarketplaceForTeachers.com
  - Domain: marketplaceforteachers.com
  - Application Version: 2.4.0
  - Build Version: v2026.08-prod-release
  - Build Date: (Live date/timestamp)
  - Node.js Version: Node.js 20.x / 22.x LTS
  - Production Status: Active / Ready for cPanel
  - Database Status: MySQL 8.0+ / MariaDB 10.6+ Compatible
  - Last Build: (Timestamp)
  - Last Deployment Package: MarketplaceForTeachers-cpanel-node-production.zip
- Buttons:
  - "BUILD PRODUCTION VERSION"
  - "DOWNLOAD NODE.JS DEPLOYMENT PACKAGE"

## 5. DEPLOYMENT PACKAGE
- When clicking "DOWNLOAD NODE.JS DEPLOYMENT PACKAGE", the system packages the ACTUAL CURRENT PROJECT.
- Never create a mock, generic, or simplified template.
- Use the exact code and build outputs from this AI Studio project.

## 6. DEPLOYMENT PACKAGE STRUCTURE
```
MarketplaceForTeachers-cpanel-node-production/
    package.json
    .env.example
    dist/
        server.cjs
        index.html
        assets/
    database/
        schema.sql
    public/
        robots.txt
        sitemap.xml
        logo.svg
        favicon.svg
    README-CPANEL.md
    deployment-manifest.json
```

## 7. NODE.JS STARTUP FILE
- Real production startup file: `dist/server.cjs` (or `server.cjs`).
- The `package.json` "start" command MUST point to `node dist/server.cjs` (or `node server.cjs`).

## 8. FRONTEND & BACKEND BUILD
- Build command: `npm run build` runs `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
- Produces clean frontend SPA in `dist/` and standalone CommonJS server in `dist/server.cjs`.

## 9. DATABASE & SECURITY
- Production database configuration uses environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
- Never place database passwords or secrets in Git, frontend JS, or public files.
- Provide `.env.example` in packages, never the real `.env`.

## 10. ENVIRONMENT VARIABLES
Required variables:
- `NODE_ENV=production`
- `PORT=3000`
- `APP_URL=https://marketplaceforteachers.com`
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_NAME=mktplace_teachers_db`
- `DB_USER=mktplace_dbuser`
- `DB_PASSWORD=YourStrongMySQLPassword2026!`
- `JWT_SECRET=mft_super_jwt_secret_9905_okc_2026`
- `RESEND_API_KEY=re_YOUR_LIVE_RESEND_API_KEY`
- `RESEND_FROM_EMAIL=Marketplace For Teachers <notifications@marketplaceforteachers.com>`
- `RESEND_REPLY_TO_EMAIL=support@marketplaceforteachers.com`
- `GEMINI_API_KEY=your_gemini_api_key_here`
- `STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY`
