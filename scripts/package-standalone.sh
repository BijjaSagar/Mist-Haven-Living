#!/usr/bin/env bash
# Package .next/standalone for Hostinger upload (includes CSS/JS in .next/static).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STANDALONE=".next/standalone"
DEPLOY_ZIP="${1:-${DEPLOY_ZIP:-deploy-standalone.zip}}"

if [[ ! -f "$STANDALONE/server.js" ]]; then
  echo "Error: $STANDALONE/server.js not found. Run: npm run build" >&2
  exit 1
fi

echo "→ Ensuring public/ and .next/static are copied into standalone (postbuild)..."
npm run postbuild

missing=0
for path in server.js public; do
  if [[ ! -e "$STANDALONE/$path" ]]; then
    echo "Error: missing $STANDALONE/$path" >&2
    missing=1
  fi
done

if [[ ! -d "$STANDALONE/.next/static" ]]; then
  echo "Error: missing $STANDALONE/.next/static (CSS/JS will 404 on production)" >&2
  missing=1
elif [[ ! -d "$STANDALONE/.next/static/css" ]] || [[ -z "$(ls -A "$STANDALONE/.next/static/css" 2>/dev/null || true)" ]]; then
  echo "Error: no CSS files in $STANDALONE/.next/static/css" >&2
  missing=1
fi

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

CSS_FILE="$(ls "$STANDALONE/.next/static/css"/*.css 2>/dev/null | head -1)"
CSS_NAME="$(basename "$CSS_FILE")"
echo "→ Verified CSS: .next/static/css/$CSS_NAME"

rm -f "$ROOT/$DEPLOY_ZIP"
(
  cd "$STANDALONE"
  zip -rq "$ROOT/$DEPLOY_ZIP" .
)

echo "→ Created $ROOT/$DEPLOY_ZIP"
echo ""
echo "Deploy on Hostinger (from app root, e.g. ~/domains/mistandhaven.com/app):"
echo "  unzip -o deploy-standalone.zip -d .next/standalone/"
echo "  # Start command: npm run start:standalone  (NOT npm start)"
echo "Verify after restart:"
echo "  https://mistandhaven.com/_next/static/css/$CSS_NAME"
