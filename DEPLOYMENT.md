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

### Recommended: build locally or via GitHub Actions

Hostinger **shared** hosting often **cannot** run `next build` at all — even with `next build --webpack` and throttled settings. CloudLinux LVE limits process/thread spawns and you may see:

```
thread panicked: The global thread pool has not been initialized: Resource temporarily unavailable (EAGAIN)
Next.js build worker exited with code: null and signal: SIGABRT
```

**Do not rely on building on the server.** Build elsewhere, upload the output, then only run `npm start` (or `start:standalone`) on Hostinger.

#### Option A: Build on your Mac (fastest today)

```bash
cd Mist-website
npm install
npm run build          # runs postbuild (copies public + .next/static into standalone)
npm run package:deploy # creates deploy-standalone.zip with verified CSS/JS

# Upload zip to server (adjust user@host and path):
scp deploy-standalone.zip user@host:~/domains/mistandhaven.com/app/
```

On the server (SSH or hPanel terminal), from the **app root** (where `package.json` lives):

```bash
cd ~/domains/mistandhaven.com/app
mkdir -p .next/standalone
unzip -o deploy-standalone.zip -d .next/standalone/
```

Set **Start command** in hPanel to `npm run start:standalone` (see **Start commands** below). Skip the Hostinger **Build command** (or set it to `echo "pre-built"`).

**Alternative — rsync instead of zip:**

```bash
rsync -avz .next/standalone/ user@host:~/domains/mistandhaven.com/app/.next/standalone/
# Only if postbuild already ran locally — standalone must contain .next/static/css/*.css
```

Do **not** upload only `server.js` and `node_modules` without `.next/static` — that causes an unstyled site (see troubleshooting).

#### Option B: Download artifact from GitHub Actions

Every push to `main` runs [.github/workflows/build.yml](./.github/workflows/build.yml), which runs `npm run package:deploy` (postbuild + CSS verification) and uploads **`next-build.zip`**.

1. Open the repo on GitHub → **Actions** → latest **Build** workflow run
2. Download the **`next-build`** artifact
3. On the server, from the app root:

```bash
cd ~/domains/mistandhaven.com/app
mkdir -p .next/standalone
unzip -o next-build.zip -d .next/standalone/
```

Ensure `.env` exists on the server. The zip already includes production `node_modules` inside standalone — you do **not** need a separate `npm ci` for the app to serve pages. Start with `npm run start:standalone`.

#### Option C: Try `build:hostinger` on the server (may still fail)

Only for plans where SSH build sometimes works. Uses single-thread env vars and webpack:

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
npm run build:hostinger
```

If you still get `EAGAIN` / `SIGABRT`, use Option A or B.

---

Configure in the Hostinger Node.js app panel when you **must** build on Hostinger:

| Setting | Value |
|---|---|
| **Build command** | `npm run build:hostinger` (prefer Option A/B instead) |
| **Start command** | `npm run start:standalone` (required for pre-built standalone uploads) |

### What the build does

```bash
npm run build
# → prisma generate && next build --webpack
# → postbuild: mkdir .next/standalone/.next, copy public/ and .next/static/

npm run package:deploy
# → re-runs postbuild, verifies .next/static/css/*.css, creates deploy-standalone.zip
```

**Why `--webpack`?** Next.js 16 uses Turbopack by default for `next build`. On Hostinger shared hosting, Turbopack can panic with `EAGAIN` / "global thread pool has not been initialized" because shared plans enforce strict process and thread limits (CloudLinux LVE). The `--webpack` flag forces the classic webpack bundler. `next.config.ts` sets `experimental.cpus: 1`, `workerThreads: false`, `webpackBuildWorker: false`, and `webpack.parallelism: 1` to minimize child processes.

### Start commands (important)

| Command | When to use | Needs on server |
|---|---|---|
| `npm run start:standalone` | **Pre-built deploy** (Mac build, GitHub zip, rsync standalone) | `.next/standalone/` with `server.js`, `public/`, `.next/static/` |
| `npm start` | Full build **on the same machine** as start | Full `.next/` at **app root** (not standalone-only upload) |

**For mistandhaven.com (uploaded standalone bundle):** use **`npm run start:standalone`** only.

Running `npm start` (`next start`) after uploading only `.next/standalone/` will serve HTML **without** CSS/JS, because `next start` looks for `.next/static` at the app root, not inside standalone.

`start:standalone` runs from the app root:

```bash
node .next/standalone/server.js
```

Hostinger sets `PORT` automatically; the script respects `${PORT:-3000}` via the Node.js app panel.

Manual copy (if postbuild was skipped):

```bash
mkdir -p .next/standalone/.next
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
npm run start:standalone
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

The included `ecosystem.config.js` runs `.next/standalone/server.js` (same as `npm run start:standalone`). Adjust `PORT` if Hostinger assigns a different port.

## Troubleshooting

### CSS broken / unstyled site (hero only, plain white page)

**Symptoms:** Full-bleed images or raw HTML links; no header, fonts, or Tailwind layout. Browser Network tab shows **404** for `/_next/static/css/...` or `/_next/static/chunks/...`.

**Cause:** The standalone folder on the server is missing `.next/static` (and sometimes `public/`). Common mistakes:

1. Uploaded only part of `.next/standalone/` (e.g. `server.js` + `node_modules`, no static)
2. Ran **`npm start`** instead of **`npm run start:standalone`** after a standalone-only upload
3. Build on Mac without **postbuild** / **package:deploy** before upload
4. Unzipped deploy artifact to the wrong directory (must be **app root** → `.next/standalone/`)

**Fix:**

1. On your Mac, from the repo:

```bash
npm run build
npm run package:deploy
```

2. Upload `deploy-standalone.zip` to the server app root and extract:

```bash
cd ~/domains/mistandhaven.com/app
mkdir -p .next/standalone
unzip -o deploy-standalone.zip -d .next/standalone/
```

3. In hPanel → Node.js app → set **Start command** to:

```bash
npm run start:standalone
```

4. Restart the Node.js app.

**Verify (should return HTTP 200, not 404):**

```bash
# On server — list CSS file:
ls .next/standalone/.next/static/css/

# In browser (replace HASH with your file name from ls):
https://mistandhaven.com/_next/static/css/HASH.css
```

**Do not** run the app from an old `nodejs/` folder with a partial copy; use one app root path consistently.

`app/layout.tsx` imports `./globals.css` correctly — styling breaks only when static assets are not deployed or the wrong start command is used. No `assetPrefix` is needed for the root domain `mistandhaven.com`.

### Build fails with EAGAIN on SSH

If `npm run build` fails with Turbopack errors such as:

```
thread panicked: The global thread pool has not been initialized: Resource temporarily unavailable (EAGAIN)
TurbopackInternalError: Failed to write app endpoint ...
```

or webpack worker errors:

```
uncaughtException Error: spawn .../node EAGAIN
spawnargs: [.../jest-worker/processChild.js]
```

Hostinger shared hosting hit its **process/thread limit** (CloudLinux LVE). Next.js 16 defaults to Turbopack for production builds, which spawns many threads; the repo forces **webpack** via `--webpack` in the build scripts and limits parallelism in `next.config.ts`.

**Recommended — use the Hostinger build script:**

```bash
cd ~/domains/mistandhaven.com/app
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
npm run build:hostinger
```

This sets `NODE_OPTIONS='--max-old-space-size=512'`, disables telemetry, and runs `prisma generate && next build --webpack` (webpack avoids Turbopack thread-pool panics on shared hosting).

**hPanel build command:** set the Node.js app **Build command** to:

```bash
npm run build:hostinger
```

**Config fix (already in repo):** `next.config.ts` throttles builds (`cpus: 1`, `workerThreads: false`, `webpackBuildWorker: false`, `webpack.parallelism: 1`). `build:hostinger` sets `RAYON_NUM_THREADS=1`, `UV_THREADPOOL_SIZE=1`, and a 768MB heap cap.

**If SSH build still fails (common on shared plans):** use **Option A** (Mac build + rsync) or **Option B** (GitHub Actions `next-build` artifact) in section 4 above — do not keep retrying on-server builds.

| Issue | Fix |
|---|---|
| Build fails on Prisma | Ensure `postinstall` runs (`prisma generate`) — Hostinger runs `npm install` before build |
| Database connection refused | Verify `DATABASE_URL` host is the hPanel MySQL host, not `localhost` |
| Images or CSS missing | Run `npm run package:deploy`, upload zip, unzip to `.next/standalone/`, use `npm run start:standalone`; verify `/_next/static/css/` returns 200 |
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
