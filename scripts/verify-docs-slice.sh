#!/usr/bin/env bash
set -euo pipefail
echo "=== Verifying docs build ==="
cd www
echo "--- yarn install ---"
yarn install --frozen-lockfile 2>&1 | tail -5

echo "--- yarn build ---"
yarn build 2>&1 | tail -50

echo "=== Docs build: PASS ==="
