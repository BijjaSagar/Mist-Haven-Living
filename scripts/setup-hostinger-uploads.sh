#!/usr/bin/env bash
# Ensure admin uploads exist where the standalone server serves them from.
# Before this fix, uploads were written to public/uploads/ at app root while
# start:standalone serves files from .next/standalone/public/uploads/.
#
# Usage (from app root, e.g. ~/nodejs or ~/domains/mistandhaven.com/app):
#   bash scripts/setup-hostinger-uploads.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Flat layout (server.js at app root) or nested (.next/standalone/public).
if [[ -f "$ROOT/server.js" ]] && [[ -d "$ROOT/public" ]]; then
  STANDALONE_PUBLIC="$ROOT/public"
  echo "→ setup-hostinger-uploads: flat layout public/"
else
  STANDALONE_PUBLIC="$ROOT/.next/standalone/public"
fi

LEGACY_UPLOADS="$ROOT/public/uploads"
TARGET="$STANDALONE_PUBLIC/uploads"

if [[ ! -d "$STANDALONE_PUBLIC" ]]; then
  echo "WARN: $STANDALONE_PUBLIC missing — deploy standalone bundle first." >&2
  exit 0
fi

mkdir -p "$TARGET"

if [[ -d "$LEGACY_UPLOADS" ]] && [[ -n "$(ls -A "$LEGACY_UPLOADS" 2>/dev/null || true)" ]]; then
  echo "→ Merging legacy public/uploads → .next/standalone/public/uploads"
  cp -an "$LEGACY_UPLOADS/." "$TARGET/" 2>/dev/null || cp -a "$LEGACY_UPLOADS/." "$TARGET/"
fi

FILE_COUNT="$(find "$TARGET" -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "→ Uploads dir: $TARGET ($FILE_COUNT files)"

# Hostinger layout B (~/nodejs): symlink public_html/uploads so Apache can serve CMS files
# when the document root is checked before the Node proxy (same pattern as _next/static).
PUBLIC_HTML="${PUBLIC_HTML:-}"
if [[ -z "$PUBLIC_HTML" ]]; then
  DOMAIN_DIR="$(cd "$ROOT/.." && pwd)"
  if [[ -d "$DOMAIN_DIR/public_html" ]]; then
    PUBLIC_HTML="$DOMAIN_DIR/public_html"
  elif [[ -d "$HOME/public_html" ]]; then
    PUBLIC_HTML="$HOME/public_html"
  elif [[ -d "$HOME/domains" ]]; then
    PUBLIC_HTML="$(find "$HOME/domains" -maxdepth 2 -type d -name public_html 2>/dev/null | head -1 || true)"
  fi
fi

if [[ -n "$PUBLIC_HTML" ]] && [[ -d "$PUBLIC_HTML" ]]; then
  UPLOADS_LINK="$PUBLIC_HTML/uploads"
  SOURCE="$(cd "$TARGET" && pwd)"
  mkdir -p "$PUBLIC_HTML"
  if [[ -L "$UPLOADS_LINK" ]] || [[ -e "$UPLOADS_LINK" ]]; then
    rm -rf "$UPLOADS_LINK"
  fi
  ln -sfn "$SOURCE" "$UPLOADS_LINK"
  echo "→ Symlink: $UPLOADS_LINK → $SOURCE"
else
  echo "WARN: public_html not found — skip uploads symlink (Node still serves /uploads/* if files exist on disk)" >&2
fi

if [[ "$FILE_COUNT" -eq 0 ]]; then
  echo ""
  echo "WARN: No upload files on disk. CMS images in the database will 404 until you:" >&2
  echo "  1. Re-upload in Admin → Pages / Settings and click Save, or" >&2
  echo "  2. Restore a backup into $TARGET" >&2
fi
