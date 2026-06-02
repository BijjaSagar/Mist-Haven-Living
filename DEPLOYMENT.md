# Hostinger Node.js Deployment

This guide covers deploying **Mist & Haven Living** on [Hostinger Business/Cloud](https://www.hostinger.com) Node.js hosting. The app uses Next.js standalone output for efficient self-hosting on a persistent Node.js server.

## Prerequisites

- Hostinger plan with **Node.js Web Apps** (Business Web Hosting or Cloud)
- A domain pointed to Hostinger (or use the temporary Hostinger subdomain)
- SSH or hPanel terminal access for one-time database setup

## 0. Hostinger folder layout (read this first)

Hostinger accounts use **one of two layouts**. The docs and older SSH sessions often assume layout **A**; many newer GitHub-connected accounts use layout **B** instead.

### Layout A — `domains/` (older / manual setup)

```
~/domains/mistandhaven.com/
├── app/              ← Node.js app root (full git repo, scripts/, package.json)
├── public_html/      ← Apache document root (serves /_next/static when symlinked)
└── nodejs/           ← sometimes a duplicate — ignore unless hPanel points here
```

**Application root in hPanel:** `~/domains/mistandhaven.com/app`

### Layout B — account root (GitHub auto-deploy, your current account)

```
~/   (your home folder, e.g. /home/u123456789)
├── nodejs/           ← GitHub deploy lands here (.next, server.js, package.json)
├── public_html/      ← Apache document root for mistandhaven.com
└── DO_NOT_UPLOAD_HERE
```

There is **no** `~/domains/mistandhaven.com/app` folder on this layout. Commands like `cd ~/domains/mistandhaven.com/app` or `bash scripts/setup-hostinger-static.sh` will fail until you either use **`~/nodejs`** (Path A below) or create an **`app/`** clone (Path B below).

**Application root in hPanel:** `~/nodejs` (not `domains/.../app`)

### Find your layout (SSH — copy/paste)

In **hPanel → Advanced → SSH Access** (or **Terminal**), run:

```bash
pwd
whoami
echo "--- home folder ---"
ls ~
echo "--- domains (may not exist) ---"
ls ~/domains 2>/dev/null || echo "No ~/domains folder"
echo "--- nodejs deploy folder ---"
ls ~/nodejs 2>/dev/null || echo "No ~/nodejs folder"
echo "--- public_html ---"
ls ~/public_html 2>/dev/null || echo "No ~/public_html folder"
```

| You see | Use this app root | CSS symlink target |
|---|---|---|
| `~/nodejs/` with `server.js` | **`~/nodejs`** | `~/public_html/_next/static` |
| `~/domains/mistandhaven.com/app/` | **`~/domains/mistandhaven.com/app`** | `~/domains/mistandhaven.com/public_html/_next/static` |

Use **one** path everywhere: hPanel Application root, SSH `cd`, zip upload, and GitHub secret `HOSTINGER_APP_PATH`.

### Recovery path A — keep `~/nodejs` (recommended if GitHub already deploys there)

1. **hPanel → Websites → Node.js Web Apps →** your app → set **Application root** to `~/nodejs`
2. Set **Build command** to `echo "pre-built"` (do not build Next.js on Hostinger)
3. Set **Start command** — run the check below first, then pick the matching line:

```bash
cd ~/nodejs
test -f .next/standalone/server.js && echo "Use: npm run start:standalone"
test -f server.js && ! test -f .next/standalone/server.js && echo "Use: node server.js"
```

4. **Fix CSS** (manual symlink — `scripts/` is not in `nodejs/` on auto-deploy):

```bash
cd ~/nodejs

# Pick the static folder that exists (try standalone first, then flat .next)
if [ -d .next/standalone/.next/static/css ]; then
  STATIC="$(pwd)/.next/standalone/.next/static"
elif [ -d .next/static/css ]; then
  STATIC="$(pwd)/.next/static"
else
  echo "ERROR: no CSS folder — upload a pre-built zip first (see section 3)"
  exit 1
fi

mkdir -p ~/public_html/_next
rm -rf ~/public_html/_next/static
ln -sfn "$STATIC" ~/public_html/_next/static
ls -la ~/public_html/_next/static/css/
```

5. **Restart** the Node.js app in hPanel, then hard-refresh https://mistandhaven.com

6. If you use GitHub auto-deploy, set secret **`HOSTINGER_APP_PATH`** to `~/nodejs` (not `~/domains/mistandhaven.com/app`).

### Recovery path B — create full `app/` repo with `scripts/`

Use this if you want the full git repo (migrations, `scripts/server-deploy.sh`, `setup-hostinger-static.sh`) on the server.

```bash
mkdir -p ~/domains/mistandhaven.com
cd ~/domains/mistandhaven.com
git clone https://github.com/BijjaSagar/Mist-Haven-Living.git app
cd ~/domains/mistandhaven.com/app
ls scripts/    # should list server-deploy.sh, setup-hostinger-static.sh
```

Then in **hPanel → Node.js Web Apps**:

| Setting | Value |
|---|---|
| **Application root** | `~/domains/mistandhaven.com/app` |
| **Build command** | `echo "pre-built"` |
| **Start command** | `npm run start:standalone` |

Upload and extract a build zip (section 3), then:

```bash
cd ~/domains/mistandhaven.com/app
bash scripts/server-deploy.sh next-build.zip
```

That script unzips into `.next/standalone/` and symlinks `public_html/_next/static` automatically.

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

## 2. Connect GitHub in Hostinger

In **hPanel → Websites → Node.js Web Apps**:

1. Create a new Node.js application (or open your existing one)
2. Click **Connect Git repository** (or **Deploy from GitHub**)
3. Authorize GitHub if prompted, then select:
   - Repository: **`BijjaSagar/Mist-Haven-Living`**
   - Branch: **`main`**
4. Set **Node.js version** to **20.x** (LTS)
5. Set **Application root** to match your layout (see **section 0**):
   - Layout B (GitHub → `~/nodejs`): **`~/nodejs`**
   - Layout A (full repo): **`~/domains/mistandhaven.com/app`**
6. Set **Build command** to:
   ```bash
   echo "pre-built"
   ```
   (Do **not** use `npm run build` on Hostinger — shared hosting cannot build Next.js.)
7. Set **Start command** to:
   ```bash
   npm run start:standalone
   ```

### Important: Git pull does not deploy the website

The GitHub repo contains **source code only** — not the built CSS, JS, or `server.js` bundle. Hostinger’s **Deploy** / **Git pull** button updates files like `package.json` and `scripts/`, but **does not** update the live site until you also install the **pre-built bundle** (see section 3 below).

Think of it this way:

| What GitHub / git pull gives you | What actually runs the site |
|---|---|
| Source code, scripts, docs | `.next/standalone/` folder (built on Mac or GitHub Actions) |

After every code change on `main`, you must redeploy the **build artifact** using **Option A** (automatic) or **Option B** (manual) below.

## 3. Redeploy from GitHub (after code changes)

Every push to `main` triggers **[GitHub Actions → Build](https://github.com/BijjaSagar/Mist-Haven-Living/actions)** which:

1. Builds the site on GitHub’s servers (not Hostinger)
2. Packages `next-build.zip` (standalone bundle with CSS/JS)
3. Optionally auto-deploys to Hostinger if you enabled SSH deploy (Option A)

### Option A — Automatic redeploy (recommended once set up)

GitHub builds and uploads the zip to your server over SSH, then runs `scripts/server-deploy.sh`.

**One-time setup (Sagar or your developer):**

1. **Generate an SSH key** on your Mac (if you don’t have one for Hostinger):
   ```bash
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/hostinger_deploy -N ""
   ```
2. **Add the public key to Hostinger:** hPanel → **Advanced → SSH Access** → add `~/.ssh/hostinger_deploy.pub`
3. **Note SSH details** from hPanel (usually):
   - Host: `srvXXX.hstgr.io` or your server IP
   - Port: **65002** (Hostinger default, not 22)
   - Username: e.g. `u123456789`
4. **Add GitHub repository secrets** — repo → **Settings → Secrets and variables → Actions → New repository secret**:

   | Secret name | Value |
   |---|---|
   | `HOSTINGER_SSH_HOST` | SSH hostname from hPanel |
   | `HOSTINGER_SSH_USER` | SSH username |
   | `HOSTINGER_SSH_KEY` | Full private key file contents (`~/.ssh/hostinger_deploy`) |
   | `HOSTINGER_SSH_PORT` | `65002` (optional if default works) |
   | `HOSTINGER_APP_PATH` | `~/nodejs` **or** `~/domains/mistandhaven.com/app` — must match hPanel Application root (see section 0) |

5. **Enable auto-deploy** — same page → **Variables** tab → **New repository variable**:
   - Name: `HOSTINGER_AUTO_DEPLOY`
   - Value: `true`

**Going forward:** push to `main` → GitHub Actions builds → deploy job uploads zip → server extracts → **Restart** the Node.js app in hPanel if the site doesn’t update within a minute.

### Option B — Manual redeploy from server (no SSH secrets)

Use this if you prefer not to store SSH keys in GitHub.

1. Push your changes to `main` on GitHub (or ask your developer to)
2. Open **GitHub → Actions → Build** → click the latest green run
3. Scroll to **Artifacts** → download **`next-build`** (a zip file)
4. Upload the zip to the server app root, e.g. with File Manager or:
   ```bash
   scp -P 65002 next-build.zip u123456789@srvXXX.hstgr.io:~/domains/mistandhaven.com/app/
   ```
5. **SSH into Hostinger** (hPanel → Terminal, or your SSH client):
   ```bash
   cd ~/domains/mistandhaven.com/app
   git pull origin main          # updates scripts/server-deploy.sh if needed
   bash scripts/server-deploy.sh next-build.zip
   ```
6. **hPanel → Node.js Web Apps → your app → Restart**
7. Optional: **Websites → Performance / CDN → Clear cache**, then hard-refresh the browser

### Option C — Build on your Mac (same as before)

```bash
cd Mist-website
npm install
npm run build
npm run package:deploy    # creates deploy-standalone.zip
scp -P 65002 deploy-standalone.zip user@host:~/domains/mistandhaven.com/app/
```

On the server:
```bash
cd ~/domains/mistandhaven.com/app
bash scripts/server-deploy.sh deploy-standalone.zip
```

Then restart the Node.js app in hPanel.

## 4. Environment variables

Set these in the Hostinger Node.js app panel **Environment variables**, or in a `.env` file in the app root (never commit secrets to Git):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection string (see above) |
| `ADMIN_EMAIL` | Yes | Admin CMS login email |
| `ADMIN_PASSWORD` | Yes | Admin CMS login password |
| `RESEND_API_KEY` | Yes | Resend API key for inquiry emails (server-only; not stored in CMS) |
| `LEADS_TO_EMAIL` | No* | Fallback leads inbox if not set in **Admin → Settings** |
| `RESEND_FROM_EMAIL` | No | Fallback Resend sender if not set in **Admin → Settings** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No* | Fallback WhatsApp if not set in **Admin → Settings** |
| `NEXT_PUBLIC_CALENDLY_URL` | No* | Fallback Calendly URL if not set in **Admin → Settings** |

\* Prefer **Admin → Settings** for leads inbox, WhatsApp, Calendly, and public contact email. After deploy, run `npx prisma migrate deploy`, then open `/admin/settings` and set **Leads inbox email** (or ensure public contact email is set) plus enable inquiries.
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

## 5. Build and start commands

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
npm run verify:deploy  # optional: checks local bundle + live mistandhaven.com URLs

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

### Hostinger SSH: `npm: command not found`

Interactive SSH often has a **minimal `PATH`** — `npm` and `node` are not on it even though the Node.js Web App panel runs them. That is normal; you do not need `npm` to deploy a pre-built zip.

**Use Node/npm when you must** (migrations, seed, on-server build):

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
which node npm   # should print paths under /opt/alt/alt-nodejs20/...
node -v
```

Try Node 22 if your hPanel app uses 22.x: `/opt/alt/alt-nodejs22/root/usr/bin`.

**Start the app without npm** (same as `npm run start:standalone`):

```bash
cd ~/domains/mistandhaven.com/app
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
export PORT="${PORT:-3000}"   # hPanel usually sets PORT for the managed app
node .next/standalone/server.js
```

For production, prefer hPanel **Start command** `npm run start:standalone` (panel injects PATH) — use direct `node` only for one-off debugging.

**Manual verify on SSH (no npm)** — from app root after unzip:

```bash
cd ~/domains/mistandhaven.com/app

# Bundle on disk (use find — ls | wc -l only counts top-level names, ~18–20 is OK)
ls -la .next/standalone/.next/static/css/
find .next/standalone/.next/static/chunks -name '*.js' | wc -l   # expect ~63 for current build
test -f .next/standalone/server.js && echo OK server.js

CSS=$(basename .next/standalone/.next/static/css/*.css)
HASH="${CSS%.css}"
echo "CSS file: $CSS"

# Live site (curl is enough; no npm)
curl -sS -o /tmp/mh-home.html -w 'homepage HTTP %{http_code}\n' https://mistandhaven.com/
grep -oE '/_next/static/css/[a-f0-9]+\.css' /tmp/mh-home.html | head -1
curl -sSI -o /dev/null -w "CSS HTTP %{http_code}\n" "https://mistandhaven.com/_next/static/css/$CSS"
curl -sSI -o /dev/null -w "webpack HTTP %{http_code}\n" "https://mistandhaven.com/_next/static/chunks/webpack-51534d4e830d01a3.js"
```

If homepage HTML references a **different** CSS hash than `ls` shows on disk, redeploy the zip, restart the Node app, purge CDN cache, and hard-refresh the browser.

**If HTML hash matches disk but CSS still returns 404** (your current case — routing, not build):

Hostinger’s web server often serves `/_next/static/*` from **`public_html/_next/static/`** before the Node proxy. Files under `app/.next/standalone/.next/static/` are ignored → HTTP 404 even though `ls` shows the CSS and HTML references the same hash.

**Fix now (SSH, from app root):**

```bash
cd ~/domains/mistandhaven.com/app
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"

# Confirm files exist (hash should match live HTML)
CSS=$(basename .next/standalone/.next/static/css/*.css)
echo "Disk CSS: $CSS"
curl -sS https://mistandhaven.com/ | grep -oE '/_next/static/css/[a-f0-9]+\.css' | head -1

# Symlink document root → standalone static (required on many Hostinger plans)
mkdir -p ../public_html/_next
rm -rf ../public_html/_next/static
ln -sfn "$(pwd)/.next/standalone/.next/static" ../public_html/_next/static
ls -la ../public_html/_next/static/css/

# Or use the repo script (after git pull):
bash scripts/setup-hostinger-static.sh

# Restart Node app in hPanel, then verify
curl -sSI -o /dev/null -w "CSS HTTP %{http_code}\n" "https://mistandhaven.com/_next/static/css/$CSS"
```

Also confirm hPanel **Application root** is `~/domains/mistandhaven.com/app` (not `nodejs/`), **Start command** is `npm run start:standalone`, and restart after every server-side `npm run build:hostinger`.

Check for a bad **`public_html/.htaccess`** rule that intercepts `/_next/` (see **public_html and .htaccess** below).

**Does `build:hostinger` change the CSS hash?** Yes — every full rebuild produces new content hashes. If live HTML and `ls .next/standalone/.next/static/css/` show the **same** filename (e.g. `00c4429d59a52a14.css`) but curl returns 404, the problem is **routing** (public_html / Apache), not a stale hash.

**Re-unzip a fresh bundle:**

```bash
cd ~/domains/mistandhaven.com/app
mkdir -p .next/standalone
unzip -o deploy-standalone.zip -d .next/standalone/
find .next/standalone/.next/static/chunks -name '*.js' | wc -l
```

**hPanel restart after deploy:** **Websites → Node.js Web Apps →** your app → confirm **Application root** is `~/domains/mistandhaven.com/app` → **Build command** `echo "pre-built"` → **Start command** `npm run start:standalone` → **Restart** (or Stop then Start). Optional: **Websites →** your site → **Performance / CDN → Clear cache**.

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
npm run build:hostinger   # runs build + postbuild (copies public/ and .next/static into standalone)
```

If you previously ran `build:hostinger` from an older package.json (before postbuild was wired), fix the live site without rebuilding:

```bash
npm run postbuild
```

Then restart the Node.js app in hPanel.

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

## 6. Database migrations (one-time setup)

Run once against the production database via **SSH** or the **Hostinger terminal** in hPanel.

**Every SSH session:** Hostinger’s shell has a minimal `PATH` — prefix commands with:

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
```

**`DATABASE_URL` in SSH:** hPanel env vars apply to the Node.js app process, **not** your SSH shell. Copy `DATABASE_URL` from **hPanel → Node.js Web Apps → Environment variables** and either `export DATABASE_URL='...'` or put it in a `.env` file in the folder where you run Prisma.

### Full repo app root (layout A `app/` or recovery path B)

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
cd ~/domains/mistandhaven.com/app   # or wherever the full git clone lives
export DATABASE_URL='mysql://USER:PASS@HOST:3306/DATABASE'   # paste from hPanel
npx prisma migrate deploy
npx prisma db seed   # first-time only — skip if DB already seeded
```

- `migrate deploy` applies all pending migrations
- `db seed` imports product categories, navigation, stats, and default content

Re-run `migrate deploy` after pulling schema changes. Re-seed only on a fresh database (seeding may duplicate data if run again).

### GitHub auto-deploy only (`nodejs/` — no `prisma/migrations/`)

GitHub deploy to **`~/nodejs`** or **`~/domains/mistandhaven.com/nodejs`** usually contains only `.next/`, `server.js`, `package.json`, and `node_modules` — **not** `prisma/migrations/`. Admin save then fails with:

> Database schema is out of date. Run: npx prisma migrate deploy

The running app folder stays as-is; use a **separate full clone** (or manual SQL) only to apply migrations.

#### Step 0 — find your deploy folder

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"
ls ~/nodejs 2>/dev/null && echo "→ layout B: ~/nodejs"
ls ~/domains/mistandhaven.com/nodejs 2>/dev/null && echo "→ domains/nodejs"
```

#### Option A — clone full repo, migrate (recommended)

One-time. Does **not** replace your GitHub deploy folder.

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"

mkdir -p ~/domains/mistandhaven.com
cd ~/domains/mistandhaven.com
git clone https://github.com/BijjaSagar/Mist-Haven-Living.git app
cd app

# Paste DATABASE_URL from hPanel (same value the Node app uses)
export DATABASE_URL='mysql://USER:PASS@HOST:3306/DATABASE'

npm install
npx prisma migrate deploy
npx prisma migrate status   # should show "Database schema is up to date"
```

Keep this `app/` folder for future `npx prisma migrate deploy` after schema changes. Do **not** point hPanel Application root here unless you intentionally switch to a full-repo deploy.

#### Option B — migrate from `nodejs/` (only if migrations exist there)

```bash
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"

# Use whichever folder hPanel uses as Application root:
cd ~/domains/mistandhaven.com/nodejs   # or: cd ~/nodejs

ls prisma/migrations || { echo "NO prisma/migrations — use Option A"; exit 1; }
ls node_modules/.bin/prisma || { echo "NO prisma CLI — use Option A"; exit 1; }

export DATABASE_URL='mysql://USER:PASS@HOST:3306/DATABASE'
npx prisma migrate deploy
npx prisma migrate status
```

If either check fails, use **Option A**.

#### Option C — manual SQL (phpMyAdmin or mysql CLI)

When Prisma cannot run. Latest pending migration (`20260601120000_inquiry_settings`) adds inquiry settings columns:

```sql
ALTER TABLE `SiteSettings`
  ADD COLUMN `leadsToEmail` VARCHAR(191) NULL,
  ADD COLUMN `resendFromEmail` VARCHAR(191) NULL,
  ADD COLUMN `inquiryEnabled` BOOLEAN NOT NULL DEFAULT true;
```

**hPanel → Databases → phpMyAdmin** → select your database → **SQL** tab → paste → **Go**.

If a column already exists, MySQL errors on that column — skip duplicates or run columns one at a time.

Optional (keeps Prisma migration history in sync — run from Option A clone after manual SQL):

```bash
npx prisma migrate resolve --applied 20260601120000_inquiry_settings
```

#### After migrate — restart app and retry admin

1. **hPanel → Websites → Node.js Web Apps →** your app → **Restart**
2. Open **https://mistandhaven.com/admin/settings**
3. Set **Leads inbox email**, **Resend from email**, enable inquiries → **Save**

You should no longer see the schema-out-of-date error.

## 7. File uploads

Admin uploads use `POST /api/admin/upload` (admin session required). Files live on disk under **`public/uploads/`** (referenced in the DB as `/uploads/...` after you click **Save** on the product or page).

| Admin area | What to upload | On-disk path |
|------------|----------------|--------------|
| **Settings → Branding** | Logo, favicon | `public/uploads/` |
| **Products → [category]** | Hero, card, gallery images | `public/uploads/products/{slug}/` |
| **Pages → private-label** | Specification PDF | `public/uploads/pdfs/private-label/` |
| **Pages → home** | Hero & heritage images | `public/uploads/` (or custom folder) |

**Persistence:** On Hostinger's Node.js app, `public/uploads/` (including nested `products/` and `pdfs/` folders) **survives app restarts**. Uploads are **not** inside `next-build.zip`. `scripts/server-deploy.sh` backs up and restores `.next/standalone/public/uploads/` when redeploying — keep that directory on the server; do not delete it during deploys.

Ensure uploads are writable:

```bash
mkdir -p public/uploads/products public/uploads/pdfs/private-label
chmod -R 755 public/uploads
```

After schema changes that add `galleryImages`, run `npx prisma migrate deploy` on the server.

Default logos in `/public/logo.png` work without any uploads.

## 8. Domain and SSL

1. In hPanel, attach your domain to the Node.js app
2. Hostinger provides free SSL via Let's Encrypt — enable it under **SSL**
3. Point your domain's DNS A record to Hostinger's server IP if not already configured

## 9. PM2 (optional, via SSH)

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

**Do not** run the app from an old `nodejs/` folder with a partial copy; use one app root path consistently (see **Dual app folders** below).

`app/layout.tsx` imports `./globals.css` correctly — styling breaks only when static assets are not deployed or the wrong start command is used. No `assetPrefix` is needed for the root domain `mistandhaven.com`.

### CSS 404 but file exists on disk (HTML hash matches)

**Symptoms:** `ls .next/standalone/.next/static/css/` shows e.g. `00c4429d59a52a14.css`, live homepage HTML references the **same** `/_next/static/css/00c4429d59a52a14.css`, but `curl` returns **HTTP 404**. Chunk JS may 404 too. Site is unstyled.

**Cause:** **Routing**, not a missing postbuild or hash mismatch. Hostinger’s Apache/LiteSpeed serves `/_next/static/*` from **`public_html/_next/static/`** instead of proxying to Node. Your files live under `app/.next/standalone/.next/static/` only.

**Fix (SSH — run exactly this from app root):**

```bash
cd ~/domains/mistandhaven.com/app
export PATH="/opt/alt/alt-nodejs20/root/usr/bin:$PATH"

CSS=$(basename .next/standalone/.next/static/css/*.css)

mkdir -p ../public_html/_next
rm -rf ../public_html/_next/static
ln -sfn "$(pwd)/.next/standalone/.next/static" ../public_html/_next/static

# Optional: repo script (same as above)
# bash scripts/setup-hostinger-static.sh

# hPanel → Node.js Web Apps → Restart (required after build/deploy)
curl -sSI -o /dev/null -w "CSS HTTP %{http_code}\n" "https://mistandhaven.com/_next/static/css/$CSS"
```

Expect **HTTP 200**. If still 404, check `public_html/.htaccess` for conflicting `_next` rules and confirm hPanel application root is `app/` not `nodejs/`.

After every deploy or server-side `npm run build:hostinger`, re-run the symlink (or `bash scripts/server-deploy.sh`, which runs it automatically) and **restart** the Node app.

### Hash mismatch (HTML asks for old CSS/JS, server has new files)

**Symptoms:** Browser Network tab shows 404 for `/_next/static/css/09sm9j6sx77q4.css` (or similar short hash) while `ls .next/standalone/.next/static/css/` on the server shows a different file such as `00c4429d59a52a14.css`.

**Cause:** HTML and static files came from **different builds** or **different deploy paths**:

1. Partial redeploy — only `server.js` / `node_modules` updated, not `.next/static`
2. Stale **browser or Hostinger CDN (hcdn)** cache serving old HTML after a new deploy
3. Old build used Turbopack (default `next build` without `--webpack`) — different chunk/CSS naming than the webpack build this repo uses
4. Two copies of the app (`~/domains/mistandhaven.com/app/` vs `~/domains/mistandhaven.com/nodejs/`) — hPanel start command points at one folder while the zip was uploaded to the other

**Fix:**

```bash
# Mac — fresh bundle
npm run build
npm run package:deploy
npm run verify:deploy   # confirms local HTML hash matches .next/static

# Upload and extract on server (app root ONLY)
scp deploy-standalone.zip user@host:~/domains/mistandhaven.com/app/
ssh user@host
cd ~/domains/mistandhaven.com/app
mkdir -p .next/standalone
unzip -o deploy-standalone.zip -d .next/standalone/

# Confirm files on disk
ls -la .next/standalone/.next/static/css/
find .next/standalone/.next/static/chunks -name '*.js' | wc -l   # ~63 JS files (ls | wc -l ≈18 top-level only)

# hPanel → Websites → Node.js Web Apps → your app:
#   Application root: ~/domains/mistandhaven.com/app  (NOT nodejs/)
#   Build command: echo "pre-built"
#   Start command: npm run start:standalone
# Restart the app, then hard-refresh browser (Cmd+Shift+R) or test in a private window
```

Verify in browser (replace `HASH` with `ls` output):

```
https://mistandhaven.com/_next/static/css/HASH.css   → must be HTTP 200
```

If HTML still references an old hash after redeploy, purge Hostinger cache: **hPanel → Websites → your site → Performance / CDN → Clear cache** (wording varies by plan).

### Dual app folders / wrong layout on Hostinger

Hostinger may use **layout A** (`domains/.../app/`) or **layout B** (`~/nodejs/` only). See **section 0**.

Common duplicates on layout A:

- `~/domains/mistandhaven.com/app/` — Node.js app root (use this on layout A)
- `~/domains/mistandhaven.com/nodejs/` — legacy or duplicate folder

On layout B, **`~/nodejs/`** is the only deploy folder — there is no `app/` until you create it (recovery path B).

Use **one** path everywhere: hPanel application root, SSH `cd`, zip upload, and `HOSTINGER_APP_PATH`. If the start command runs from `app/` but you uploaded the zip to `nodejs/.next/standalone/`, the running process will not see your static files (and CSS will 404).

Remove or ignore the unused folder after confirming which path hPanel uses.

### public_html and .htaccess

For Node.js Web Apps, Hostinger proxies most requests to your Node process, but **`/_next/static/*` is often resolved from `public_html/_next/static/` first**. If that folder is missing or stale, you get **404 even when files exist under `app/.next/standalone/.next/static/`**.

**Required after every build/deploy** (replace `APP_ROOT` with `~/nodejs` or `~/domains/mistandhaven.com/app`):

```bash
# Layout B (~/nodejs) — manual symlink (no scripts/ folder on auto-deploy):
cd ~/nodejs
STATIC="$(pwd)/.next/standalone/.next/static"
test -d "$STATIC/css" || STATIC="$(pwd)/.next/static"
mkdir -p ~/public_html/_next && rm -rf ~/public_html/_next/static
ln -sfn "$STATIC" ~/public_html/_next/static

# Layout A (app/) — with repo scripts:
cd ~/domains/mistandhaven.com/app
bash scripts/setup-hostinger-static.sh
# Or manually:
# ln -sfn "$(pwd)/.next/standalone/.next/static" ../public_html/_next/static
```

`scripts/server-deploy.sh` runs this symlink step automatically after unzip.

If you previously hosted a static site or WordPress under `public_html`, check for an `.htaccess` that intercepts `/_next/*` or serves stale files. Either remove conflicting rules or ensure the domain is attached to the **Node.js app**, not an old document root.

Example of a **problematic** rule (do not add this for Next.js standalone):

```apache
RewriteRule ^_next/static - [L]
```

The Node app must serve `/_next/static/*` itself from `.next/standalone/.next/static/`.

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
