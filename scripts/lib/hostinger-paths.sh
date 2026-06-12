#!/usr/bin/env bash
# Shared Hostinger path helpers for deploy + upload persistence scripts.
# Source from other scripts: source "$(dirname "$0")/lib/hostinger-paths.sh"

hostinger_app_root() {
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[1]:-${BASH_SOURCE[0]}}")/.." && pwd)"
  echo "$script_dir"
}

hostinger_domain_dir() {
  local root="${1:-$(hostinger_app_root)}"
  echo "$(cd "$root/.." && pwd)"
}

hostinger_persistent_uploads() {
  local root="${1:-$(hostinger_app_root)}"
  local domain_dir
  domain_dir="$(hostinger_domain_dir "$root")"
  echo "${PERSISTENT_UPLOADS_PATH:-${UPLOADS_DIR:-$domain_dir/uploads-data}}"
}

# Flat: server.js + public/ at app root. Nested: .next/standalone/
hostinger_standalone_dir() {
  local root="${1:-$(hostinger_app_root)}"
  if [[ -f "$root/server.js" ]] && [[ -d "$root/public" || -d "$root/.next" ]]; then
    echo "$root"
  else
    echo "$root/.next/standalone"
  fi
}

hostinger_public_dir() {
  local root="${1:-$(hostinger_app_root)}"
  local standalone
  standalone="$(hostinger_standalone_dir "$root")"
  echo "$standalone/public"
}

hostinger_static_dir() {
  local root="${1:-$(hostinger_app_root)}"
  local standalone
  standalone="$(hostinger_standalone_dir "$root")"
  if [[ -d "$standalone/.next/static/css" ]]; then
    echo "$standalone/.next/static"
  elif [[ -d "$root/.next/static/css" ]]; then
    echo "$root/.next/static"
  else
    echo "$standalone/.next/static"
  fi
}

hostinger_count_upload_files() {
  local persistent="${1:-$(hostinger_persistent_uploads)}"
  find "$persistent" -type f 2>/dev/null | wc -l | tr -d ' '
}
