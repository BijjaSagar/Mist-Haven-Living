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

STANDALONE_PUBLIC="$ROOT/.next/standalone/public"
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
