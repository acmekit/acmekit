#!/usr/bin/env bash
set -euo pipefail
DOMAIN=${1:?Usage: verify-slice.sh <domain>}
echo "=== Verifying slice: $DOMAIN ==="

# 1. TypeScript compile check
echo "--- tsc --noEmit ---"
npx tsc --noEmit --project tsconfig.json 2>&1 | head -30
TSC_ERRORS=$(npx tsc --noEmit --project tsconfig.json 2>&1 | grep -c "error TS" || true)
if [ "$TSC_ERRORS" -gt 0 ]; then
  echo "FAIL: $TSC_ERRORS TypeScript errors found"
  exit 1
fi
echo "OK: tsc passed"

# 2. Check no dead barrel exports pointing to deleted domain dirs
echo "--- Barrel dead-export check ---"
for barrel in \
  "packages/core/core-flows/src/index.ts:packages/core/core-flows/src" \
  "packages/core/types/src/index.ts:packages/core/types/src" \
  "packages/core/types/src/http/index.ts:packages/core/types/src/http" \
  "packages/core/utils/src/index.ts:packages/core/utils/src"; do
  BARREL=$(echo $barrel | cut -d: -f1)
  BASE_DIR=$(echo $barrel | cut -d: -f2)
  if [ ! -f "$BARREL" ]; then continue; fi
  DEAD=$(grep "^export \* from" "$BARREL" | \
    sed 's/export \* from "\.\/\([^"]*\)".*/\1/' | \
    while read d; do
      base=$(echo "$d" | cut -d/ -f1)
      [ -d "$BASE_DIR/$base" ] || echo "DEAD: $d"
    done)
  if [ -n "$DEAD" ]; then
    echo "FAIL: Dead barrel exports in $BARREL:"
    echo "$DEAD"
    exit 1
  fi
done
echo "OK: No dead barrel exports"

# 3. Check no remaining imports from the deleted domain package
echo "--- Import reference check for $DOMAIN ---"
REFS=$(grep -r "@medusajs/$DOMAIN\b" packages/ --include="*.ts" | grep -v node_modules | grep -v "\.spec\." || true)
if [ -n "$REFS" ]; then
  echo "WARN: Remaining references to @medusajs/$DOMAIN:"
  echo "$REFS" | head -20
fi

echo "=== Slice $DOMAIN: PASS ==="
