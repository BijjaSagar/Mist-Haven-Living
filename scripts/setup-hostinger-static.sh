#!/usr/bin/env bash
# Symlink public_html/_next/static → standalone static so Apache/LiteSpeed serves CSS/JS.
# Hostinger often resolves /_next/static from public_html before proxying to Node — files on
# disk under app/.next/standalone/ then 404 even when HTML hash matches.
#
# Usage (from app root, e.g. ~/domains/mistandhaven.com/app):
#   bash scripts/setup-hostinger-static.sh
#   bash scripts/setup-hostinger-static.sh ~/domains/mistandhaven.com/public_html
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STANDALONE_STATIC="$ROOT/.next/standalone/.next/static"
PUBLIC_HTML="${1:-${PUBLIC_HTML:-}}"

if [[ -z "$PUBLIC_HTML" ]]; then
  # app/ and public_html/ are siblings under domains/<domain>/
  DOMAIN_DIR="$(cd "$ROOT/.." && pwd)"
  if [[ -d "$DOMAIN_DIR/public_html" ]]; then
    PUBLIC_HTML="$DOMAIN_DIR/public_html"
  elif [[ -d "$HOME/domains" ]]; then
    # Fallback: first public_html under ~/domains (single-site accounts)
    PUBLIC_HTML="$(find "$HOME/domains" -maxdepth 2 -type d -name public_html 2>/dev/null | head -1 || true)"
  fi
fi

if [[ -z "$PUBLIC_HTML" ]] || [[ ! -d "$PUBLIC_HTML" ]]; then
  echo "Error: public_html not found." >&2
  echo "Usage: bash scripts/setup-hostinger-static.sh /path/to/domains/example.com/public_html" >&2
  exit 1
fi

if [[ ! -d "$STANDALONE_STATIC/css" ]]; then
  echo "Error: $STANDALONE_STATIC/css missing — run npm run postbuild or deploy a full standalone zip first." >&2
  exit 1
fi

CSS="$(ls "$STANDALONE_STATIC/css"/*.css 2>/dev/null | head -1 || true)"
if [[ -z "$CSS" ]]; then
  echo "Error: no CSS in $STANDALONE_STATIC/css" >&2
  exit 1
fi

TARGET="$PUBLIC_HTML/_next/static"
SOURCE="$(cd "$STANDALONE_STATIC" && pwd)"

mkdir -p "$PUBLIC_HTML/_next"
if [[ -L "$TARGET" ]] || [[ -e "$TARGET" ]]; then
  rm -rf "$TARGET"
fi
ln -sfn "$SOURCE" "$TARGET"

echo "→ Symlink: $TARGET → $SOURCE"
echo "→ CSS on disk: $(basename "$CSS")"

HTACCESS="$PUBLIC_HTML/.htaccess"
if [[ -f "$HTACCESS" ]] && grep -qE '_next/static|/_next/' "$HTACCESS" 2>/dev/null; then
  echo ""
  echo "WARN: $HTACCESS contains _next rules — may block static files or the Node proxy."
  echo "      Review and remove rules that intercept /_next/static (see DEPLOYMENT.md)."
fi

echo ""
echo "Next: hPanel → Node.js Web Apps → Restart, then verify:"
echo "  curl -sSI -o /dev/null -w 'CSS HTTP %{http_code}\n' \"https://\$(hostname -f 2>/dev/null || echo mistandhaven.com)/_next/static/css/$(basename "$CSS")\""
