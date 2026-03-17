#!/usr/bin/env bash
# Selective upstream sync — pulls framework-only changes from upstream medusajs/medusa.
# Usage: ./scripts/sync-upstream.sh [--dry-run]
set -euo pipefail

DRY_RUN=${1:-}
MANIFEST="scripts/sync-manifest.json"

echo "=== AcmeKit upstream sync ==="
echo "Fetching upstream..."
git fetch upstream main

echo "Paths tracked in sync manifest:"
node -e "
const m = JSON.parse(require('fs').readFileSync('$MANIFEST', 'utf8'));
m.tracked.forEach(p => console.log(' -', p));
"

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "(dry run — showing diff only)"
  git diff HEAD..upstream/main -- \
    packages/core/framework/ \
    packages/core/utils/ \
    packages/core/types/ \
    packages/core/modules-sdk/ \
    packages/core/workflows-sdk/ \
    packages/core/core-flows/ \
    packages/modules/auth/ \
    packages/modules/cache-inmemory/ \
    packages/modules/cache-redis/ \
    packages/modules/analytics/ \
    packages/modules/customer/ \
    packages/modules/user/ \
    packages/modules/api-key/ \
    packages/modules/settings/ \
    packages/modules/file/ \
    packages/modules/notification/ \
    packages/modules/locking/ \
    packages/modules/workflow-engines/ \
    packages/modules/index/ \
    packages/admin/ \
    packages/core/js-sdk/ | head -200
  exit 0
fi

echo "Cherry-picking framework changes..."
echo "NOTE: Manual cherry-pick or merge required. Run with --dry-run to preview."
echo "Suggested: git checkout -b sync/upstream-$(date +%Y-%m-%d) && git merge upstream/main -- <paths>"
