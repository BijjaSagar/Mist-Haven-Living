#!/usr/bin/env bash
# Run on Hostinger after receiving a pre-built standalone zip (from Mac, GitHub Actions, or CI).
# Usage (from app root, e.g. ~/domains/mistandhaven.com/app):
#   bash scripts/server-deploy.sh [path/to/next-build.zip]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ZIP="${1:-${DEPLOY_ZIP:-next-build.zip}}"
STANDALONE=".next/standalone"
STANDALONE_UPLOADS="$STANDALONE/public/uploads"
LEGACY_UPLOADS="$ROOT/public/uploads"
UPLOADS_BACKUP=""

if [[ ! -f "$ZIP" ]]; then
  echo "Error: zip not found: $ZIP" >&2
  echo "Download next-build.zip from GitHub Actions (Build workflow artifact) or upload deploy-standalone.zip from your Mac." >&2
  exit 1
fi

if [[ -d "$STANDALONE_UPLOADS" ]] && [[ -n "$(ls -A "$STANDALONE_UPLOADS" 2>/dev/null || true)" ]]; then
  UPLOADS_BACKUP="$(mktemp -d)"
  cp -a "$STANDALONE_UPLOADS/." "$UPLOADS_BACKUP/"
  echo "→ Backed up $STANDALONE_UPLOADS"
elif [[ -d "$LEGACY_UPLOADS" ]] && [[ -n "$(ls -A "$LEGACY_UPLOADS" 2>/dev/null || true)" ]]; then
  UPLOADS_BACKUP="$(mktemp -d)"
  cp -a "$LEGACY_UPLOADS/." "$UPLOADS_BACKUP/"
  echo "→ Backed up legacy $LEGACY_UPLOADS (pre-standalone path)"
fi

echo "→ Extracting $ZIP into $STANDALONE/"
mkdir -p "$STANDALONE"
unzip -o "$ZIP" -d "$STANDALONE/"

if [[ -n "$UPLOADS_BACKUP" ]]; then
  mkdir -p "$STANDALONE/public/uploads"
  cp -an "$UPLOADS_BACKUP/." "$STANDALONE/public/uploads/" 2>/dev/null || cp -a "$UPLOADS_BACKUP/." "$STANDALONE/public/uploads/"
  rm -rf "$UPLOADS_BACKUP"
  echo "→ Restored public/uploads"
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
echo "→ Syncing admin uploads into standalone public/..."
bash "$ROOT/scripts/setup-hostinger-uploads.sh" || {
  echo "WARN: uploads sync skipped — run manually if /uploads/* returns 404:" >&2
  echo "  bash scripts/setup-hostinger-uploads.sh" >&2
}

echo ""
echo "→ Linking public_html/_next/static (Apache serves /_next/static from document root)..."
bash "$ROOT/scripts/setup-hostinger-static.sh" || {
  echo "WARN: public_html symlink skipped — run manually if CSS still 404s:" >&2
  echo "  bash scripts/setup-hostinger-static.sh" >&2
}

echo ""
echo "Next steps:"
echo "  1. If schema changed: npx prisma migrate deploy  (from app root with prisma/migrations/)"
echo "  2. hPanel → Websites → Node.js Web Apps → your app → Restart"
echo "  3. Start command must be: npm run start:standalone"
echo "  4. Verify: https://mistandhaven.com/_next/static/css/$(basename "$CSS")"
