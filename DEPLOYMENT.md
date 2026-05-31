# Hostinger Node.js Deployment

This guide covers deploying **Mist & Haven Living** on [Hostinger Business/Cloud](https://www.hostinger.com) Node.js hosting. The app uses Next.js standalone output for efficient self-hosting on a persistent Node.js server.

## Prerequisites

- Hostinger plan with **Node.js Web Apps** (Business Web Hosting or Cloud)
- A domain pointed to Hostinger (or use the temporary Hostinger subdomain)
- SSH or hPanel terminal access for one-time database setup

## 1. Create MySQL database

In **hPanel → Databases → MySQL Databases**:

1. Create a new database (e.g. `u123456789_mist_haven`)
2. Create a database user and assign it to the database
3. Note the connection details — the host is **often not `localhost`**. Common values:
   - `mysql.hostinger.com`
   - `srvXXX.hstgr.io` (shown in hPanel)

Build your connection string:

```
mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME
```

Example:

```
DATABASE_URL="mysql://u123456789_admin:SecretPass@srv123.hstgr.io:3306/u123456789_mist_haven"
```

## 2. Connect the repository

In **hPanel → Websites → Node.js Web Apps**:

1. Create a new Node.js application
2. Connect your GitHub repo: `https://github.com/BijjaSagar/Mist-Haven-Living.git`
3. Set the branch (usually `main`)
4. Set **Node.js version** to 20.x or 22.x (LTS)

## 3. Environment variables

Set these in the Hostinger Node.js app panel **Environment variables**, or in a `.env` file in the app root (never commit secrets to Git):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection string (see above) |
| `ADMIN_EMAIL` | Yes | Admin CMS login email |
| `ADMIN_PASSWORD` | Yes | Admin CMS login password |
| `RESEND_API_KEY` | Yes | Resend API key for inquiry emails |
| `LEADS_TO_EMAIL` | Yes | Destination inbox for B2B leads |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | WhatsApp number with country code |
| `NEXT_PUBLIC_CALENDLY_URL` | Yes | Calendly scheduling URL |
| `PORT` | Optional | Hostinger may set this automatically; defaults to `3000` |
| `ADMIN_SECRET` | Recommended | JWT signing secret (falls back to `ADMIN_PASSWORD`; required in production if `ADMIN_PASSWORD` is unset) |

Copy from `.env.example` as a starting point.

### Admin login (CMS)

After the first deploy, create the database admin user:

```bash
npm run db:seed
```

**Default credentials** (when `ADMIN_EMAIL` / `ADMIN_PASSWORD` are not set in env at seed time):

| Field | Value |
|---|---|
| Email | `admin@mistandhaven.com` |
| Password | `changeme123` |

Change the password immediately after first login (Admin → Users), or set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in hPanel **before** running seed so the hashed password in MySQL matches your env vars.

**How login works:**

1. **Database user** — email/password checked against the `AdminUser` table (bcrypt).
2. **Env recovery** — if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are both set in the server environment, matching credentials also work when the DB password is out of sync (e.g. env updated after seed).
3. **Env-only bootstrap** — if there are zero rows in `AdminUser`, login uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults: `admin@example.com` / `admin` in development only).

Session cookie: `mist_admin_session` (httpOnly, `SameSite=Lax`, `Secure` on HTTPS production).

## 4. Build and start commands

Configure in the Hostinger Node.js app panel:

| Setting | Value |
|---|---|
| **Build command** | `npm run build:hostinger` |
| **Start command** | `npm start` |

### What the build does

```bash
npm run build
# → prisma generate && next build
# → postbuild copies public/ and .next/static into .next/standalone/
```

### Start options

**Option A — standard (recommended for Hostinger panel):**

```bash
npm start
# → next start -p ${PORT:-3000}
```

**Option B — standalone server (after build):**

```bash
npm run start:standalone
# → node .next/standalone/server.js
```

The `postbuild` script automatically copies static assets into the standalone folder. If you deploy manually via SSH, you can also run:

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
node .next/standalone/server.js
```

## 5. Database migrations (one-time setup)

Run once against the production database via **SSH** or the **Hostinger terminal** in hPanel:

```bash
cd /path/to/your/app
npx prisma migrate deploy
npx prisma db seed
```

- `migrate deploy` applies all pending migrations
- `db seed` imports product categories, navigation, stats, and default content

Re-run `migrate deploy` after pulling schema changes. Re-seed only on a fresh database (seeding may duplicate data if run again).

## 6. File uploads

Logo uploads from the admin CMS are stored in `public/uploads/`. On Hostinger's persistent Node.js server, these files **persist across restarts** — unlike Vercel serverless where the filesystem is ephemeral.

Ensure the `public/uploads` directory is writable by the Node.js process. Create it if missing:

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

Default logos in `/public/logo.png` work without any uploads.

## 7. Domain and SSL

1. In hPanel, attach your domain to the Node.js app
2. Hostinger provides free SSL via Let's Encrypt — enable it under **SSL**
3. Point your domain's DNS A record to Hostinger's server IP if not already configured

## 8. PM2 (optional, via SSH)

If you have SSH access and prefer process management over the Hostinger panel:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

The included `ecosystem.config.js` runs `next start -p 3000`. Adjust `PORT` in the config if Hostinger assigns a different port.

## Troubleshooting

### Build fails with EAGAIN on SSH

If `npm run build` fails near the end with:

```
uncaughtException Error: spawn .../node EAGAIN
spawnargs: [.../jest-worker/processChild.js]
```

Hostinger shared hosting hit its **process/thread limit** (CloudLinux LVE). Next.js spawns many worker processes during the build; the fix is to limit parallelism.

**Recommended — use the Hostinger build script:**

```bash
cd ~/domains/mistandhaven.com/app
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
npm run build:hostinger
```

This sets `NODE_OPTIONS='--max-old-space-size=512'`, disables telemetry, and runs `prisma generate && next build`.

**hPanel build command:** set the Node.js app **Build command** to:

```bash
npm run build:hostinger
```

**Config fix (already in repo):** `next.config.ts` sets `experimental.cpus: 1` and `workerThreads: false` so Next.js uses a single build worker instead of spawning many child processes.

**Alternatives if SSH build still fails:**

1. **Build in hPanel** — trigger a redeploy from **Websites → Node.js Web Apps**; the panel may have slightly higher limits than an interactive SSH session.
2. **Build locally and upload** — on your Mac run `npm run build`, then upload `.next/standalone/` (and ensure `public/` and `.next/static` are copied per the `postbuild` script).

| Issue | Fix |
|---|---|
| Build fails on Prisma | Ensure `postinstall` runs (`prisma generate`) — Hostinger runs `npm install` before build |
| Database connection refused | Verify `DATABASE_URL` host is the hPanel MySQL host, not `localhost` |
| Images or CSS missing | Re-run build; `postbuild` copies `public/` and `.next/static` into standalone |
| Admin login fails | Run `npm run db:seed`; use seeded email/password or set matching `ADMIN_EMAIL` / `ADMIN_PASSWORD`; ensure `ADMIN_SECRET` or `ADMIN_PASSWORD` is set for JWT; cookie requires HTTPS in production |
| Admin login shows "Login failed" (500) | Cookie or DB error — see **Admin login troubleshooting** below |
| Uploads fail | Ensure `public/uploads` exists and is writable |

### Admin login troubleshooting

If login returns **"Login failed"** (HTTP 500), the server hit an unexpected error — often cookie handling on Hostinger or a database connection issue. After deploying the latest code, wrong credentials should return **"Invalid email or password"** (401) instead.

**Reset or create the admin user** (SSH into Hostinger, from the app root):

```bash
cd ~/domains/mistandhaven.com/app
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
ADMIN_EMAIL=your-admin@example.com ADMIN_PASSWORD='YourPassword' npm run admin:reset
```

Replace `YourPassword` with the desired password. This upserts the admin in MySQL with a bcrypt hash — use the same values in hPanel **Environment variables** for `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

**Default seed credentials** (when `ADMIN_EMAIL` / `ADMIN_PASSWORD` are not set during seed):

- Email: `admin@mistandhaven.com`
- Password: `changeme123`

**First-time database setup:**

```bash
npx prisma migrate deploy
npx prisma db seed
```

**Verify env vars** in hPanel include `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_SECRET` (JWT signing; defaults to `ADMIN_PASSWORD`).

## Alternative: Vercel

This project can also deploy to Vercel, but requires an external MySQL provider (PlanetScale, Railway, Aiven, etc.) since Vercel serverless has no bundled database and ephemeral filesystem. See [README.md](./README.md) for notes.
