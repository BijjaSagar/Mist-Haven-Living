#!/usr/bin/env bash
# Run on Hostinger after receiving a pre-built standalone zip (from Mac, GitHub Actions, or CI).
# Usage (from app root, e.g. ~/domains/mistandhaven.com/nodejs):
#   bash scripts/server-deploy.sh [path/to/next-build.zip]
#
# CMS uploads live in ../uploads-data (OUTSIDE deploy dir) — this script never deletes that folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# shellcheck source=scripts/lib/hostinger-paths.sh
source "$ROOT/scripts/lib/hostinger-paths.sh"

ZIP="${1:-${DEPLOY_ZIP:-next-build.zip}}"

STANDALONE="$(hostinger_standalone_dir "$ROOT")"
if [[ "$STANDALONE" == "$ROOT" ]]; then
  echo "→ Flat standalone layout: $STANDALONE"
else
  echo "→ Nested standalone layout: $STANDALONE"
fi

DOMAIN_DIR="$(hostinger_domain_dir "$ROOT")"
PERSISTENT="$(hostinger_persistent_uploads "$ROOT")"
mkdir -p "$PERSISTENT"
echo "→ Persistent uploads (never wiped): $PERSISTENT"

UPLOADS_BEFORE="$(hostinger_count_upload_files "$PERSISTENT")"
echo "→ Pre-deploy persistent upload files: $UPLOADS_BEFORE"

# Merge any existing deploy-dir uploads into persistent storage BEFORE unzip overwrites them.
if [[ -f "$ROOT/scripts/setup-hostinger-uploads.sh" ]]; then
  echo "→ Pre-deploy: merge legacy uploads into persistent storage"
  bash "$ROOT/scripts/setup-hostinger-uploads.sh" || true
  UPLOADS_BEFORE="$(hostinger_count_upload_files "$PERSISTENT")"
  echo "→ After pre-merge persistent upload files: $UPLOADS_BEFORE"
else
  echo "WARN: scripts/setup-hostinger-uploads.sh missing — uploads may be lost on unzip" >&2
fi

if [[ ! -f "$ZIP" ]]; then
  echo "Error: deploy zip not found: $ZIP" >&2
  exit 1
fi

echo "→ Extracting $ZIP into $STANDALONE/"
mkdir -p "$STANDALONE"
unzip -o "$ZIP" -d "$STANDALONE/"

# Deploy zip includes public/uploads/.gitkeep — replace with symlink to persistent dir.
UPLOADS_PUBLIC="$STANDALONE/public/uploads"
if [[ -f "$UPLOADS_PUBLIC/.gitkeep" ]] || [[ -d "$UPLOADS_PUBLIC" ]]; then
  if [[ -L "$UPLOADS_PUBLIC" ]]; then
    echo "→ public/uploads already symlinked"
  else
    echo "→ Removing deploy-dir public/uploads (zip placeholder) — will symlink to persistent"
    rm -rf "$UPLOADS_PUBLIC"
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
if [[ -f "$ROOT/scripts/setup-hostinger-uploads.sh" ]]; then
  bash "$ROOT/scripts/setup-hostinger-uploads.sh" || {
    echo "ERROR: uploads setup failed — CMS images may 404 until fixed" >&2
    echo "  bash scripts/setup-hostinger-uploads.sh" >&2
    exit 1
  }
else
  echo "ERROR: scripts/setup-hostinger-uploads.sh missing — cannot symlink persistent uploads" >&2
  echo "  Upload scripts with the deploy zip or git pull the full repo first." >&2
  exit 1
fi

UPLOAD_FILES="$(hostinger_count_upload_files "$PERSISTENT")"
echo "→ OK persistent uploads: $UPLOAD_FILES files in $PERSISTENT"

if [[ "$UPLOAD_FILES" -lt "$UPLOADS_BEFORE" ]]; then
  echo "ERROR: Persistent upload count dropped ($UPLOADS_BEFORE → $UPLOAD_FILES)." >&2
  echo "  Deploy aborted safety check — investigate $PERSISTENT before restarting Node." >&2
  exit 1
fi

if [[ "$UPLOAD_FILES" -eq 0 ]]; then
  echo ""
  echo "WARN: Persistent uploads dir is empty after deploy." >&2
  echo "  DB may still reference /uploads/... paths — re-upload in Admin or restore backup to:" >&2
  echo "  $PERSISTENT" >&2
fi

# Verify public/uploads points at persistent storage (not a real directory inside deploy dir).
if [[ -L "$UPLOADS_PUBLIC" ]]; then
  link_target="$(readlink -f "$UPLOADS_PUBLIC" 2>/dev/null || readlink "$UPLOADS_PUBLIC" || true)"
  if [[ "$link_target" != "$PERSISTENT" ]]; then
    echo "ERROR: public/uploads symlink points to $link_target, expected $PERSISTENT" >&2
    exit 1
  fi
  echo "→ OK public/uploads → $PERSISTENT"
elif [[ -d "$UPLOADS_PUBLIC" ]]; then
  echo "ERROR: public/uploads is still a real directory inside the deploy folder — next deploy will wipe uploads" >&2
  exit 1
fi

echo ""
echo "→ Linking public_html/_next/static (Apache serves /_next/static from document root)..."
if [[ -f "$ROOT/scripts/setup-hostinger-static.sh" ]]; then
  bash "$ROOT/scripts/setup-hostinger-static.sh" || {
    echo "WARN: public_html symlink skipped — run manually if CSS still 404s:" >&2
    echo "  bash scripts/setup-hostinger-static.sh" >&2
  }
else
  echo "WARN: scripts/setup-hostinger-static.sh missing" >&2
fi

echo ""
echo "Next steps:"
echo "  1. hPanel → Node.js Web Apps → Environment: confirm DATABASE_URL + PERSISTENT_UPLOADS_PATH"
echo "     PERSISTENT_UPLOADS_PATH=$PERSISTENT"
echo "  2. If schema changed: npx prisma migrate deploy  (from app root with prisma/migrations/)"
echo "  3. hPanel → Node.js Web Apps → your app → Restart"
echo "  4. Verify CSS: https://mistandhaven.com/_next/static/css/$(basename "$CSS")"
echo "  5. Verify uploads: bash scripts/health-check-uploads.sh https://mistandhaven.com"
echo "  6. Product cards load from DB at runtime — hard-refresh /products after restart"
