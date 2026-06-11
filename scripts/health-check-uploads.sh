#!/usr/bin/env bash
# Post-deploy health check: probe live /uploads/* URLs referenced in site HTML.
# Usage:
#   bash scripts/health-check-uploads.sh [SITE_URL]
#   bash scripts/health-check-uploads.sh https://mistandhaven.com
set -euo pipefail

SITE_URL="${1:-${SITE_URL:-https://mistandhaven.com}}"
fail=0

echo "=== Upload health check ($SITE_URL) ==="

check_page() {
  local path="$1"
  local label="$2"
  local html="/tmp/mist-health-${path//\//-}.html"
  local code

  code="$(curl -sS -o "$html" -w '%{http_code}' "$SITE_URL$path" || echo 000)"
  if [[ "$code" != "200" ]]; then
    echo "FAIL: $label HTTP $code ($SITE_URL$path)" >&2
    fail=1
    return
  fi

  local urls
  urls="$(grep -oE '(src|href)="/uploads/[^"?]+' "$html" 2>/dev/null | sed 's/.*="\(\/uploads\/[^"]*\)/\1/' | sort -u || true)"

  if [[ -z "${urls:-}" ]]; then
    echo "WARN: $label — no /uploads/ URLs in HTML (DB may use picsum fallback)" >&2
    return
  fi

  local count ok=0 bad=0
  count="$(echo "$urls" | grep -c . || true)"
  echo ""
  echo "--- $label ($count upload URLs) ---"

  while IFS= read -r upload_path; do
    [[ -z "$upload_path" ]] && continue
    local upload_code
    upload_code="$(curl -sSI -o /dev/null -w '%{http_code}' "$SITE_URL$upload_path" || echo 000)"
    if [[ "$upload_code" == "200" ]]; then
      ok=$((ok + 1))
      echo "OK   $upload_path → HTTP 200"
    else
      bad=$((bad + 1))
      echo "FAIL $upload_path → HTTP $upload_code" >&2
      fail=1
    fi
  done <<< "$urls"

  echo "→ $label: $ok OK, $bad failed"

  # Detect picsum placeholders on product listing
  if [[ "$path" == "/products" ]]; then
    local picsum_count
    picsum_count="$(grep -c 'picsum.photos' "$html" 2>/dev/null || true)"
    if [[ "$picsum_count" -gt 0 ]]; then
      echo "WARN: /products still references picsum ($picsum_count hits) — check DATABASE_URL + restart Node app" >&2
      fail=1
    fi
  fi

  rm -f "$html"
}

check_page "/" "Homepage"
check_page "/products" "Products listing"
check_page "/products/hand-towels" "Hand towels detail"

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "Fix checklist:" >&2
  echo "  1. hPanel → DATABASE_URL must be set on Node.js app" >&2
  echo "  2. bash scripts/setup-hostinger-uploads.sh  (symlink ../uploads-data)" >&2
  echo "  3. Re-upload images in Admin if persistent dir is empty" >&2
  echo "  4. Restart Node.js app in hPanel" >&2
  exit 1
fi

echo ""
echo "All upload health checks passed."
