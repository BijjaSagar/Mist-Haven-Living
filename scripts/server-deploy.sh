#!/usr/bin/env bash
# Run on Hostinger after receiving a pre-built standalone zip (from Mac, GitHub Actions, or CI).
# Usage (from app root, e.g. ~/domains/mistandhaven.com/nodejs):
#   bash scripts/server-deploy.sh [path/to/next-build.zip]
#
# Uploads under public/uploads/ are NEVER wiped — backed up before unzip and restored after.
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

STANDALONE_UPLOADS="$STANDALONE/public/uploads"
LEGACY_UPLOADS="$ROOT/public/uploads"
UPLOADS_BACKUP=""

collect_uploads_backup() {
  local candidates=(
    "$STANDALONE_UPLOADS"
    "$LEGACY_UPLOADS"
    "$ROOT/nodejs/public/uploads"
  )
  local dir backup="" count=0

  for dir in "${candidates[@]}"; do
    [[ -d "$dir" ]] || continue
    [[ -n "$(ls -A "$dir" 2>/dev/null || true)" ]] || continue
    if [[ -z "$backup" ]]; then
      backup="$(mktemp -d)"
      UPLOADS_BACKUP="$backup"
    fi
    echo "→ Merging uploads from $dir into backup"
    cp -an "$dir/." "$backup/" 2>/dev/null || cp -a "$dir/." "$backup/"
    count=$((count + 1))
  done

  if [[ -n "$backup" ]]; then
    local files
    files="$(find "$backup" -type f 2>/dev/null | wc -l | tr -d ' ')"
    echo "→ Backed up uploads from $count location(s) ($files files)"
  fi
}

collect_uploads_backup

echo "→ Extracting $ZIP into $STANDALONE/"
mkdir -p "$STANDALONE"
unzip -o "$ZIP" -d "$STANDALONE/"

if [[ -n "$UPLOADS_BACKUP" ]]; then
  mkdir -p "$STANDALONE/public/uploads"
  cp -an "$UPLOADS_BACKUP/." "$STANDALONE/public/uploads/" 2>/dev/null || \
    cp -a "$UPLOADS_BACKUP/." "$STANDALONE/public/uploads/"
  rm -rf "$UPLOADS_BACKUP"
  echo "→ Restored public/uploads → $STANDALONE/public/uploads"
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
UPLOAD_FILES="$(find "$STANDALONE/public/uploads" -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "→ OK server.js"
echo "→ OK CSS: $(basename "$CSS")"
echo "→ OK chunks: $CHUNKS JS files"
echo "→ OK uploads: $UPLOAD_FILES files in $STANDALONE/public/uploads"

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
echo "  3. Start command must be: node server.js  (flat) or npm run start:standalone  (nested)"
echo "  4. Verify: https://mistandhaven.com/_next/static/css/$(basename "$CSS")"
echo "  5. Verify uploads: find $STANDALONE/public/uploads -type f | head"
