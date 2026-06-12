#!/usr/bin/env bash
# Post-deploy health check: probe live /uploads/* URLs referenced in site HTML.
# Usage:
#   bash scripts/health-check-uploads.sh [SITE_URL]
#   bash scripts/health-check-uploads.sh https://mistandhaven.com
#   bash scripts/health-check-uploads.sh --local-disk   # server-side only (no HTTP)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=scripts/lib/hostinger-paths.sh
source "$ROOT/scripts/lib/hostinger-paths.sh"

SITE_URL="${SITE_URL:-https://mistandhaven.com}"
LOCAL_DISK_ONLY=0
if [[ "${1:-}" == "--local-disk" ]]; then
  LOCAL_DISK_ONLY=1
  shift
fi
SITE_URL="${1:-$SITE_URL}"
fail=0

PERSISTENT="$(hostinger_persistent_uploads "$ROOT")"
DISK_COUNT="$(hostinger_count_upload_files "$PERSISTENT")"
UPLOADS_LINK="$(hostinger_public_dir "$ROOT")/uploads"

echo "=== Upload health check ==="
echo "→ App root: $ROOT"
echo "→ Persistent dir: $PERSISTENT ($DISK_COUNT files)"
if [[ -L "$UPLOADS_LINK" ]]; then
  echo "→ public/uploads symlink: $(readlink -f "$UPLOADS_LINK" 2>/dev/null || readlink "$UPLOADS_LINK")"
elif [[ -d "$UPLOADS_LINK" ]]; then
  echo "FAIL: public/uploads is a real directory inside deploy dir — will be wiped on next deploy" >&2
  fail=1
else
  echo "WARN: public/uploads missing — Node route handler may still serve files if persistent dir has data" >&2
fi

if [[ "$DISK_COUNT" -eq 0 ]]; then
  echo "WARN: No files in persistent uploads dir — CMS images will 404 until re-uploaded" >&2
  fail=1
fi

if [[ "$LOCAL_DISK_ONLY" -eq 1 ]]; then
  if [[ "$fail" -ne 0 ]]; then
    exit 1
  fi
  echo "Local disk checks passed."
  exit 0
fi

echo "=== Live HTTP probes ($SITE_URL) ==="

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
