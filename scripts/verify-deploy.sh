#!/usr/bin/env bash
# Verify standalone bundle before/after Hostinger deploy (static CSS/JS must match HTML).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STANDALONE=".next/standalone"
SITE_URL="${1:-${SITE_URL:-https://mistandhaven.com}}"
CHECK_LIVE="${CHECK_LIVE:-1}"

fail=0

check() {
  if [[ "$1" -ne 0 ]]; then
    fail=1
  fi
}

echo "=== Standalone bundle (local) ==="

if [[ ! -f "$STANDALONE/server.js" ]]; then
  echo "FAIL: $STANDALONE/server.js missing — run: npm run build && npm run package:deploy" >&2
  exit 1
fi

for path in public "$STANDALONE/.next/static" "$STANDALONE/.next/static/css"; do
  if [[ ! -e "$path" ]]; then
    echo "FAIL: missing $path" >&2
    fail=1
  fi
done

CSS_FILES=( "$STANDALONE"/.next/static/css/*.css )
if [[ ! -e "${CSS_FILES[0]}" ]]; then
  echo "FAIL: no CSS in $STANDALONE/.next/static/css/" >&2
  fail=1
else
  CSS_NAME="$(basename "${CSS_FILES[0]}")"
  CSS_HASH="${CSS_NAME%.css}"
  CHUNK_COUNT="$(find "$STANDALONE/.next/static/chunks" -name '*.js' 2>/dev/null | wc -l | tr -d ' ')"
  echo "OK   server.js"
  echo "OK   public/"
  echo "OK   .next/static/css/$CSS_NAME"
  echo "OK   .next/static/chunks/ ($CHUNK_COUNT JS files)"
fi

if [[ -f "$STANDALONE/.next/server/app/index.html" ]]; then
  HTML_CSS="$(grep -oE '/_next/static/css/[a-f0-9]+\.css' "$STANDALONE/.next/server/app/index.html" | head -1 || true)"
  if [[ -n "${HTML_CSS:-}" ]]; then
    HTML_HASH="$(basename "$HTML_CSS" .css)"
    if [[ "$HTML_HASH" != "$CSS_HASH" ]]; then
      echo "FAIL: HTML references $HTML_HASH.css but standalone has $CSS_HASH.css (stale/partial deploy)" >&2
      fail=1
    else
      echo "OK   prerendered HTML matches CSS hash ($CSS_HASH)"
    fi
  fi
fi

if [[ "$fail" -ne 0 ]]; then
  echo "" >&2
  echo "Fix: npm run build && npm run package:deploy" >&2
  echo "On server: unzip -o deploy-standalone.zip -d .next/standalone/" >&2
  echo "Start command must be: npm run start:standalone (NOT npm start)" >&2
  exit 1
fi

if [[ "$CHECK_LIVE" != "1" ]]; then
  echo ""
  echo "Local checks passed. Set CHECK_LIVE=1 to probe production URLs."
  exit 0
fi

echo ""
echo "=== Production ($SITE_URL) ==="

HOME_CODE="$(curl -sS -o /tmp/mist-verify-home.html -w '%{http_code}' "$SITE_URL/" || echo 000)"
if [[ "$HOME_CODE" != "200" ]]; then
  echo "WARN: homepage HTTP $HOME_CODE" >&2
  fail=1
else
  LIVE_CSS="$(grep -oE '/_next/static/css/[a-f0-9]+\.css' /tmp/mist-verify-home.html | head -1 || true)"
  if [[ -z "${LIVE_CSS:-}" ]]; then
    echo "WARN: no CSS link in homepage HTML" >&2
    fail=1
  else
    LIVE_HASH="$(basename "$LIVE_CSS" .css)"
    echo "Homepage references: $LIVE_CSS"
    if [[ "$LIVE_HASH" != "$CSS_HASH" ]]; then
      echo "WARN: production HTML hash ($LIVE_HASH) differs from local bundle ($CSS_HASH)" >&2
      echo "      Redeploy zip and purge CDN/browser cache." >&2
      fail=1
    fi
    CSS_CODE="$(curl -sSI -o /dev/null -w '%{http_code}' "$SITE_URL$LIVE_CSS" || echo 000)"
    if [[ "$CSS_CODE" == "200" ]]; then
      echo "OK   $SITE_URL$LIVE_CSS → HTTP 200"
    else
      echo "FAIL: $SITE_URL$LIVE_CSS → HTTP $CSS_CODE (unstyled site)" >&2
      fail=1
    fi
  fi
fi

SAMPLE_CHUNK="$(find "$STANDALONE/.next/static/chunks" -name 'webpack-*.js' | head -1)"
if [[ -n "$SAMPLE_CHUNK" ]]; then
  CHUNK_URL="/_next/static/chunks/$(basename "$SAMPLE_CHUNK")"
  CHUNK_CODE="$(curl -sSI -o /dev/null -w '%{http_code}' "$SITE_URL$CHUNK_URL" || echo 000)"
  if [[ "$CHUNK_CODE" == "200" ]]; then
    echo "OK   $SITE_URL$CHUNK_URL → HTTP 200"
  else
    echo "FAIL: $SITE_URL$CHUNK_URL → HTTP $CHUNK_CODE" >&2
    fail=1
  fi
fi

# CMS uploads referenced in live HTML (hero, logo, manufacturing, about)
UPLOAD_URLS="$(grep -oE 'src="/uploads/[^"]+"' /tmp/mist-verify-home.html 2>/dev/null | sed 's/src="//;s/"$//' | sort -u || true)"
if [[ -n "${UPLOAD_URLS:-}" ]]; then
  echo ""
  echo "=== CMS uploads on homepage ==="
  while IFS= read -r UPLOAD_PATH; do
    [[ -z "$UPLOAD_PATH" ]] && continue
    UPLOAD_CODE="$(curl -sSI -o /dev/null -w '%{http_code}' "$SITE_URL$UPLOAD_PATH" || echo 000)"
    if [[ "$UPLOAD_CODE" == "200" ]]; then
      echo "OK   $SITE_URL$UPLOAD_PATH → HTTP 200"
    else
      echo "FAIL: $SITE_URL$UPLOAD_PATH → HTTP $UPLOAD_CODE (file missing on server — run setup-hostinger-uploads.sh or re-upload in admin)" >&2
      fail=1
    fi
  done <<< "$UPLOAD_URLS"
fi

rm -f /tmp/mist-verify-home.html

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo ""
echo "All checks passed."
