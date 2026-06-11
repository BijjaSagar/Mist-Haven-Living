#!/usr/bin/env bash
# Run on Hostinger after receiving a pre-built standalone zip (from Mac, GitHub Actions, or CI).
# Usage (from app root, e.g. ~/domains/mistandhaven.com/nodejs):
#   bash scripts/server-deploy.sh [path/to/next-build.zip]
#
# CMS uploads live in ../uploads-data (OUTSIDE deploy dir) — this script never deletes that folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ZIP="${1:-${DEPLOY_ZIP:-next-build.zip}}"

# Flat layout: server.js + public/ at app root (Hostinger ~/domains/.../nodejs).
# Nested layout: .next/standalone/server.js (full git clone at ~/domains/.../app).
if [[ -f "$ROOT/server.js" ]] && [[ -d "$ROOT/public" || -d "$ROOT/.next" ]]; then
  STANDALONE="$ROOT"
  echo "→ Flat standalone layout: $STANDALONE"
else
  STANDALONE="$ROOT/.next/standalone"
  echo "→ Nested standalone layout: $STANDALONE"
fi

DOMAIN_DIR="$(cd "$ROOT/.." && pwd)"
PERSISTENT="${PERSISTENT_UPLOADS_PATH:-${UPLOADS_DIR:-$DOMAIN_DIR/uploads-data}}"
mkdir -p "$PERSISTENT"
echo "→ Persistent uploads (never wiped): $PERSISTENT"

# Merge any existing deploy-dir uploads into persistent storage BEFORE unzip overwrites them.
if [[ -f "$ROOT/scripts/setup-hostinger-uploads.sh" ]]; then
  echo "→ Pre-deploy: merge legacy uploads into persistent storage"
  bash "$ROOT/scripts/setup-hostinger-uploads.sh" || true
fi

echo "→ Extracting $ZIP into $STANDALONE/"
mkdir -p "$STANDALONE"
unzip -o "$ZIP" -d "$STANDALONE/"

# Deploy zip includes public/uploads/.gitkeep — replace with symlink to persistent dir.
if [[ -f "$STANDALONE/public/uploads/.gitkeep" ]] || [[ -d "$STANDALONE/public/uploads" ]]; then
  if [[ -L "$STANDALONE/public/uploads" ]]; then
    echo "→ public/uploads already symlinked"
  else
    echo "→ Removing deploy-dir public/uploads (zip placeholder) — will symlink to persistent"
    rm -rf "$STANDALONE/public/uploads"
  fi
fi

if [[ ! -f "$STANDALONE/server.js" ]]; then
  echo "Error: $STANDALONE/server.js missing after unzip" >&2
  exit 1
fi

CSS="$(ls "$STANDALONE/.next/static/css"/*.css 2>/dev/null | head -1 || true)"
if [[ -z "$CSS" ]]; then
  echo "Error: no CSS in $STANDALONE/.next/static/css — bundle is incomplete" >&2
  exit 1
fi

CHUNKS="$(find "$STANDALONE/.next/static/chunks" -name '*.js' 2>/dev/null | wc -l | tr -d ' ')"
echo "→ OK server.js"
echo "→ OK CSS: $(basename "$CSS")"
echo "→ OK chunks: $CHUNKS JS files"

echo ""
echo "→ Linking persistent uploads + public_html symlinks..."
bash "$ROOT/scripts/setup-hostinger-uploads.sh" || {
  echo "WARN: uploads setup skipped — run manually:" >&2
  echo "  bash scripts/setup-hostinger-uploads.sh" >&2
}

UPLOAD_FILES="$(find "$PERSISTENT" -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "→ OK persistent uploads: $UPLOAD_FILES files in $PERSISTENT"

echo ""
echo "→ Linking public_html/_next/static (Apache serves /_next/static from document root)..."
bash "$ROOT/scripts/setup-hostinger-static.sh" || {
  echo "WARN: public_html symlink skipped — run manually if CSS still 404s:" >&2
  echo "  bash scripts/setup-hostinger-static.sh" >&2
}

echo ""
echo "Next steps:"
echo "  1. hPanel → Node.js Web Apps → Environment: confirm DATABASE_URL is set (required for product cards)"
echo "  2. If schema changed: npx prisma migrate deploy  (from app root with prisma/migrations/)"
echo "  3. hPanel → Node.js Web Apps → your app → Restart"
echo "  4. Verify CSS: https://mistandhaven.com/_next/static/css/$(basename "$CSS")"
echo "  5. Verify uploads: bash scripts/health-check-uploads.sh https://mistandhaven.com"
echo "  6. Product cards load from DB at runtime — hard-refresh /products after restart"
