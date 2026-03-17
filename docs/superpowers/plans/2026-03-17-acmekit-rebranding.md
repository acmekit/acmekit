# AcmeKit Rebranding Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Medusa v2 monorepo into AcmeKit — a general-purpose application framework — by removing all 14 commerce domain modules, renaming `@medusajs/*` → `@acmekit/*`, cleaning the www docs site, and establishing upstream sync.

**Architecture:** Slice-by-slice removal (one domain fully deleted across ALL layers per task), followed by www cleanup, then namespace/symbol rename as a final pass. Each slice is independently verifiable via `scripts/verify-slice.sh`. The Pre-Work (client API rename) is a standalone branch merged before any slice work begins.

**Tech Stack:** TypeScript, Yarn 3 workspaces, Turborepo, jscodeshift (AST import removal), ts-morph (symbol rename), knip (dead code detection), perl (batch text replacement), Next.js (www docs)

**Spec:** `docs/superpowers/specs/2026-03-17-rebranding-fork-design.md` — authoritative reference for all detailed commands. This plan references spec sections; always consult the spec for exact shell commands.

---

## Chunk 1: Setup, Branch Structure, and Pre-Work

---

### Task 1: Repository Setup & Branch Structure

**Files:**
- Modify: `.git/config` (remotes)
- Create: `.acmekit-progress.json`
- Create: `.knip-baseline.txt`
- Create: `scripts/verify-slice.sh` (spec Section 17)
- Create: `scripts/verify-docs-slice.sh` (spec Section 17)
- Create: `scripts/sync-upstream.sh` (spec Section 17)
- Create: `scripts/sync-manifest.json` (spec Section 17)
- Create: `scripts/codemods/remove-domain-imports.ts` (spec Section 17 — jscodeshift transform)
- Create: `scripts/codemods/rename-symbols.ts` (spec Section 16.2 — ts-morph symbol renamer)
- Create: `scripts/codemods/rename-namespace.ts` (spec Section 15.1 — jscodeshift namespace renamer; used in Task 31)
- Create: `scripts/docs-remove-domain-references.mjs` (spec Section 17)
- Create: `scripts/find-orphaned-docs.mjs` (spec Section 17 — orphaned doc reference scanner)

**Spec reference:** Sections 2, 3, 15.1, 16.2, 17

- [ ] **Step 1: Set up git remotes and rerere**

```bash
git remote add upstream https://github.com/medusajs/medusa.git
git remote set-url --push upstream no_push
git config rerere.enabled true
git config rerere.autoupdate true
# Create and push the three permanent branches:
git checkout -b develop
git push -u origin develop
git checkout -b upstream-mirror
git push -u origin upstream-mirror
git checkout develop
```

- [ ] **Step 2: Install tooling dependencies (spec Section 3)**

```bash
yarn add -D knip madge jscodeshift ts-morph
brew install ast-grep   # or: cargo install ast-grep
npm install -g linkinator
# www MDX processing deps (needed by verify-docs-slice.sh):
cd www && yarn add -D gray-matter unified remark-parse remark-frontmatter remark-stringify glob && cd ..
```

- [ ] **Step 3: Create all automation scripts**

Create each script exactly as defined in the spec section referenced:
- `scripts/verify-slice.sh` — per-slice gate: tsc + knip diff + refs check (spec Section 17)
- `scripts/verify-docs-slice.sh` — docs build gate: runs www prep + build + link checker (spec Section 17)
- `scripts/sync-upstream.sh` — selective upstream sync (spec Section 17)
- `scripts/sync-manifest.json` — tracked paths manifest (spec Section 17)
- `scripts/codemods/remove-domain-imports.ts` — jscodeshift transform for import removal (spec Section 17)
- `scripts/codemods/rename-symbols.ts` — ts-morph symbol renamer (spec Section 16.2)
- `scripts/codemods/rename-namespace.ts` — jscodeshift transform for `@medusajs/*` → `@acmekit/*` (spec Section 15.1)
- `scripts/docs-remove-domain-references.mjs` — docs reference scanner (spec Section 17)
- `scripts/find-orphaned-docs.mjs` — orphaned doc reference scanner (spec Section 17)

Make scripts executable:
```bash
chmod +x scripts/verify-slice.sh scripts/verify-docs-slice.sh scripts/sync-upstream.sh
```

- [ ] **Step 4: Capture knip baseline and create progress tracker (spec Section 3)**

```bash
npx knip --production --reporter compact | sort > .knip-baseline.txt
cat > .acmekit-progress.json << 'EOF'
{
  "completedSlices": [],
  "lastCompletedAt": null,
  "notes": "Track completed slices here. Check this file to know where to resume."
}
EOF
```

- [ ] **Step 5: Commit setup**

```bash
git add scripts/ .knip-baseline.txt .acmekit-progress.json
git commit -m "chore: rebranding tooling setup — scripts, knip baseline, progress tracker"
```

Expected: clean commit, no errors.

---

### Task 2: Pre-Work — Client API Rename (`/store` → `/client`)

**Files:**
- Modify: `packages/core/framework/src/http/router.ts`
- Modify: `packages/core/framework/src/http/middlewares/ensure-publishable-api-key.ts`
- Modify: `packages/core/utils/src/api-key/api-key-type.ts` (PUBLISHABLE_KEY_HEADER → CLIENT_KEY_HEADER)
- Modify: `packages/core/types/src/common/config-module.ts`
- Rename: `packages/medusa/src/api/store/` → `packages/medusa/src/api/client/`
- Modify: `packages/medusa/src/api/middlewares.ts` (import path update after store/ → client/ rename)
- Rename: `www/apps/api-reference/specs/store/` → `www/apps/api-reference/specs/client/`
- Modify: `packages/core/js-sdk/src/` (Store → Client SDK rename)
- Modify: `packages/admin/dashboard/src/` (Publishable Keys → Client Keys)

**Spec reference:** Section 4 (all subsections 4.1–4.7)

> ⚠️ This entire task must be completed and merged as a standalone branch **before** any slice work begins.

- [ ] **Step 1: Create pre-work branch**

```bash
git checkout -b feat/pre-work-client-api-rename
```

- [ ] **Step 2: Rename API directory (spec Section 4.3.1)**

```bash
git mv packages/medusa/src/api/store packages/medusa/src/api/client
# Update all internal references to the old path:
grep -rl '"./store"\|"../store"\|"/store"' packages/medusa/src/api/ --include="*.ts" | \
  xargs perl -pi -e 's|/api/store|/api/client|g'
# Also update packages/medusa/src/api/middlewares.ts (imports from the store/ directory):
perl -pi -e 's|from "\./store/|from "./client/|g; s|from "\.\.\/store/|from "../client/|g' \
  packages/medusa/src/api/middlewares.ts
```

- [ ] **Step 3: Update router.ts (spec Section 4.3.2)**

Follow spec Section 4.3.2 exactly:
- Rename `/store` prefix → `/client`
- Rename `#applyStorePublishableKeyMiddleware` → `#applyClientKeyMiddleware`
- Update the method call site

- [ ] **Step 4: Update api-key-type.ts + ensure-publishable-api-key.ts (spec Section 4.3.3)**

The canonical header constant lives in `packages/core/utils/src/api-key/api-key-type.ts` — rename it first, then update the middleware that imports it:

```bash
# Step 4a: Rename the constant (source of truth):
perl -pi -e 's/PUBLISHABLE_KEY_HEADER/CLIENT_KEY_HEADER/g' \
  packages/core/utils/src/api-key/api-key-type.ts
# Step 4b: Update all importers of the old constant name:
grep -rl "PUBLISHABLE_KEY_HEADER" packages/ --include="*.ts" | grep -v node_modules | \
  xargs perl -pi -e 's/PUBLISHABLE_KEY_HEADER/CLIENT_KEY_HEADER/g'
```

Then follow spec Section 4.3.3 for `ensure-publishable-api-key.ts`:
- Change header string from `x-publishable-api-key` → `x-client-api-key`
- Update error messages to reference the new header name

- [ ] **Step 5: Rename storeCors → clientCors (spec Section 4.3.4)**

```bash
perl -pi -e 's/storeCors/clientCors/g' \
  packages/core/types/src/common/config-module.ts
# Find all usages and update:
grep -rl "storeCors" packages/ --include="*.ts" | grep -v node_modules | \
  xargs perl -pi -e 's/storeCors/clientCors/g'
```

- [ ] **Step 6: Move api-reference specs directory + update "Store API" nav label (spec Section 4.3.5)**

```bash
git mv www/apps/api-reference/specs/store www/apps/api-reference/specs/client
# Also rename the Next.js App Router route directory (maps to the /store URL segment):
[ -d www/apps/api-reference/app/store ] && \
  git mv www/apps/api-reference/app/store www/apps/api-reference/app/client
# Update all references to the old path within api-reference:
grep -rl "specs/store\|app/store\|/api/store" www/apps/api-reference/ | \
  xargs perl -pi -e 's|specs/store|specs/client|g; s|app/store|app/client|g; s|/api/store|/api/client|g'
# Update "Store API" → "Client API" in top-nav (constants.tsx) and sidebar_id:
perl -pi -e 's|title: "Store API"|title: "Client API"|g;
             s|link: "/api/store"|link: "/api/client"|g;
             s|sidebar_id: "store"|sidebar_id: "client"|g' \
  www/packages/docs-ui/src/constants.tsx
```

> **Note:** The spec omits this constants.tsx update. "Store API" in the Reference dropdown must become "Client API" with link `/api/client` to match the renamed route prefix.

- [ ] **Step 7: JS SDK rename Store → ClientSdk (spec Section 4.4–4.6)**

Follow spec Sections 4.4–4.6 exactly:
- Rename `Store` class → `ClientSdk` in `packages/core/js-sdk/src/store/` → `src/client-sdk/`
- Add `protected readonly prefix = "/client"` to ClientSdk
- Add generic `fetch<T>()` method to ClientSdk
- Rename top-level `Medusa.store` property → `Medusa.client` (the `ClientSdk` getter on the root SDK object)
- **Do NOT rename `Admin.store` or `admin/store.ts`** — `admin.store` is the admin store-settings sub-resource; it is deleted later in Task 3 Step 9 (spec 4.4.5)
- Resolve barrel export collision (`Client as HttpClient`)
- Update `Config.publishableKey` → `Config.clientKey`

- [ ] **Step 8: Dashboard "Publishable Keys" → "Client Keys" (spec Section 4.7)**

```bash
grep -rl "Publishable Key\|publishable.key\|publishable_key" \
  packages/admin/dashboard/src/ --include="*.tsx" --include="*.ts" | \
  grep -v node_modules | \
  xargs perl -pi -e 's/Publishable Key/Client Key/g; s/publishableKey/clientKey/g; s/publishable_key/client_key/g'
```

- [ ] **Step 9: Run TypeScript to verify pre-work compiles**

```bash
npx tsc --noEmit --project tsconfig.json 2>&1 | head -30
```

Expected: 0 errors (or only pre-existing errors unrelated to this change).

- [ ] **Step 10: Commit pre-work**

```bash
git add packages/ www/apps/api-reference/specs/
git commit -m "feat: rename /store → /client API, x-client-api-key header, ClientSdk, clientCors"
```

- [ ] **Step 11: Merge pre-work branch to develop**

```bash
git checkout develop
git merge --no-ff feat/pre-work-client-api-rename
git push origin develop
```

---

## Chunk 2: Commerce Slices 1–8

> **Before starting:** Confirm pre-work branch is merged. Check `.acmekit-progress.json` to resume from correct slice if interrupted.
>
> **After every slice:** Run `bash scripts/verify-slice.sh DOMAIN`, then `yarn build` and `yarn test`. Fix all failures before proceeding. Update `.acmekit-progress.json`.
>
> **After Step 1 of every slice:** Run `yarn install` (removes stale symlinks from deleted package).
>
> **Spec reference:** Sections 5 (slice order), 6 (12-step playbook), 11 (link-modules)

> **Slice count note:** There are 16 slices total (hence `[slice N/16]` in commit messages): 14 commerce domain modules + slice 15 (link-modules partial deletion) + slice 16 (draft-order plugin). The plan intro says "14 commerce domain modules" — that refers to modules only; slices 15–16 are structural cleanup steps that follow the same verification pattern.

---

### Task 3: Slice 1 — `store`

**Spec reference:** Section 6 (all steps), Section 6 Step 2 special case, Section 6 Step 3 special note, Section 6 Step 6 special surgery

- [ ] **Step 1: Create slice branch and delete module package**

```bash
git checkout -b slice/store
rm -rf packages/modules/store/
yarn install
```

- [ ] **Step 2: Delete core-flows (spec Section 6 Step 2 + special case)**

```bash
rm -rf packages/core/core-flows/src/store/
perl -pi -e 's/^export \* from "\.\/store[^"]*";\n//gm' packages/core/core-flows/src/index.ts
# Special case: remove store references from defaults/ (create-defaults.ts):
rm -f packages/core/core-flows/src/defaults/steps/create-default-store.ts
perl -pi -e 's/^.*createDefaultStoreStep.*\n//gm' \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
perl -pi -e 's/^.*createDefaultSalesChannelStep.*\n//gm' \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
perl -pi -e 's/^.*linkSalesChannelsToApiKeyWorkflow.*\n//gm' \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
```

- [ ] **Step 3: Delete admin API routes (NOT client/ — that survives)**

```bash
rm -rf packages/medusa/src/api/admin/store*/
rm -rf packages/medusa/src/api/admin/store-*/
```

- [ ] **Step 4–12: Complete remaining steps per spec Section 6 playbook**

Execute Steps 4–12 of the playbook for domain `store`:
- Step 4: `rm -f packages/medusa/src/modules/store.ts` + barrel update
- Step 5: Delete store subscribers and policies
- Step 6: Core surgery — definition.ts, define-config.ts (`DEFAULT_STORE_RESTRICTED_FIELDS`), utils/src/store/, types/src/store/, container.ts
  - **Explicit deletion:** `rm -rf packages/core/types/src/http/store/` (the `store` HTTP type directory; NOT `types/src/http/store-credit/` if it exists — that belongs to order). Verify with `ls packages/core/types/src/http/ | grep store` before and after.
- Step 7: Link-module definitions (see spec Section 11 for exact files)
- Step 8: Dashboard route cleanup (`routes/store*/`)
- Step 9: Admin SDK method removal — explicitly: `rm -f packages/core/js-sdk/src/admin/store.ts` then remove the `store` property from `packages/core/js-sdk/src/admin/index.ts` barrel
- Step 10: Integration test deletion
- Step 11: HTTP types cleanup (check per-slice table in spec Step 6)
- Step 12: Run verify-slice gate

```bash
bash scripts/verify-slice.sh store
yarn build
yarn test
```

Expected: verify-slice PASS, 0 build errors, tests pass.

- [ ] **Step 13: Commit slice**

```bash
git add -A
git commit -m "feat(acmekit): remove store commerce module [slice 1/16]"
```

---

### Task 4: Slice 2 — `currency`

Follow the identical pattern as Task 3. Domain = `currency`.

- [ ] **Step 1:** `rm -rf packages/modules/currency/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook (spec Section 6) for `currency`
  - No special cases for this domain
  - Step 6 types: check for `packages/core/types/src/currency/` and `packages/core/types/src/http/currency/`
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/currencies/`
- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh currency
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove currency commerce module [slice 2/16]"`

---

### Task 5: Slice 3 — `tax`

Domain = `tax`. (Spec Section 5 order: tax is slice 3, region is slice 4.)

- [ ] **Step 1:** `rm -rf packages/modules/tax/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `tax`
  - Also delete provider: `rm -rf packages/modules/providers/tax-*/`
  - Step 6 types: `packages/core/types/src/http/tax/`
- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh tax
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove tax commerce module [slice 3/16]"`

---

### Task 6: Slice 4 — `region`

Domain = `region`.

- [ ] **Step 1:** `rm -rf packages/modules/region/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `region`
  - Step 6 types: `packages/core/types/src/http/region/`
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/regions/`
- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh region
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove region commerce module [slice 4/16]"`

---

### Task 7: Slice 5 — `pricing` / `price-list`

Domain = `pricing`. (Spec Section 5 order: pricing is slice 5. `sales-channel` is slice 14 — must come after `cart` and `order`; it appears in Chunk 3.)

- [ ] **Step 1:** `rm -rf packages/modules/pricing/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `pricing`
  - Also delete: `packages/core/core-flows/src/price-list/` (unconditional)
  - Step 6 types: `packages/core/types/src/http/pricing/`, `packages/core/types/src/http/price-list/` (unconditional)
  - No client API routes (pricing/price-list are admin-only)

```bash
rm -rf packages/core/core-flows/src/price-list/
perl -pi -e 's/^export \* from "\.\/price-list[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 2b: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=pricing playbook)**

```bash
# Admin API routes not prefixed "pricing":
rm -rf packages/medusa/src/api/admin/price-lists/
rm -rf packages/medusa/src/api/admin/price-preferences/
# Dashboard routes not prefixed "pricing":
rm -rf packages/admin/dashboard/src/routes/price-lists/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh pricing
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove pricing commerce module [slice 5/16]"`

---

### Task 8: Slice 6 — `promotion`

Domain = `promotion`.

- [ ] **Step 1:** `rm -rf packages/modules/promotion/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `promotion`
  - Additional http directory to delete: `packages/core/types/src/http/campaign/` (spec Step 6 per-slice table)

- [ ] **Step 2b: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=promotion playbook)**

```bash
rm -rf packages/medusa/src/api/admin/campaigns/
rm -rf packages/admin/dashboard/src/routes/campaigns/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh promotion
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove promotion commerce module [slice 6/16]"`

---

### Task 9: Slice 7 — `product`

Domain = `product`.

- [ ] **Step 1:** `rm -rf packages/modules/product/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `product`
  - Additional http directories: `packages/core/types/src/http/product-category/`, `packages/core/types/src/http/collection/` (spec Step 6 per-slice table)
  - Also delete orphaned core-flows directories: `packages/core/core-flows/src/product-category/` and `packages/core/core-flows/src/product-tag/`
  - Also delete the top-level `packages/core/types/src/product-category/` directory (separate from the `http/` subdirectory): `rm -rf packages/core/types/src/product-category/`
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/products/ packages/medusa/src/api/client/product-categories/ packages/medusa/src/api/client/product-tags/ packages/medusa/src/api/client/product-types/ packages/medusa/src/api/client/product-variants/ packages/medusa/src/api/client/collections/`

```bash
rm -rf packages/core/core-flows/src/product-category/
rm -rf packages/core/core-flows/src/product-tag/
perl -pi -e 's/^export \* from "\.\/product-category[^"]*";\n//gm' packages/core/core-flows/src/index.ts
perl -pi -e 's/^export \* from "\.\/product-tag[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 2b: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=product playbook)**

```bash
# Admin API: collections is not "product-" prefixed:
rm -rf packages/medusa/src/api/admin/collections/
# Dashboard: categories/ and collections/ are not "product-" prefixed:
rm -rf packages/admin/dashboard/src/routes/categories/
rm -rf packages/admin/dashboard/src/routes/collections/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh product
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove product commerce module [slice 7/16]"`

---

### Task 10: Slice 8 — `inventory`

Domain = `inventory`.

- [ ] **Step 1:** `rm -rf packages/modules/inventory/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `inventory`
  - Additional http directory: `packages/core/types/src/http/reservation/` (spec Step 6 per-slice table)
  - Also delete orphaned core-flows directory: `packages/core/core-flows/src/reservation/`
  - No client API routes (inventory is admin-only)

```bash
rm -rf packages/core/core-flows/src/reservation/
perl -pi -e 's/^export \* from "\.\/reservation[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 2b: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=inventory playbook)**

```bash
rm -rf packages/medusa/src/api/admin/reservations/
rm -rf packages/admin/dashboard/src/routes/reservations/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh inventory
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove inventory commerce module [slice 8/16]"`

---

### Task 11: Merge Slices 1–8 checkpoint

- [ ] **Merge to develop (sequential — one at a time)**

```bash
git checkout develop
# Merge one branch at a time — git merge rejects multi-branch merges with conflicts
for b in slice/store slice/currency slice/tax slice/region \
          slice/pricing slice/promotion slice/product slice/inventory; do
  git merge --no-ff "$b"
done
git push origin develop
```

> **Note on merge conflicts:** Barrel export files (`index.ts`) are the most common conflict source. `rerere` (enabled in Task 1) replays previously resolved conflicts automatically. Resolve new conflicts by keeping only non-commerce exports.

- [ ] **Update progress tracker**

```bash
perl -pi -e 's/"completedSlices": \[\]/"completedSlices": ["store","currency","tax","region","pricing","promotion","product","inventory"]/' \
  .acmekit-progress.json
git add .acmekit-progress.json && git commit -m "chore: update progress tracker — slices 1-8 complete"
```

---

## Chunk 3: Commerce Slices 9–16

> **Slice conventions:** Same as Chunk 2. After every slice: `bash scripts/verify-slice.sh DOMAIN`, then `yarn build` and `yarn test`. Fix all failures before proceeding. After Step 1 of every slice: `yarn install`. Update `.acmekit-progress.json` after each slice.

---

### Task 12: Slice 9 — `stock-location`

Domain = `stock-location`.

- [ ] **Step 1:** `rm -rf packages/modules/stock-location/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `stock-location`

- [ ] **Step 2b: Delete non-DOMAIN-prefixed dashboard routes (not caught by DOMAIN=stock-location playbook)**

```bash
# Dashboard: locations/ is not "stock-location-" prefixed:
rm -rf packages/admin/dashboard/src/routes/locations/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh stock-location
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove stock-location commerce module [slice 9/16]"`

---

### Task 13: Slice 10 — `fulfillment`

Domain = `fulfillment`.

- [ ] **Step 1:** `rm -rf packages/modules/fulfillment/ packages/modules/providers/fulfillment-manual/ && yarn install`
- [ ] **Step 1b: Delete provider module wrapper files (not covered by DOMAIN= playbook)**

```bash
# packages/medusa/src/modules/fulfillment-manual.ts imports from @medusajs/fulfillment-manual
# which is now deleted. Must delete the wrapper file explicitly:
rm -f packages/medusa/src/modules/fulfillment-manual.ts
```

- [ ] **Steps 2–12:** Execute full playbook for `fulfillment`
  - Additional http directories: `packages/core/types/src/http/shipping-option/`, `packages/core/types/src/http/shipping-profile/` (spec Step 6 per-slice table)
  - Also delete orphaned core-flows directories: `packages/core/core-flows/src/shipping-options/` and `packages/core/core-flows/src/shipping-profile/`
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/shipping-options/`

```bash
rm -rf packages/core/core-flows/src/shipping-options/
rm -rf packages/core/core-flows/src/shipping-profile/
perl -pi -e 's/^export \* from "\.\/shipping-options[^"]*";\n//gm' packages/core/core-flows/src/index.ts
perl -pi -e 's/^export \* from "\.\/shipping-profile[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 2b: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=fulfillment playbook)**

```bash
# Admin API: shipping-options, shipping-profiles, shipping-option-types are not "fulfillment-" prefixed:
rm -rf packages/medusa/src/api/admin/shipping-options/
rm -rf packages/medusa/src/api/admin/shipping-profiles/
rm -rf packages/medusa/src/api/admin/shipping-option-types/
# Dashboard: same — not "fulfillment-" prefixed:
rm -rf packages/admin/dashboard/src/routes/shipping-profiles/
rm -rf packages/admin/dashboard/src/routes/shipping-option-types/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh fulfillment
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove fulfillment commerce module [slice 10/16]"`

---

### Task 14: Slice 11 — `payment`

Domain = `payment`.

> **Note:** Spec Section 5 row 11 says "References order" — this is a documentation error in the spec. The actual dependency direction is order→payment (`order` module calls `payment` services, not vice versa). Removing `payment` before `order` (slices 11 then 13) is the correct topological order.

- [ ] **Step 1:** `rm -rf packages/modules/payment/ packages/modules/providers/payment-stripe/ && yarn install`
- [ ] **Step 1b: Delete provider module wrapper files (not covered by DOMAIN= playbook)**

```bash
# packages/medusa/src/modules/payment-stripe.ts imports from @medusajs/payment-stripe
# which is now deleted. Must delete the wrapper file explicitly:
rm -f packages/medusa/src/modules/payment-stripe.ts
```

- [ ] **Steps 2–12:** Execute full playbook for `payment`
  - Additional http directory: `packages/core/types/src/http/refund-reason/` (spec Step 6 per-slice table)
  - Also delete orphaned core-flows directory: `packages/core/core-flows/src/payment-collection/`
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/payment-collections/ packages/medusa/src/api/client/payment-providers/`

```bash
rm -rf packages/core/core-flows/src/payment-collection/
perl -pi -e 's/^export \* from "\.\/payment-collection[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 1c: Delete commerce link-module definition (CRITICAL-1 — done here because it links CUSTOMER→PAYMENT)**

```bash
# customer-account-holder.ts is in definitions/ (not readonly/) and links Modules.CUSTOMER → Modules.PAYMENT.
# Must be deleted here, not in Task 18, since payment is now gone.
rm -f packages/modules/link-modules/src/definitions/customer-account-holder.ts
```

- [ ] **Step 1d: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=payment playbook)**

```bash
rm -rf packages/medusa/src/api/admin/refund-reasons/
rm -rf packages/admin/dashboard/src/routes/refund-reasons/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh payment
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove payment commerce module [slice 11/16]"`

---

### Task 15: Slice 12 — `cart`

Domain = `cart`.

- [ ] **Step 1:** `rm -rf packages/modules/cart/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `cart`
  - Most complex deps from previous slices already removed
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/carts/`
- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh cart
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove cart commerce module [slice 12/16]"`

---

### Task 16: Slice 13 — `order`

Domain = `order`. Most complex slice — largest blast radius.

- [ ] **Step 1:** `rm -rf packages/modules/order/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `order`
  - Additional http directories: `packages/core/types/src/http/order-edit/`, `packages/core/types/src/http/claim/`, `packages/core/types/src/http/exchange/`, `packages/core/types/src/http/return/`, `packages/core/types/src/http/return-reason/` (spec Step 6 per-slice table)
  - Also delete: `packages/core/core-flows/src/order-edit/`, `packages/core/core-flows/src/return/`, `packages/core/core-flows/src/claim/`, `packages/core/core-flows/src/exchange/` if present
  - Also delete orphaned core-flows directories: `packages/core/core-flows/src/line-item/` and `packages/core/core-flows/src/return-reason/`
  - Delete client API routes: `rm -rf packages/medusa/src/api/client/orders/ packages/medusa/src/api/client/returns/ packages/medusa/src/api/client/return-reasons/`

```bash
rm -rf packages/core/core-flows/src/line-item/
rm -rf packages/core/core-flows/src/return-reason/
perl -pi -e 's/^export \* from "\.\/line-item[^"]*";\n//gm' packages/core/core-flows/src/index.ts
perl -pi -e 's/^export \* from "\.\/return-reason[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 2b: Delete non-DOMAIN-prefixed admin API and dashboard routes (not caught by DOMAIN=order playbook)**

```bash
# Admin API: exchanges, returns, return-reasons, claims are not "order-" prefixed:
rm -rf packages/medusa/src/api/admin/exchanges/
rm -rf packages/medusa/src/api/admin/returns/
rm -rf packages/medusa/src/api/admin/return-reasons/
rm -rf packages/medusa/src/api/admin/claims/
# Dashboard: return-reasons is not "order-" prefixed:
rm -rf packages/admin/dashboard/src/routes/return-reasons/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh order
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove order commerce module [slice 13/16]"`

---

### Task 17: Slice 14 — `sales-channel`

Domain = `sales-channel`. (Must come **after** `cart` and `order` — both depend on it per spec Section 5.)

- [ ] **Step 1:** `rm -rf packages/modules/sales-channel/ && yarn install`
- [ ] **Steps 2–12:** Execute full playbook for `sales-channel`
  - Step 6 types: `packages/core/types/src/http/sales-channel/`
  - No admin or client API route callout — verify before committing:

```bash
ls packages/medusa/src/api/client/ | grep sales || echo "No client sales-channel route (expected)"
ls packages/medusa/src/api/admin/ | grep sales
# Expected: admin/sales-channels/ (will be deleted by playbook Step 3); no client/sales-channels/
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh sales-channel
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove sales-channel commerce module [slice 14/16]"`

---

### Task 18: Slice 15 — `link-modules` partial deletion

**Spec reference:** Section 11

> **Note:** The spec states "keep 3" including `definitions/readonly/customer-account-holder.ts`. This is WRONG. That file is in `definitions/` (not `readonly/`), and it links `Modules.CUSTOMER` → `Modules.PAYMENT`. Since payment is deleted in slice 11, this link definition must also be deleted (in Task 14, not here). Only 2 files are kept.

- [ ] **Step 1: Delete ALL commerce definition files (keep 2 only)**

```bash
# Delete all definitions EXCEPT these 2 kept files:
# - definitions/invite-rbac-role.ts
# - definitions/user-rbac-role.ts
# (customer-account-holder.ts is deleted in Task 14 — it links CUSTOMER→PAYMENT)
# Delete 20 main definitions (commerce entity relationships).
# Note: customer-account-holder.ts was deleted in Task 14 Step 1c — skip it here.
cd packages/modules/link-modules/src/definitions/
rm -f cart-payment-collection.ts cart-promotion.ts fulfillment-provider-location.ts \
  fulfillment-set-location.ts order-cart.ts order-claim-payment-collection.ts \
  order-exchange-payment-collection.ts order-fulfillment.ts order-payment-collection.ts \
  order-promotion.ts order-return-fulfillment.ts product-sales-channel.ts \
  product-shipping-profile.ts product-variant-inventory-item.ts \
  product-variant-price-set.ts publishable-api-key-sales-channel.ts \
  region-payment-provider.ts sales-channel-location.ts shipping-option-price-set.ts
# Delete 14 readonly definitions (10 cart/order + 4 misc commerce readonly links):
cd readonly/
rm -f cart-customer.ts cart-product.ts cart-region.ts cart-sales-channel.ts \
  cart-shipping-option.ts line-item-adjustment-promotion.ts order-customer.ts \
  order-product.ts order-region.ts order-sales-channel.ts \
  inventory-level-stock-location.ts product-translation.ts store-currency.ts store-locale.ts
cd ../../../../../..
```

- [ ] **Step 2: Update link-modules barrel exports**

The aggregating barrel is `definitions/index.ts` (not `src/index.ts`). After Step 1 deletes 38 of 41 files, `definitions/index.ts` still exports all 38 deleted paths — breaking TypeScript. Similarly `definitions/readonly/index.ts` re-exports all 10 deleted readonly files.

```bash
# Remove deleted definition exports from the definitions barrel:
perl -pi -e 's/^export.*(?:cart|order|product|promotion|fulfillment|inventory|region|sales-channel|shipping|store|currency|payment|tax)[^"]*";\n//gmi' \
  packages/modules/link-modules/src/definitions/index.ts

# All 14 readonly files were deleted above — the readonly barrel is now empty.
# Delete it entirely (TypeScript will error if it re-exports nothing):
rm -f packages/modules/link-modules/src/definitions/readonly/index.ts

# Also clean the top-level src/index.ts barrel of deleted definition re-exports:
perl -pi -e 's/^export.*(?:cart|order|product|promotion|fulfillment|inventory|region|sales-channel|shipping|store|currency|payment|tax)[^"]*";\n//gmi' \
  packages/modules/link-modules/src/index.ts
```

- [ ] **Step 3: Verify only 2 files remain**

```bash
find packages/modules/link-modules/src/definitions/ -name "*.ts" | sort
# Expected (exactly 2 files):
# definitions/invite-rbac-role.ts
# definitions/user-rbac-role.ts

# Verify barrel health — no dead exports:
grep "^export" packages/modules/link-modules/src/definitions/index.ts
# Expected: 2 lines (invite-rbac-role and user-rbac-role only)

# The readonly/ directory should now be empty (index.ts was deleted):
ls packages/modules/link-modules/src/definitions/readonly/ 2>/dev/null && echo "ERROR: readonly dir still has files" || echo "OK: readonly dir empty"
```

- [ ] **Step 4: Verify**
```bash
bash scripts/verify-slice.sh link-modules
yarn build
yarn test
```
- [ ] **Step 5: Commit:** `git commit -m "feat(acmekit): link-modules partial deletion — keep 2 of 41 definitions [slice 15/16]"`

---

### Task 19: Slice 16 — `plugins/draft-order`

**Spec reference:** Section 5, Slice 16 note (lives under `packages/plugins/`, not `packages/modules/`)

- [ ] **Step 1:** `rm -rf packages/plugins/draft-order/ && yarn install`
- [ ] **Step 2: Remove from root workspace if listed:**

```bash
perl -pi -e 's|^\s*"packages/plugins/draft-order",?\n||gm' package.json
```

- [ ] **Step 3: Delete draft-order core-flows directory (direct rm — no grep needed):**

```bash
rm -rf packages/core/core-flows/src/draft-order/
perl -pi -e 's/^export \* from "\.\/draft-order[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

- [ ] **Step 3b: Delete draft-orders admin dashboard route and http types**

```bash
rm -rf packages/admin/dashboard/src/routes/draft-orders/
# Draft-order has its own types/http directory not caught by any slice playbook:
rm -rf packages/core/types/src/http/draft-order/
perl -pi -e 's/^export \* from "\.\/draft-order[^"]*";\n//gm' packages/core/types/src/http/index.ts
```

- [ ] **Verify:**
```bash
bash scripts/verify-slice.sh draft-order
yarn build
yarn test
```
- [ ] **Commit:** `git commit -m "feat(acmekit): remove draft-order plugin [slice 16/16]"`

---

### Task 20: Post-slices customer cleanup

**Spec reference:** Section 5 customer note

> **Branch:** Continue on `slice/draft-order` (Task 19). This cleanup commit will be included in Task 21's merge of `slice/draft-order` into `develop`.

- [ ] **Step 1: Remove orders field from CustomerDTO**

```bash
perl -pi -e 's/^\s*orders\?:\s*\{[^}]+\}\[\]\s*\n//gm' \
  packages/core/types/src/customer/common.ts
```

- [ ] **Step 2: Delete customer-groups dashboard route**

```bash
rm -rf packages/admin/dashboard/src/routes/customer-groups/
```

- [ ] **Step 3: Remove commerce cross-references from customer core-flows**

```bash
grep -rn '"cart"\|"order"\|Modules\.CART\|Modules\.ORDER' \
  packages/core/core-flows/src/customer/ --include="*.ts"
# For each file found: remove those lines or delete the file if entirely commerce-specific
```

- [ ] **Step 4: Delete customer-group SDK methods**

```bash
rm -f packages/core/js-sdk/src/admin/customer-group.ts
perl -pi -e 's/^.*customer.?group.*\n//gmi' packages/core/js-sdk/src/admin/index.ts
```

- [ ] **Step 5: Delete customer-group integration tests**

```bash
rm -rf integration-tests/modules/__tests__/customer-group/
```

- [ ] **Step 5b: Delete customer-group core-flows directory and http types**

```bash
rm -rf packages/core/core-flows/src/customer-group/
perl -pi -e 's/^export \* from "\.\/customer-group[^"]*";\n//gm' packages/core/core-flows/src/index.ts
# customer-group has its own http types directory not caught by the kept "customer" playbook:
rm -rf packages/core/types/src/http/customer-group/
perl -pi -e 's/^export \* from "\.\/customer-group[^"]*";\n//gm' packages/core/types/src/http/index.ts
```

- [ ] **Commit:** `git commit -m "chore(acmekit): post-slice customer cleanup — remove commerce coupling"`

---

### Task 21: Merge Slices 9–16 to develop

- [ ] **Merge all slice branches (sequential — one at a time):**

```bash
git checkout develop
for b in slice/stock-location slice/fulfillment slice/payment \
          slice/cart slice/order slice/sales-channel slice/link-modules slice/draft-order; do
  git merge --no-ff "$b"
done
git push origin develop
```

- [ ] **Full build and test gate (matching Chunk 2 checkpoint pattern)**

```bash
yarn build 2>&1 | tail -20
yarn test 2>&1 | tail -20
```

Expected: 0 build errors, 0 test failures from commerce references.

- [ ] **Update progress tracker and commit**

---

## Chunk 4: www Docs Cleanup

**Spec reference:** Section 10 (all subsections 10.1–10.12)

---

### Task 22: Delete www commerce apps

**Spec reference:** Sections 10.1, 10.2, 10.3

- [ ] **Step 0: Create www-cleanup branch**

```bash
git checkout -b feat/www-cleanup
```

- [ ] **Step 1: Delete cloud, bloom, user-guide, and docs apps (spec Sections 10.1–10.2)**

```bash
rm -rf www/apps/cloud/
rm -rf www/apps/bloom/
rm -rf www/apps/user-guide/
rm -rf www/apps/docs/
```

- [ ] **Step 2: Remove deleted apps from www/package.json workspaces (spec Section 10.3)**

```bash
perl -pi -e 's/^\s*"apps\/(?:cloud|bloom|user-guide|docs)",?\n//gm' www/package.json
perl -pi -e 's/^\s*"(?:cloud|bloom|user-guide|docs)",?\n//gm' www/package.json
perl -pi -e 's/^\s*"(?:cloud|bloom|user-guide|docs)",?\n//gm' www/turbo.json
grep -rl "cloud\|bloom\|user-guide\|\"docs\"" www/apps/*/next.config.mjs | \
  xargs perl -pi -e 's/^\s*"(?:cloud|bloom|user-guide|docs)",?\n//gm' || true
(cd www && yarn install)
```

- [ ] **Step 3: Verify www docs build still passes (spec Section 10.1 gate)**

```bash
cd www && yarn build 2>&1 | tail -30
```

Expected: build succeeds (no broken cross-app links from deleted apps).

- [ ] **Commit:** `git commit -m "chore(acmekit): delete cloud, bloom, user-guide, docs www apps"`

---

### Task 23: resources/ surgical removal + book cleanup

**Spec reference:** Sections 10.4, 10.5, 10.6

- [ ] **Step 1: Move 5 kept module doc dirs to application-modules/ (spec Section 10.4)**

```bash
mkdir -p www/apps/resources/app/application-modules
for MOD in api-key auth customer translation user; do
  [ -d "www/apps/resources/app/commerce-modules/${MOD}" ] && \
    mv "www/apps/resources/app/commerce-modules/${MOD}" \
       "www/apps/resources/app/application-modules/${MOD}"
done
[ -f www/apps/resources/app/commerce-modules/page.mdx ] && \
  cp www/apps/resources/app/commerce-modules/page.mdx \
     www/apps/resources/app/application-modules/page.mdx && \
  perl -pi -e 's/commerce modules/application modules/ig; s/Commerce Modules/Application Modules/g' \
    www/apps/resources/app/application-modules/page.mdx
```

- [ ] **Step 2: Delete commerce-modules and other commerce content (spec Section 10.4)**

Follow all commands in spec Section 10.4 in order:
- `rm -rf www/apps/resources/app/commerce-modules/`
- `rm -rf www/apps/resources/app/storefront-development/`
- `rm -rf www/apps/resources/app/recipes/`
- `rm -rf www/apps/resources/app/nextjs-starter/`
- Delete all commerce sidebar configs
- Update sidebar.mjs (remove commerce paths, update kept-module paths)
- Update MDXComponents/index.tsx

- [ ] **Step 3: Update resources/ sidebars for kept modules (spec Section 10.4)**

```bash
perl -pi -e 's|/commerce-modules/(api-key|auth|customer|translation|user)|/application-modules/$1|g' \
  www/apps/resources/sidebar.mjs
for MOD in api-key auth customer translation user; do
  [ -f "www/apps/resources/sidebars/${MOD}.mjs" ] && \
    perl -pi -e "s|/commerce-modules/${MOD}|/application-modules/${MOD}|g" \
      "www/apps/resources/sidebars/${MOD}.mjs"
done
```

- [ ] **Step 4: TypeDoc references cleanup (spec Section 10.5)**

Follow all commands in spec Section 10.5:
- Remove 14 commerce modules from `references.ts`
- Delete 14 commerce merger config files
- Delete generated reference directories

Also rename the main-package merger config and its TypeDoc output directory (not in spec):
```bash
# Rename medusa.ts merger config → acmekit.ts:
mv www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/medusa.ts \
   www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/acmekit.ts
# Update any internal references to "medusa" within that file:
perl -pi -e 's/\bmedusa\b/acmekit/g; s/\bMedusa\b/AcmeKit/g' \
  www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/acmekit.ts
# Rename the generated reference output directory:
[ -d www/apps/resources/references/medusa ] && \
  mv www/apps/resources/references/medusa www/apps/resources/references/acmekit
```

- [ ] **Step 5: book app sidebar cleanup (spec Section 10.6)**

Follow all commands in spec Section 10.6:
- Delete `storefront-development/`, `build-with-llms-ai/`, `from-v1-to-v2/`, `codemods/`, `commerce-modules/` directories
- Remove each from `sidebar.mjs` via perl patterns
- Validate: `node -e "import('./www/apps/book/sidebar.mjs').then(() => console.log('OK')).catch(e => { console.error(e.message); process.exit(1) })"`

- [ ] **Step 5b: Rename `medusa-config` docs directory in book app**

The book app has a docs page at `www/apps/book/app/learn/configurations/medusa-config/` that must be renamed to match the new config filename convention:

```bash
# Rename the directory:
mv www/apps/book/app/learn/configurations/medusa-config \
   www/apps/book/app/learn/configurations/acmekit-config

# Update internal references (page.mdx title/slug, any links within that dir):
find www/apps/book/app/learn/configurations/acmekit-config/ -name "*.mdx" | \
  xargs perl -pi -e 's/medusa-config/acmekit-config/g; s/medusa\.config/acmekit.config/g' || true

# Update sidebar.mjs references to this path:
perl -pi -e 's|/learn/configurations/medusa-config|/learn/configurations/acmekit-config|g' \
  www/apps/book/sidebar.mjs

# Update any cross-links within the book app:
grep -rl "configurations/medusa-config" www/apps/book/ --include="*.mdx" --include="*.mjs" --include="*.tsx" | \
  xargs perl -pi -e 's|configurations/medusa-config|configurations/acmekit-config|g' || true
```

- [ ] **Step 5c: Rename `medusa-container` docs directory in book app**

The book app has a docs page at `www/apps/book/app/learn/fundamentals/medusa-container/` whose URL path contains "medusa". Rename it to `acmekit-container`:

```bash
# Rename the directory:
mv www/apps/book/app/learn/fundamentals/medusa-container \
   www/apps/book/app/learn/fundamentals/acmekit-container

# Update sidebar.mjs reference:
perl -pi -e 's|/learn/fundamentals/medusa-container|/learn/fundamentals/acmekit-container|g' \
  www/apps/book/sidebar.mjs

# Update cross-links within the book app (many pages link to ../medusa-container/page.mdx):
grep -rl "medusa-container" www/apps/book/ --include="*.mdx" --include="*.mjs" --include="*.tsx" | \
  xargs perl -pi -e 's|medusa-container|acmekit-container|g' || true

# Update links in resources app pointing to !resources!/medusa-container-resources:
# (medusa-container-resources dir rename is already covered in Task 24 Step 2b;
#  also update any !resources!/medusa-container-resources shortcode links in book):
grep -rl "medusa-container-resources" www/apps/book/ --include="*.mdx" | \
  xargs perl -pi -e 's|medusa-container-resources|acmekit-container-resources|g' || true
```

- [ ] **Step 6: Verify docs build (resources + book)**

```bash
cd www && yarn build 2>&1 | tail -50
```

Expected: build succeeds.

- [ ] **Commit:** `git commit -m "chore(acmekit): resources/ and book/ commerce content removal"`

---

### Task 24: next.config.mjs, additional deletions, docs prose

**Spec reference:** Sections 10.7, 10.8, 10.9, 10.10

- [ ] **Step 1: next.config.mjs cleanup (spec Section 10.7)**

Remove commerce redirects and deleted app crossProjects entries from each remaining app's `next.config.mjs`.

Also fix kept-but-renamed path redirects that are NOT covered by spec Section 10.7:
```bash
# resources/next.config.mjs — redirect /references/medusa-config now points to renamed dir:
perl -pi -e "s|/configurations/medusa-config|/configurations/acmekit-config|g;
             s|/references/medusa-config|/references/acmekit-config|g" \
  www/apps/resources/next.config.mjs

# book/next.config.mjs — outputFileTracingExcludes may reference @medusajs/icons:
perl -pi -e 's|\@medusajs/icons|\@acmekit/icons|g' \
  www/apps/book/next.config.mjs || true
```

- [ ] **Step 2: Additional resources/ directories (spec Section 10.8)**

```bash
rm -rf www/apps/resources/app/how-to-tutorials/tutorials/
rm -rf www/apps/resources/app/examples/
rm -rf www/apps/resources/app/plugins/guides/wishlist/
rm -rf www/apps/resources/app/troubleshooting/payment/
rm -rf www/apps/resources/app/troubleshooting/s3/
rm -rf www/apps/resources/app/troubleshooting/storefront-missing-pak/
rm -rf www/apps/resources/app/troubleshooting/storefront-pak-sc/
```

- [ ] **Step 2b: Rename 4 kept resource directories that have "medusa" in their URL path**

These directories are kept content but carry `medusa`-branded URLs:
```bash
# Rename the directories:
mv www/apps/resources/app/create-medusa-app     www/apps/resources/app/create-acmekit-app
mv www/apps/resources/app/medusa-cli            www/apps/resources/app/acmekit-cli
mv www/apps/resources/app/medusa-container-resources www/apps/resources/app/acmekit-container-resources
mv www/apps/resources/app/medusa-workflows-reference www/apps/resources/app/acmekit-workflows-reference
# Update internal links within those directories:
for dir in create-acmekit-app acmekit-cli acmekit-container-resources acmekit-workflows-reference; do
  find www/apps/resources/app/${dir}/ -name "*.mdx" | \
    xargs perl -pi -e 's|/resources/create-medusa-app|/resources/create-acmekit-app|g;
                        s|/resources/medusa-cli|/resources/acmekit-cli|g;
                        s|/resources/medusa-container-resources|/resources/acmekit-container-resources|g;
                        s|/resources/medusa-workflows-reference|/resources/acmekit-workflows-reference|g' || true
done
# Update sidebar.mjs path entries for these four dirs:
perl -pi -e 's|/resources/create-medusa-app|/resources/create-acmekit-app|g;
             s|/resources/medusa-cli\b|/resources/acmekit-cli|g;
             s|/resources/medusa-container-resources|/resources/acmekit-container-resources|g;
             s|/resources/medusa-workflows-reference|/resources/acmekit-workflows-reference|g' \
  www/apps/resources/sidebar.mjs
# Update next.config.mjs redirects if any exist for old paths:
grep -rl "create-medusa-app\|medusa-cli\|medusa-container-resources\|medusa-workflows-reference" \
  www/apps/resources/ --include="*.mjs" --include="*.ts" --include="*.tsx" | \
  xargs perl -pi -e 's|create-medusa-app|create-acmekit-app|g;
                     s|medusa-cli(?!-)|acmekit-cli|g;
                     s|medusa-container-resources|acmekit-container-resources|g;
                     s|medusa-workflows-reference|acmekit-workflows-reference|g' || true
```

- [ ] **Step 3: Replace commerce examples in framework docs (spec Section 10.9)**

For each file listed in spec Section 10.9 (framework docs that use commerce examples):
- Replace commerce example code with generic equivalents per the spec's replacement strategy
- Do NOT delete the page — only update the code examples

- [ ] **Step 4: Docs identity prose replacement + .env.sample URL update (spec Section 10.10)**

Follow spec Section 10.10 batch perl commands to replace "commerce platform" → "application framework" language across surviving docs.

Also update the hardcoded `docs.medusajs.com` URL in book's env sample (not caught by prose pass since it's a `.sample` file):
```bash
perl -pi -e 's|https://docs\.medusajs\.com|https://docs.acmekit.dev|g' \
  www/apps/book/.env.sample
```

- [ ] **Step 5: Verify docs build**

```bash
cd www && yarn build 2>&1 | tail -50
```

- [ ] **Commit:** `git commit -m "chore(acmekit): www docs prose cleanup — commerce → generic framework language"`

---

### Task 25: book Homepage UI rewrites + top-nav cleanup

**Spec reference:** Sections 10.11, 10.12

- [ ] **Step 1: book Homepage UI component rewrites (spec Section 10.11)**

For each component in `www/apps/book/components/Homepage/`:
- `CommerceModulesSection/`: rewrite with Infrastructure Modules grid (spec Section 10.11 rewrite target table)
- `FrameworkSection/`: update prose strings (remove "digital commerce platform")
- `LinksSection/`: remove storefront-related links
- `RecipesSection/`: delete entirely; remove `<RecipesSection />` from `page.tsx`
- `CodeTabs/`: rewrite code examples with generic event/workflow names
- `Bloom/`: delete entirely; remove `<Bloom />` from `page.tsx`

- [ ] **Step 2: Top-nav dropdown cleanup — constants.tsx (spec Section 10.12)**

Follow spec Section 10.12.1–10.12.3:
- Rename "Commerce Modules" → "Application Modules" in `www/packages/docs-ui/src/constants.tsx`
- Remove 14 commerce items; keep 5 (API Key, Auth, Customer, Translation, User)
- Update 5 item links to `/resources/application-modules/`
- Remove "Storefront" from Build dropdown
- Verify "Store API" was already renamed to "Client API" in Task 2 Step 6; if not: `perl -pi -e 's|title: "Store API"|title: "Client API"|g; s|link: "/api/store"|link: "/api/client"|g; s|sidebar_id: "store"|sidebar_id: "client"|g' www/packages/docs-ui/src/constants.tsx`
- Verify: `grep -c 'link: "/resources/application-modules/' www/packages/docs-ui/src/constants.tsx` → expect 6

- [ ] **Step 3: `www/apps/ui/` identity rebranding**

The UI docs site (`www/apps/ui/`) is a kept app with Medusa branding throughout:

```bash
# Config title + description:
perl -pi -e 's/titleSuffix: "Medusa UI"/titleSuffix: "AcmeKit UI"/g;
             s/\bMedusa UI\b/AcmeKit UI/g;
             s/Medusa applications/AcmeKit applications/g' \
  www/apps/ui/config/index.ts

# Sidebar navigation titles:
perl -pi -e 's/title: "Medusa UI"/title: "AcmeKit UI"/g;
             s/title: "Medusa Admin Extension"/title: "AcmeKit Admin Extension"/g' \
  www/apps/ui/sidebar.mjs

# Rename the medusa-admin-extension/ page directory (URL path contains "medusa"):
mv www/apps/ui/app/installation/medusa-admin-extension \
   www/apps/ui/app/installation/acmekit-admin-extension

# Update any internal links and sidebar references to the old path:
grep -rl "medusa-admin-extension" www/apps/ui/ --include="*.mdx" --include="*.mjs" --include="*.tsx" --include="*.ts" | \
  xargs perl -pi -e 's|medusa-admin-extension|acmekit-admin-extension|g' || true

# Bulk replace remaining Medusa prose in all UI app pages:
find www/apps/ui/app/ -name "*.mdx" | \
  xargs perl -pi -e 's/\bMedusa UI\b/AcmeKit UI/g; s/\bMedusa Admin\b/AcmeKit Admin/g;
                     s/\bMedusa project\b/AcmeKit project/g; s/\bMedusa\b/AcmeKit/g;
                     s/medusajs\.com/acmekit.dev/g'

# Also update www/apps/ui/specs/examples/ TSX files — these are live component examples
# displayed in the UI docs and contain "Medusa" branding strings:
find www/apps/ui/specs/ -name "*.tsx" | \
  xargs perl -pi -e 's/\bMedusa JS SDK\b/AcmeKit JS SDK/g;
                     s/\bMedusa UI\b/AcmeKit UI/g;
                     s/\bMedusa Admin\b/AcmeKit Admin/g;
                     s/\bMedusa User\b/AcmeKit User/g;
                     s/\bMedusa docs\b/AcmeKit docs/g;
                     s/\bMedusa Website\b/AcmeKit Website/g;
                     s/\bMedusa\b/AcmeKit/g;
                     s|medusajs\.com|acmekit.dev|g;
                     s/medusa\.store/sdk.client/g' || true
```

- [ ] **Step 4: Final docs build verification**

```bash
cd www && yarn build 2>&1 | tail -50
```

Expected: full build passes, 0 broken links.

- [ ] **Commit:** `git commit -m "chore(acmekit): book homepage UI rewrite, top-nav cleanup, www/apps/ui/ rebranding"`

---

## Chunk 5: Core Surgery, Dashboard, SDK, Dependencies & Branding

---

### Task 26: Dependencies cleanup

**Spec reference:** Section 8

- [ ] **Step 0: Create core-surgery branch**

```bash
git checkout develop
git checkout -b feat/core-surgery
```

> **Note:** Branching from `develop` (pre-www-cleanup) is intentional — core-surgery touches no `www/` files. The `feat/www-cleanup` and `feat/core-surgery` branches have disjoint file sets so no conflicts are expected at the Task 34 Step 2 merge.

- [ ] **Step 1: Remove commerce-only deps from packages/medusa/package.json**

Remove all entries listed in spec Section 8 from `packages/medusa/package.json`:
`@medusajs/cart`, `@medusajs/order`, `@medusajs/payment`, `@medusajs/product`, `@medusajs/pricing`, `@medusajs/promotion`, `@medusajs/fulfillment`, `@medusajs/inventory`, `@medusajs/tax`, `@medusajs/region`, `@medusajs/sales-channel`, `@medusajs/stock-location`, `@medusajs/currency`, `@medusajs/store`, `@medusajs/payment-stripe`, `@medusajs/fulfillment-manual`, `@medusajs/link-modules`, `@medusajs/draft-order`

- [ ] **Step 2: Remove commerce-only deps from core-flows/package.json**

```bash
# Remove csv-parse and json-2-csv (only used by product/price-list import/export)
perl -pi -e 's/^\s*"csv-parse":[^\n]+\n//gm; s/^\s*"json-2-csv":[^\n]+\n//gm' \
  packages/core/core-flows/package.json
```

- [ ] **Step 3: yarn install and verify**

```bash
yarn install
npx depcheck packages/core/core-flows/
npx depcheck packages/medusa/
```

- [ ] **Step 4: Root package.json scripts cleanup (spec Section 8)**

Remove commerce-referencing test scripts from root `package.json`.

- [ ] **Step 5: GitHub Actions cleanup (spec Section 8)**

Remove commerce module entries from `.github/workflows/generate-public-references.yml` and `oas-test.yml`.

- [ ] **Commit:** `git commit -m "chore(acmekit): remove commerce-only npm dependencies"`

---

### Task 27: Core Package Surgery

**Spec reference:** Section 12

- [ ] **Step 1: definition.ts — remove commerce entries from Modules enum (spec 12.1)**

In `packages/core/utils/src/modules-sdk/definition.ts`:
- Remove from `Modules` enum: `CART`, `PAYMENT`, `PRICING`, `PRODUCT`, `PROMOTION`, `FULFILLMENT`, `STOCK_LOCATION`, `TAX`, `REGION`, `ORDER`, `CURRENCY`, `SALES_CHANNEL`, `STORE`
- Remove from `MODULE_PACKAGE_NAMES` and `REVERSED_MODULE_PACKAGE_NAMES`

- [ ] **Step 1b: ModulesDefinition registry — remove commerce entries (spec 12.1)**

`packages/core/modules-sdk/src/definitions.ts` exports `ModulesDefinition`, the registry used by MedusaApp loader to resolve modules. It contains entries for ALL 14 commerce modules (`STOCK_LOCATION`, `INVENTORY`, `PRODUCT`, `PRICING`, `PROMOTION`, `CUSTOMER`, `SALES_CHANNEL`, `CART`, `REGION`, `STORE`, `CURRENCY`, `PAYMENT`, `ORDER`, `TAX`, `FULFILLMENT`). After slice deletion, referencing these keys causes TypeScript errors and runtime crashes.

Remove commerce entries from `ModulesDefinition`:

```bash
# Edit packages/core/modules-sdk/src/definitions.ts manually.
# Delete these 14 blocks (each is a [Modules.XXX]: { ... } entry):
# STOCK_LOCATION, INVENTORY, PRODUCT, PRICING, PROMOTION,
# SALES_CHANNEL, CART, REGION, STORE, CURRENCY, PAYMENT,
# ORDER, TAX, FULFILLMENT
# KEEP: EVENT_BUS, CACHE, CACHING, AUTH, WORKFLOW_ENGINE,
#        USER, SETTINGS, FILE, NOTIFICATION, INDEX, LOCKING
#
# Note: CUSTOMER is kept (repurposed as generic Account module).
# Its ModulesDefinition entry stays.
```

After editing, verify the registry contains only kept modules:

```bash
grep "^\s*\[Modules\." packages/core/modules-sdk/src/definitions.ts | sort
# Expected kept entries (non-commerce): EVENT_BUS, CACHE, CACHING, AUTH, WORKFLOW_ENGINE,
# USER, CUSTOMER, SETTINGS, FILE, NOTIFICATION, INDEX, LOCKING
# Removed commerce entries: STOCK_LOCATION, INVENTORY, PRODUCT, PRICING,
#  PROMOTION, SALES_CHANNEL, CART, REGION, STORE, CURRENCY, PAYMENT, ORDER, TAX, FULFILLMENT
```

Verify the barrel export in `packages/core/modules-sdk/src/index.ts` still exports `ModulesDefinition` and `MODULE_DEFINITIONS` (they are kept; only the entries inside change):

```bash
grep "ModulesDefinition\|MODULE_DEFINITIONS" packages/core/modules-sdk/src/index.ts
# Expected: both exported
```

- [ ] **Step 1c: `middlewares.ts` — remove all commerce route import lines and spreads**

`/packages/medusa/src/api/middlewares.ts` aggregates route middleware from every domain. After all slices delete their route directories, `middlewares.ts` retains ~72 broken imports (e.g., `import { storeCartRoutesMiddlewares } from "./client/carts/middlewares"` pointing to deleted paths). TypeScript errors on every `tsc` run.

This is a catch-all cleanup step that runs once after all slices merge to develop. Remove all commerce domain middleware imports and their spreads:

```bash
# Remove import lines for deleted admin commerce routes:
perl -pi -e 's/^import \{[^}]*\} from "\.\/(admin|client)\/(?:cart|order|product|pricing|payment|promotion|fulfillment|inventory|region|currency|tax|sales-channel|stock-location|store|draft-order|campaign|claim|exchange|return|refund|reservation)[^"]*";\n//gmi' \
  packages/medusa/src/api/middlewares.ts

# Remove the corresponding spread entries from the defineMiddlewares([...]) array.
# IMPORTANT: Use explicit commerce domain names, NOT a broad admin|store|client prefix.
# The broad prefix would delete kept spreads (adminApiKey, adminRbac, adminUser, adminCustomer, etc.)
perl -pi -e '
  # Delete all store/client spreads (all are commerce routes):
  s/^\s*\.\.\.(store|client)[A-Za-z]*(?:Routes)?Middlewares[^,\n]*,?\n//gm;
  # Delete only explicit commerce admin spreads:
  s/^\s*\.\.\.admin(?:Campaign|Claim|Collection|Currency|CustomerGroup|DraftOrder|Exchange|Fulfillment|Inventory|Order|Payment|PriceList|PricePreference|ProductCategory|ProductTag|ProductType|ProductVariant|Product|Promotion|RefundReason|Region|Reservation|Return|SalesChannel|ShippingOptionType|ShippingOption|ShippingProfile|StockLocation|Store|TaxProvider|TaxRate|TaxRegion|Tax)[A-Za-z]*(?:Routes)?Middlewares[^,\n]*,?\n//gm;
' packages/medusa/src/api/middlewares.ts

# Verify no broken imports remain:
grep -n "from \"\.\/" packages/medusa/src/api/middlewares.ts | grep -v "client/locales\|/auth\|/hooks" | head -20
# Expected: only kept routes remain (locales, auth, hooks — all non-commerce)

# Verify kept routes are still present:
grep -c "adminApiKey\|adminUser\|adminRbac\|adminCustomer\|adminNotification\|adminTranslation" \
  packages/medusa/src/api/middlewares.ts
# Expected: non-zero (all kept middleware spreads still present)
```

> **Note:** The `client/locales/` endpoint (locale switching) is NOT a commerce route — keep its import. The `auth/` routes are kept. All commerce domain imports must be removed.

- [ ] **Step 2: define-config.ts — remove commerce default modules + cloud block (spec 12.2)**

In `packages/core/utils/src/common/define-config.ts`:
- Remove all 13 commerce modules from the default auto-loaded modules array
- Remove `DEFAULT_STORE_RESTRICTED_FIELDS` constant and all references
- Remove the cloud payments configuration block: `paymentsEndpoint`, `MEDUSA_CLOUD_PAYMENTS_ENDPOINT` reference, and any associated cloud provider config object

- [ ] **Step 2c: `types/src/totals/` — remove commerce-specific totals types, keep BigNumber types**

`packages/core/types/src/totals/` contains two types of exports:
- **Keep:** `BigNumberValue`, `BigNumberInput`, `BigNumberRawValue` — used by `utils/src/dal/mikro-orm/big-number-field.ts` and `utils/src/common/is-big-number.ts` (kept packages)
- **Remove:** `CartLikeWithTotals`, `LineItemTotals`, `ItemTaxLineDTO`, `ShippingMethodTotals`, etc. — commerce-specific

Do NOT delete the entire directory. Instead surgically remove commerce types:

```bash
# List the totals/ files to assess:
ls packages/core/types/src/totals/

# Remove commerce-specific total type files (keep only big-number.ts and any generic numeric types):
# Files to delete (commerce totals): cart-like.ts, order-like.ts, line-item.ts,
# shipping-method.ts, tax.ts (if separate files) — check ls output first.
# If all types are in a single index.ts, edit to remove CartLikeWithTotals and related exports.

# After cleanup, verify BigNumberValue is still exported:
grep "BigNumberValue\|BigNumberInput\|BigNumberRawValue" packages/core/types/src/totals/index.ts
# Expected: still present

# Verify CartLikeWithTotals is gone:
grep "CartLike\|LineItemTotals\|ShippingMethodTotals" packages/core/types/src/totals/index.ts
# Expected: 0 results
```

- [ ] **Step 2b: `utils/src/` — delete commerce-specific utility directories**

`packages/core/utils/src/index.ts` exports `./totals` and `./shipping` which are commerce-specific and have no use after all slices. The per-slice DOMAIN playbook removes `./fulfillment`, `./inventory`, `./order`, `./payment`, `./pricing`, `./product`, `./promotion` from `utils/src/index.ts` — but `./totals` and `./shipping` have no matching DOMAIN and must be removed explicitly:

```bash
rm -rf packages/core/utils/src/totals/
rm -rf packages/core/utils/src/shipping/
perl -pi -e 's/^export \* from "\.\/totals[^"]*";\n//gm' packages/core/utils/src/index.ts
perl -pi -e 's/^export \* from "\.\/shipping[^"]*";\n//gm' packages/core/utils/src/index.ts
```

> **Note:** `totals/` exports cart/order calculation utilities (`computeAmount`, `computeTotal`, etc.) and imports `CartLikeWithTotals` from `@medusajs/types`. `shipping/` exports only `ShippingProfileType`. Both become entirely dead after commerce removal.

- [ ] **Step 3: container.ts — remove commerce service types (spec 12.3)**

In `packages/core/framework/src/types/container.ts`:
- Remove all 13 commerce `IXxxModuleService` entries from `ModuleImplementations`

- [ ] **Step 3b: Delete cloud API routes, cloud auth provider, and cloud notification provider**

These cloud-specific files are not covered by any commerce slice — delete explicitly:
```bash
# Cloud API route directory (admin cloud auth endpoints):
rm -rf packages/medusa/src/api/cloud/

# Medusa Cloud auth provider inside the kept auth module:
rm -f packages/modules/auth/src/providers/medusa-cloud-auth.ts
# Remove medusa-cloud-auth from auth module's provider loader:
perl -pi -e 's/^.*medusa.cloud.auth.*\n//gmi; s/^.*MedusaCloudAuth.*\n//gm' \
  packages/modules/auth/src/loaders/providers.ts
# Remove cloud-auth-specific types from auth module types:
perl -pi -e 's/^\s*cloud\?:\s*MedusaCloudAuthProviderOptions;\n//gm;
             s/^export interface MedusaCloudAuthProviderOptions.*?^}\n//gsm' \
  packages/modules/auth/src/types/index.ts || true

# Medusa Cloud email notification provider inside the kept notification module:
rm -f packages/modules/notification/src/providers/medusa-cloud-email.ts
# Remove medusa-cloud-email from notification module's provider loader:
perl -pi -e 's/^.*medusa.cloud.email.*\n//gmi; s/^.*MedusaCloudEmail.*\n//gm;
             s/^.*shouldRegisterMedusaCloud.*\n//gm;
             s/^.*validateCloudOptions.*\n//gm' \
  packages/modules/notification/src/loaders/providers.ts
# Remove cloud-email-specific types from notification module:
perl -pi -e 's/^\s*cloud\?:\s*MedusaCloudEmailOptions;\n//gm' \
  packages/modules/notification/src/types/index.ts
perl -pi -e 's/^export type MedusaCloudEmailOptions.*?^};\n//gsm' \
  packages/modules/notification/src/types/index.ts || true

# Remove remaining MedusaCloud* type references from core types:
grep -rl "MedusaCloudAuth\|MedusaCloudEmail" \
  packages/core/types/src/ --include="*.ts" | \
  xargs perl -pi -e 's/^.*(?:MedusaCloudAuth|MedusaCloudEmail).*\n//gm' || true

# Delete cloud notification integration tests:
rm -f packages/modules/notification/integration-tests/__tests__/notification-module-service/medusa-cloud-email.spec.ts
```

- [ ] **Step 3c: Delete orphaned `types/src/http/` hyphenated subdirectories**

The per-slice playbook removes barrel export lines for `./DOMAIN-*` subdirectories (e.g., DOMAIN=`fulfillment` removes `./fulfillment-provider` and `./fulfillment-set` from `http/index.ts`), but only deletes `types/src/http/DOMAIN/` (exact match). The hyphenated subdomain directories survive as dead code:

```bash
# Fulfillment sub-domains:
rm -rf packages/core/types/src/http/fulfillment-provider/
rm -rf packages/core/types/src/http/fulfillment-set/
# Tax sub-domains:
rm -rf packages/core/types/src/http/tax-provider/
rm -rf packages/core/types/src/http/tax-rate/
rm -rf packages/core/types/src/http/tax-region/
# Inventory sub-domain:
rm -rf packages/core/types/src/http/inventory-level/
# Product sub-domains (product-tag and product-type):
rm -rf packages/core/types/src/http/product-tag/
rm -rf packages/core/types/src/http/product-type/
# Stock-location (plural dir name):
rm -rf packages/core/types/src/http/stock-locations/
# Types top-level product-category:
rm -rf packages/core/types/src/product-category/

# Verify no dead exports remain in http/index.ts:
grep "^export \* from" packages/core/types/src/http/index.ts | \
  sed 's/export \* from "\.\/\([^"]*\)".*/\1/' | \
  while read d; do
    [ -d "packages/core/types/src/http/$d" ] || echo "DEAD: http/$d"
  done
# Expected: 0 DEAD lines
```

> **Note:** The barrel export lines for these directories are already removed by per-slice perl patterns. This step deletes the directories themselves for a clean codebase.

- [ ] **Step 3c: Delete cloud HTTP integration tests**

```bash
rm -rf integration-tests/http/__tests__/cloud/
```

- [ ] **Step 3d: Rename `medusa-config` → `acmekit-config` filename convention**

The framework config loader defaults to `"medusa-config"` as the filename every project creates. Must be renamed so new projects use `acmekit-config.ts`:

```bash
# 1. Update the framework loader default:
perl -pi -e 's/configFileName: string = "medusa-config"/configFileName: string = "acmekit-config"/g' \
  packages/core/framework/src/config/loader.ts

# 2. Update the hardcoded call in medusa/loaders/index.ts:
perl -pi -e 's/configLoader\(rootDirectory, "medusa-config"/configLoader(rootDirectory, "acmekit-config"/g' \
  packages/medusa/src/loaders/index.ts

# 3. Update dev-server unmanagedFiles list:
perl -pi -e 's/"medusa-config"/"acmekit-config"/g' \
  packages/medusa/src/commands/utils/dev-server/index.ts

# 4. Update user-facing error messages that mention medusa-config.js by name:
grep -rl "medusa-config\.js\|medusa-config\.ts" packages/ --include="*.ts" | \
  grep -v "node_modules\|dist\|__tests__\|__fixtures__" | \
  xargs perl -pi -e "s/medusa-config\.js/acmekit-config.js/g; s/medusa-config\.ts/acmekit-config.ts/g"

# 5. Rename integration test fixture files:
find integration-tests/ -name "medusa-config.js" -o -name "medusa-config.ts" | \
  grep -v node_modules | while read f; do
    mv "$f" "$(dirname $f)/acmekit-config.$(echo $f | sed 's/.*\.//')"
  done
# Update references to "medusa-config" inside integration test loader calls:
grep -rl '"medusa-config"\|medusa-config\.js\|medusa-config\.ts' integration-tests/ \
  --include="*.ts" --include="*.js" | \
  xargs perl -pi -e 's/"medusa-config"/"acmekit-config"/g;
                     s/medusa-config\.js/acmekit-config.js/g;
                     s/medusa-config\.ts/acmekit-config.ts/g'

# 6. Update JSDoc comment references throughout packages:
grep -rl "medusa-config\.ts\|medusa-config\.js" packages/ --include="*.ts" | \
  grep -v "node_modules\|dist" | \
  xargs perl -pi -e 's/medusa-config\.ts/acmekit-config.ts/g; s/medusa-config\.js/acmekit-config.js/g'

# 7. Update medusa-test-utils config loader call:
perl -pi -e 's/"medusa-config"/"acmekit-config"/g' \
  packages/medusa-test-utils/src/medusa-test-runner-utils/config.ts
```

- [ ] **Step 3e: `define-config.ts` — remove commerce defaults from `resolveModules()` and `resolvePlugins()`**

`packages/core/utils/src/common/define-config.ts` is the `defineConfig()` helper every project uses. Its internal `sharedModules` array auto-injects ALL 13 commerce modules into every application. After those packages are deleted, any project calling `defineConfig()` without explicit modules will crash on boot.

Similarly, `resolvePlugins()` has `@medusajs/draft-order` as a hardcoded default plugin.

```bash
# Edit packages/core/utils/src/common/define-config.ts manually.
# In resolveModules(), remove these 13 lines from sharedModules (commerce modules being deleted):
#   { resolve: MODULE_PACKAGE_NAMES[Modules.STOCK_LOCATION] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.INVENTORY] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.PRODUCT] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.PRICING] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.PROMOTION] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.SALES_CHANNEL] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.CART] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.REGION] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.STORE] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.TAX] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.CURRENCY] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.PAYMENT] },
#   { resolve: MODULE_PACKAGE_NAMES[Modules.ORDER] },
# AND remove the FULFILLMENT block (lines ~229-238, includes the manual provider):
#   { resolve: MODULE_PACKAGE_NAMES[Modules.FULFILLMENT], options: { providers: [...] } },
#
# Keep in sharedModules: CUSTOMER, API_KEY, SETTINGS, TRANSLATION, RBAC, AUTH, USER, NOTIFICATION.

# In resolvePlugins(), remove the draft-order default plugin entry from defaultPlugins:
#   ["@medusajs/draft-order", { resolve: "@medusajs/draft-order", options: {} }],
# After removal, if defaultPlugins is empty and cloudPlugins logic is trivial, simplify accordingly.

# Also clean up constants that reference commerce concepts:
# DEFAULT_STORE_CORS (line 27) — rename to DEFAULT_CLIENT_CORS and update its one usage site:
perl -pi -e 's/DEFAULT_STORE_CORS/DEFAULT_CLIENT_CORS/g' \
  packages/core/utils/src/common/define-config.ts

# DEFAULT_STORE_RESTRICTED_FIELDS (lines 32-39) — remove "order"/"orders" entries
# (those entities no longer exist); rename constant:
perl -pi -e 's/DEFAULT_STORE_RESTRICTED_FIELDS/DEFAULT_CLIENT_RESTRICTED_FIELDS/g' \
  packages/core/utils/src/common/define-config.ts

# packages/core/framework/src/http/router.ts imports DEFAULT_STORE_RESTRICTED_FIELDS
# and uses it to gate client-API response filtering.
# Update its import and usage to the renamed constant:
perl -pi -e 's/DEFAULT_STORE_RESTRICTED_FIELDS/DEFAULT_CLIENT_RESTRICTED_FIELDS/g' \
  packages/core/framework/src/http/router.ts

# Also update the utils barrel export that re-exports the constant:
perl -pi -e 's/DEFAULT_STORE_RESTRICTED_FIELDS/DEFAULT_CLIENT_RESTRICTED_FIELDS/g' \
  packages/core/utils/src/index.ts \
  packages/core/utils/src/common/index.ts 2>/dev/null || true

# Verify all usages updated:
grep -rn "DEFAULT_STORE_RESTRICTED_FIELDS\|DEFAULT_CLIENT_RESTRICTED_FIELDS" \
  packages/ --include="*.ts" | grep -v node_modules
```

> **Verify:** after this step, `defineConfig({})` (no modules key) should only inject:
> AUTH, USER, API_KEY, CUSTOMER, SETTINGS, TRANSLATION, RBAC, NOTIFICATION,
> CACHE, EVENT_BUS, WORKFLOW_ENGINE, LOCKING, FILE.
> No commerce modules. No draft-order plugin.

- [ ] **Step 3f: Verify all barrel files are clean (no dead exports)**

After all slices and orphaned-directory deletions, verify all three critical barrels have no dead exports:

```bash
# core-flows/src/index.ts:
grep "^export \* from" packages/core/core-flows/src/index.ts | \
  sed 's/export \* from "\.\/\([^"]*\)".*/\1/' | \
  while read d; do
    [ -d "packages/core/core-flows/src/$d" ] || echo "DEAD core-flows: $d"
  done

# types/src/index.ts:
grep "^export \* from" packages/core/types/src/index.ts | \
  sed 's/export \* from "\.\/\([^"]*\)".*/\1/' | \
  while read d; do
    [ -d "packages/core/types/src/$d" ] || echo "DEAD types: $d"
  done

# types/src/http/index.ts:
grep "^export \* from" packages/core/types/src/http/index.ts | \
  sed 's/export \* from "\.\/\([^"]*\)".*/\1/' | \
  while read d; do
    [ -d "packages/core/types/src/http/$d" ] || echo "DEAD types/http: $d"
  done

# utils/src/index.ts:
grep "^export \* from" packages/core/utils/src/index.ts | \
  sed 's/export \* from "\.\/\([^"]*\)".*/\1/' | \
  while read d; do
    base=$(echo "$d" | cut -d/ -f1)
    [ -d "packages/core/utils/src/$base" ] || echo "DEAD utils: $d"
  done

# Expected: 0 DEAD lines across all checks
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit --project tsconfig.json 2>&1 | head -30
```

- [ ] **Commit:** `git commit -m "chore(acmekit): core package surgery — Modules enum, define-config, container, cloud routes/auth, medusa-config → acmekit-config"`

---

### Task 28: Dashboard Navigation Rebuild

**Spec reference:** Section 13

- [ ] **Step 0: Audit dashboard for lingering commerce imports before rewriting nav**

```bash
# Find any dashboard source files still importing from deleted commerce modules:
grep -rn "from.*@medusajs/\(cart\|order\|product\|pricing\|promotion\|payment\|fulfillment\|inventory\|region\|currency\|tax\|sales-channel\|stock-location\|store\)" \
  packages/admin/dashboard/src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | head -30
# Expected: 0 results — all commerce route files were deleted in slices.
# If hits remain, delete or update those files before proceeding.
```

- [ ] **Step 1: Rewrite core routes to AcmeKit nav**

In `packages/admin/dashboard/src/hooks/use-core-routes.tsx` (or equivalent):
```typescript
const coreRoutes = [
  { path: "/",                    label: "Home",          icon: HomeIcon },
  { path: "/workflow-executions", label: "Workflows",     icon: ArrowPathIcon },
  { path: "/api-key-management",  label: "API Keys",      icon: KeyIcon },
  { path: "/users",               label: "Users",         icon: UsersIcon },
  { path: "/translations",        label: "Translations",  icon: LanguageIcon },
  { path: "/settings",            label: "Settings",      icon: CogIcon },
]
```

Remove all commerce nav entries (Orders, Products, Inventory, Customers, Promotions, Price Lists, Regions, Tax Regions, Shipping, etc.)

- [ ] **Step 2: Verify admin builds**

```bash
yarn workspace @medusajs/dashboard build 2>&1 | tail -20
```

- [ ] **Commit:** `git commit -m "chore(acmekit): dashboard navigation rebuild — remove commerce routes"`

---

### Task 29: JS SDK Cleanup

**Spec reference:** Section 14

- [ ] **Step 1: Remove 33 commerce-specific Admin SDK method properties**

In `packages/core/js-sdk/src/admin/`:
- Remove files: `order.ts`, `draftOrder.ts`, `orderEdit.ts`, `return.ts`, `claim.ts`, `exchange.ts`, `product.ts`, `productType.ts`, `productCategory.ts`, `productTag.ts`, `productCollection.ts`, `payment.ts`, `paymentCollection.ts`, `refundReason.ts`, `promotion.ts`, `campaign.ts`, `fulfillmentSet.ts`, `fulfillment.ts`, `fulfillmentProvider.ts`, `shippingOption.ts`, `shippingProfile.ts`, `shippingOptionType.ts`, `inventoryItem.ts`, `reservation.ts`, `stockLocation.ts`, `region.ts`, `salesChannel.ts`, `currency.ts`, `priceList.ts`, `pricePreference.ts`, `taxRate.ts`, `taxRegion.ts`, `taxProvider.ts`
  - Note: `customerGroup.ts` was already removed in Task 20 Step 4.
- Remove their properties from the Admin class and barrel exports

- [ ] **Step 2: Verify final SDK exports**

```bash
grep -r "cart\|order\|product\|payment\|promotion\|fulfillment\|inventory\|pricing\|region\|salesChannel\|stockLocation\|currency\|taxRate\|taxRegion" \
  packages/core/js-sdk/src/admin/ --include="*.ts" | grep -v node_modules | grep -v __tests__
```

Expected: 0 results.

- [ ] **Step 3: Verify each per-slice Step 9 was completed**

Cross-reference the spec Section 14 property list against what was removed during slice Steps 9. Any missed properties should be cleaned up now.

Also explicitly verify: `packages/core/js-sdk/src/admin/store.ts` is deleted and the `admin.store` property is removed from `packages/core/js-sdk/src/admin/index.ts` (handled in Task 3 Step 9; confirm here).

- [ ] **Step 3b: Remove commerce method properties from the `ClientSdk` (store) class**

Task 2 renames `Store` → `ClientSdk` but defers property cleanup to spec Sections 4.4–4.6. The `ClientSdk` class at `packages/core/js-sdk/src/store/index.ts` (formerly `store/index.ts`) has 8 commerce-specific public properties that will point to deleted route directories:

- `region` — from `./region` (deleted in slice 4)
- `collection` — from `./collection` (deleted in slice 7)
- `category` — from `./product-category` (deleted in slice 7)
- `product` — from `./product` (deleted in slice 7)
- `cart` — from `./cart` (deleted in slice 12)
- `fulfillment` — from `./fulfillment` (deleted in slice 10)
- `payment` — from `./payment` (deleted in slice 11)
- `order` — from `./order` (deleted in slice 13)

Keep: `locale` (locale switching, non-commerce).

All 8 commerce method properties live in a single `index.ts` (not separate files). Each property is a multi-line object literal (e.g., `public region = { list: async (...) => {...}, retrieve: async (...) => {...} }`). The per-slice Steps 9 (spec Section 14) should have already removed these bodies. This step is a catch-all to verify and clean up any remaining declarations.

```bash
# Determine the actual path (Task 2 may have renamed store/ → client/):
STORE_SDK=$(ls packages/core/js-sdk/src/store/index.ts 2>/dev/null || \
            ls packages/core/js-sdk/src/client/index.ts 2>/dev/null)
echo "Store SDK path: $STORE_SDK"

# Check if any commerce property bodies still remain:
grep -n "public region\|public collection\|public category\|public product\b\|public cart\|public fulfillment\|public payment\|public order\b" \
  "$STORE_SDK"

# If the per-slice Steps 9 already removed the property bodies (expected), grep above returns 0 lines.
# If property declarations still remain, they are multi-line blocks — delete them using
# a targeted ts-morph or manual edit, NOT the single-line perl (which would leave dangling blocks).
# As a fallback, use node to strip by property name:
node -e "
const fs = require('fs');
const src = fs.readFileSync('$STORE_SDK', 'utf8');
// Remove each commerce property block: find the line with 'public PROP', walk forward to
// the matching closing brace at the same indent level, remove the entire block.
// This is best done as a manual edit in an IDE if the per-slice work left bodies behind.
console.log('Lines containing commerce properties:',
  src.split('\n').filter((l, i) => /public (region|collection|category|product|cart|fulfillment|payment|order)\b/.test(l)).length
);
"

# Verify after cleanup:
grep -c "public region\|public collection\|public category\|public product\b\|public cart\|public fulfillment\|public payment\|public order\b" \
  "$STORE_SDK" || echo "0 commerce properties remain (expected)"
```

- [ ] **Commit:** `git commit -m "chore(acmekit): JS SDK cleanup — remove all commerce admin methods"`

---

### Task 29b: Integration Test Surgery

The slice steps (Tasks 3–21) delete commerce-specific integration tests. But there are framework-level tests (auth, RBAC, api-key, index, translation, views) that use commerce data **as test fixtures** while testing non-commerce features. These will cause compile or runtime failures if left as-is. This task refactors them to use generic/non-commerce test data.

**Files:**
- Delete: `integration-tests/modules/src/modules/brand/` (custom test module, depends on Product)
- Delete: `integration-tests/modules/src/links/product-brand.ts`
- Delete: `integration-tests/modules/src/utils/providers/fulfillment-manual-calculated/` (fulfillment provider in modules/ tree)
- Delete: `integration-tests/modules/helpers/create-variant-price-set.ts` (references Modules.PRICING, Modules.PRODUCT)
- Delete: `integration-tests/http/__fixtures__/product.ts`
- Delete: `integration-tests/http/__tests__/fixtures/order.ts`
- Delete: `integration-tests/http/__tests__/fixtures/shipping.ts` (references admin/sales-channels, admin/stock-locations)
- Delete: `integration-tests/http/src/utils/providers/fulfillment-manual-calculated/`
- Delete: all 10 `integration-tests/modules/__tests__/link-modules/*.spec.ts`
- Delete: `integration-tests/modules/__tests__/query-graph/query-graph.ts` (uses createProductsWorkflow, Modules.PRODUCT — entire file is product-translation link tests)
- Delete: `integration-tests/modules/__tests__/modules/load-standalone.ts` (imports IProductModuleService — refactor target, see Step 3)
- Delete: `integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/product-translation.ts` (links ProductModule to Translation)
- Delete: `integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/product-category-translation.ts`
- Delete: `integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/variants-translation.ts`
- Delete: `integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/option-translation.ts`
- Modify: 16 "Very Critical" framework tests (refactor to non-commerce entities)
- Modify: 4 "Moderate" tests (fix enum imports, update string data)
- Modify: `integration-tests/helpers/fixtures.ts` (remove commerce fixture exports)
- Modify: `integration-tests/helpers/seed-storefront-defaults.ts` (remove region/store seeding)
- Modify: `integration-tests/{modules,http,api}/medusa-config.*` (remove commerce module registrations)
- Modify: `integration-tests/{modules,http,api}/package.json` (remove commerce module deps)
- Modify: `integration-tests/modules/__tests__/modules/load-standalone.ts` → replace with a kept module (see Step 3)
- Modify: `integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/` → create `user-translation.ts` to replace deleted product link files

- [ ] **Step 1: Delete commerce-only test infrastructure**

```bash
# Custom brand test module (depends on Product — deleted with product slice but lives in integration-tests):
rm -rf integration-tests/modules/src/modules/brand/
rm -f  integration-tests/modules/src/links/product-brand.ts

# Fulfillment manual provider — exists in BOTH http/ and modules/ source trees:
rm -rf integration-tests/http/src/utils/providers/fulfillment-manual-calculated/
rm -rf integration-tests/modules/src/utils/providers/fulfillment-manual-calculated/

# Commerce variant-price helper (uses Modules.PRICING and Modules.PRODUCT):
rm -f integration-tests/modules/helpers/create-variant-price-set.ts

# Commerce fixture files:
rm -f integration-tests/http/__fixtures__/product.ts
rm -f integration-tests/http/__tests__/fixtures/order.ts
rm -f integration-tests/http/__tests__/fixtures/shipping.ts

# query-graph.ts helper file — uses createProductsWorkflow + Modules.PRODUCT throughout;
# entire file is product-translation link tests with no non-commerce equivalent:
rm -f integration-tests/modules/__tests__/query-graph/query-graph.ts
rmdir integration-tests/modules/__tests__/query-graph/ 2>/dev/null || true

# Translation test fixture links — all 4 are product-module link definitions:
rm -f integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/product-translation.ts
rm -f integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/product-category-translation.ts
rm -f integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/variants-translation.ts
rm -f integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/option-translation.ts

# All 10 link-module specs (test commerce-to-commerce links, have no non-commerce equivalent):
rm -f integration-tests/modules/__tests__/link-modules/cart-links.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/cart-region.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/define-link.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/fulfillment-set-location.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/product-variant-price-set.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/publishable-key-sales-channel.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/region-payment-provider.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/sales-channel-location.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/shipping-option-price-set.spec.ts
rm -f integration-tests/modules/__tests__/link-modules/store-currency.spec.ts

# ── All commerce-only HTTP spec files ────────────────────────────────────────────────────────
# The slice step tasks (Tasks 3–21) say "Step 10: Integration test deletion" without naming files.
# The following are the complete explicit file list — run these when executing the relevant slice.

# Slice 1 (store):
rm -rf integration-tests/http/__tests__/store/
rm -rf integration-tests/modules/__tests__/store/
rm -f  integration-tests/modules/__tests__/defaults/defaults.spec.ts  # queries store + sales_channel entities

# Slice 2 (currency):
rm -rf integration-tests/http/__tests__/currency/
rm -rf integration-tests/modules/__tests__/currency/

# Slice 3 (tax):
rm -rf integration-tests/http/__tests__/tax-region/
rm -rf integration-tests/modules/__tests__/tax/

# Slice 4 (region):
rm -rf integration-tests/http/__tests__/region/
rm -rf integration-tests/modules/__tests__/regions/

# Slice 5 (pricing):
rm -rf integration-tests/http/__tests__/price-list/
rm -rf integration-tests/http/__tests__/price-preference/
rm -rf integration-tests/modules/__tests__/price-lists/

# Slice 6 (promotion):
rm -rf integration-tests/http/__tests__/promotions/
rm -rf integration-tests/http/__tests__/campaigns/

# Slice 7 (product):
rm -rf integration-tests/http/__tests__/product/
rm -rf integration-tests/http/__tests__/product-category/
rm -rf integration-tests/http/__tests__/product-tag/
rm -rf integration-tests/http/__tests__/product-type/
rm -rf integration-tests/http/__tests__/product-variant/
rm -rf integration-tests/http/__tests__/collection/
rm -rf integration-tests/modules/__tests__/product/

# Slice 8 (inventory):
rm -rf integration-tests/http/__tests__/inventory/
rm -rf integration-tests/http/__tests__/reservations/

# Slice 9 (stock-location):
rm -rf integration-tests/http/__tests__/stock-location/

# Slice 10 (fulfillment):
rm -rf integration-tests/http/__tests__/fulfillment/
rm -rf integration-tests/http/__tests__/shipping-option/
rm -rf integration-tests/http/__tests__/shipping-option-type/
rm -rf integration-tests/http/__tests__/shipping-profile/
rm -rf integration-tests/modules/__tests__/fulfillment/
rm -rf integration-tests/modules/__tests__/fulfillment-providers/
rm -rf integration-tests/modules/__tests__/shipping-options/   # contains .ts helper files only

# Slice 11 (payment):
rm -rf integration-tests/http/__tests__/payment/
rm -rf integration-tests/http/__tests__/payment-collection/
rm -rf integration-tests/http/__tests__/refund-reason/
rm -rf integration-tests/modules/__tests__/payment/

# Slice 12 (cart):
rm -rf integration-tests/http/__tests__/cart/
rm -rf integration-tests/modules/__tests__/cart/

# Slice 13 (order):
rm -rf integration-tests/http/__tests__/order/
rm -rf integration-tests/http/__tests__/order-edits/
rm -rf integration-tests/http/__tests__/returns/
rm -rf integration-tests/http/__tests__/claims/
rm -rf integration-tests/http/__tests__/exchanges/
rm -rf integration-tests/modules/__tests__/order/

# Slice 16 (draft-order):
rm -rf integration-tests/http/__tests__/draft-order/

# Post-slice customer cleanup (Task 20):
rm -rf integration-tests/modules/__tests__/customer-group/
# ─────────────────────────────────────────────────────────────────────────────────────────────
```

- [ ] **Step 2: Clean integration-tests config files — remove commerce module registrations**

**`integration-tests/modules/acmekit-config.ts`** (renamed from medusa-config.ts in Task 27 Step 3d):

Remove these exact module entries from the `modules: [...]` array:
- `customTaxProviderRegistration` variable + usage (`Modules.TAX` entry)
- `customPaymentProvider` variable + usage (`Modules.PAYMENT` entry)
- `customFulfillmentProvider` variable (both its declaration and use in `Modules.FULFILLMENT`)
- `customFulfillmentProviderCalculated` variable + `require("./dist/utils/providers/fulfillment-manual-calculated")` call
- `Modules.STOCK_LOCATION` entry
- `Modules.INVENTORY` entry
- `Modules.PRODUCT` entry
- `Modules.PRICING` entry
- `Modules.PROMOTION` entry
- `Modules.REGION` entry
- `Modules.SALES_CHANNEL` entry
- `Modules.CART` entry
- `Modules.STORE` entry
- `Modules.TAX` entry (with customTaxProviderRegistration providers)
- `Modules.CURRENCY` entry
- `Modules.ORDER` entry
- `Modules.PAYMENT` entry (with customPaymentProvider providers)
- `Modules.FULFILLMENT` entry (with customFulfillmentProvider + customFulfillmentProviderCalculated)
- `{ key: "brand", resolve: "src/modules/brand" }` entry

Keep: `testingModule` (testing-module fixture), `auth` (emailpass provider), `Modules.USER`, `Modules.CACHE`, `Modules.LOCKING`, `Modules.WORKFLOW_ENGINE`, `Modules.API_KEY`, `Modules.NOTIFICATION` (local provider), `Modules.INDEX`, `Modules.RBAC`.

**`integration-tests/api/medusa-config.js`**:

Remove these exact module entries from the `modules: { ... }` object:
- `customPaymentProvider` variable + `Modules.PAYMENT` entry
- `customFulfillmentProvider` variable + `Modules.FULFILLMENT` entry
- `Modules.STOCK_LOCATION`, `Modules.INVENTORY`, `Modules.PRODUCT`, `Modules.PRICING`,
  `Modules.PROMOTION`, `Modules.REGION`, `Modules.SALES_CHANNEL`, `Modules.CART`,
  `Modules.STORE`, `Modules.TAX`, `Modules.CURRENCY`, `Modules.ORDER`
- Remove the `enableMedusaV2` variable and `medusa_v2: enableMedusaV2` feature flag

Keep: `Modules.AUTH`, `Modules.USER`, `Modules.CACHE`, `Modules.FILE`, `Modules.CUSTOMER`,
`Modules.API_KEY`, `Modules.WORKFLOW_ENGINE`, `Modules.NOTIFICATION`.

**`integration-tests/http/medusa-config.js`**:

This config is mostly clean. Remove only:
- The `customFulfillmentProvider` and `customFulfillmentProviderCalculated` variable declarations
- The entire `Modules.FULFILLMENT` entry (providers: [customFulfillmentProvider, customFulfillmentProviderCalculated])
- Remove `json-2-csv` from `integration-tests/http/package.json` devDependencies (only used by product import/export tests, which are deleted)

Keep as-is: `Modules.NOTIFICATION`, `Modules.FILE`, `Modules.INDEX`, `Modules.RBAC`, `Modules.TRANSLATION`.

**Package.json cleanup** — remove from `dependencies` in each file:

`integration-tests/modules/package.json`: remove `@medusajs/currency`, `@medusajs/fulfillment`, `@medusajs/fulfillment-manual`, `@medusajs/inventory`, `@medusajs/link-modules`, `@medusajs/payment`, `@medusajs/pricing`, `@medusajs/product`, `@medusajs/promotion`, `@medusajs/region`, `@medusajs/stock-location`, `@medusajs/store`, `@medusajs/tax`.

`integration-tests/http/package.json`: remove `@medusajs/fulfillment`, `@medusajs/fulfillment-manual`, `@medusajs/inventory`, `@medusajs/pricing`, `@medusajs/product`, `@medusajs/promotion`, `@medusajs/region`, `@medusajs/stock-location`, `@medusajs/store`, `@medusajs/tax`. Also remove `json-2-csv` from devDependencies.

`integration-tests/api/package.json`: remove `@medusajs/payment`, `@medusajs/pricing`, `@medusajs/product`, `@medusajs/promotion`, `@medusajs/region`, `@medusajs/store`, `@medusajs/tax`.

```bash
cd integration-tests && yarn install
```

- [ ] **Step 3: Refactor "Very Critical" framework tests — replace commerce test fixtures**

Each test below validates a real framework feature but uses commerce endpoints/entities as scaffolding. Replace with equivalent non-commerce entities (users, api-keys, translations, workflow-executions).

**Auth tests** — both `auth.spec.ts` and `auth-asymetric.spec.ts` call `.get("/admin/products?limit=1")` to verify the authenticated session works. Replace with a route that exists post-slice:
```bash
perl -pi -e 's|/admin/products\?limit=1|/admin/users?limit=1|g' \
  integration-tests/http/__tests__/auth/admin/auth.spec.ts \
  integration-tests/http/__tests__/auth/admin/auth-asymetric.spec.ts
```

**API-key tests** — `api-key.spec.ts` posts to `POST /admin/regions` (lines ~135, ~170, ~191) and `POST /admin/sales-channels` (lines ~212, ~259, ~321, ~387) to test API key associations. `publishable-key.spec.ts` creates two sales-channels and links them to a publishable key.
- Edit `integration-tests/http/__tests__/api-key/admin/api-key.spec.ts`: remove all `/admin/regions` and `/admin/sales-channels` calls; replace association tests with user creation (`POST /admin/users`) or keep api-key creation/revocation tests only (the non-association tests are already generic).
- Edit `integration-tests/http/__tests__/api-key/admin/publishable-key.spec.ts`: the sales-channel association test block (the one that creates `salesChannel1` and `salesChannel2`) has a comment saying it was replaced by a different endpoint — verify and remove the now-obsolete sales-channel association test block entirely.

**RBAC field filtering test** — imports `getProductFixture` from `../../../../helpers/fixtures` and creates RBAC policies with `resource: "product"`, `resource: "product_tag"`, `resource: "product_variant"`, and calls `/admin/products`. Extensive surgery:
- Edit `integration-tests/http/__tests__/rbac/admin/rbac-field-filtering.spec.ts`:
  1. Remove `getProductFixture` import; remove `baseProduct` variable
  2. Replace all policy resources: `"product"` → `"user"`, `"product_tag"` → `"api-key"`, `"product_variant"` → `"workflow-execution"`, `"price_set"` → `"notification"`, `"price"` → `"invite"`
  3. Replace all `POST /admin/products` calls with `GET /admin/users` or similar kept endpoint
  4. Replace field assertions (product fields) with user/api-key fields

**Translation test** — `translation.spec.ts` resolves `Modules.STORE` in `beforeEach` and calls `storeModule.listStores()` then `storeModule.updateStores()` to set `supported_locales`. The translation test data itself uses `reference: "product"` strings (not a Modules import, just string data — those are fine to keep as strings).
- Edit `integration-tests/http/__tests__/translation/admin/translation.spec.ts`:
  1. Remove `Modules.STORE` from the import and the two `appContainer.resolve(Modules.STORE)` / `storeModule.listStores()` / `storeModule.updateStores()` calls in `beforeEach`
  2. Replace the locale-seeding approach: resolve `Modules.TRANSLATION` directly and call `translationModule.__hooks?.onApplicationStart?.()` — the locale configuration that was in store is now in a different mechanism (check if the Translation module has a direct locale config in the test fixture config `__fixtures__/translation-test/medusa-config.ts`; if so, remove the store-based locale setup entirely)
  3. The test body uses `reference: "product"` / `reference_id: "prod_123"` as free-form strings — these are NOT imports and do NOT need changing (translation references are arbitrary strings)

**Translation-settings test** — `translation-settings.spec.ts` mocks `DmlEntity.getTranslatableEntities` to return `"ProductVariant"`, `"ProductCategory"`, `"ProductCollection"` entity name strings. Replace with generic names that exist post-slice:
```bash
perl -pi -e 's/"ProductVariant"/"User"/g; s/"ProductCategory"/"ApiKey"/g;
             s/"ProductCollection"/"Translation"/g;
             s/entity_type: "product_variant"/entity_type: "user"/g;
             s/entity_type: "product_category"/entity_type: "api_key"/g;
             s/entity_type: "product_collection"/entity_type: "translation"/g' \
  integration-tests/http/__tests__/translation/admin/translation-settings.spec.ts
```
Note: this test only uses `Modules.TRANSLATION` (no commerce module imports) — the only change is the mocked entity name strings.

**Views / columns test** — `columns.spec.ts` imports `createOrderSeeder` from `../../fixtures/order` (that file is deleted in Step 1) AND imports `setupTaxStructure` from `../../../../modules/__tests__/fixtures` (that fixture file uses `ITaxModuleService` — it stays). The test creates an order and asserts columns for the `orders` entity.
- Edit `integration-tests/http/__tests__/views/admin/columns.spec.ts`:
  1. Remove `import { createOrderSeeder } from "../../fixtures/order"` (file deleted)
  2. Remove `import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"` — and remove the `setupTaxStructure(...)` call in `beforeEach`
  3. Remove the `order` and `seeder` variables; remove the `beforeEach` block that calls `createOrderSeeder`
  4. Replace `GET /admin/views/orders/columns` with `GET /admin/views/users/columns` (or another kept entity); update all field assertions to match the user entity shape

**Module CRUD test** — `crud.methods.spec.ts` resolves the `brand` module (deleted in Step 1) and calls `createBrands()`. Replace with the `testingModule` fixture which is a generic DML entity module already registered in `acmekit-config.ts`:
- Edit `integration-tests/modules/__tests__/modules/crud.methods.spec.ts`:
  1. Replace `appContainer.resolve("brand")` with `appContainer.resolve("testingModule")`
  2. Replace `createBrands({name: "Medusa Brand"})` with the equivalent method on `testingModule` (check `integration-tests/modules/__tests__/__fixtures__/testing-module/services/module-service.ts` for the available methods — it has DML auto-generated CRUD for `DmlEntity`)
  3. Update all `brand` → `dmlEntity` (or whatever the testing module's entity is called) references

**Module remote-query test** — `remote-query.spec.ts` imports `RegionModule from "@medusajs/medusa/region"` and `CustomerModule from "@medusajs/medusa/customer"` (lines 3-4); resolves `Modules.REGION`; creates regions and queries them via remote query; calls `POST /admin/products` (line ~317) and `POST /admin/shipping-profiles` (line ~293).
- Edit `integration-tests/modules/__tests__/modules/remote-query.spec.ts`:
  1. Remove `import RegionModule from "@medusajs/medusa/region"` and `import CustomerModule from "@medusajs/medusa/customer"`
  2. Remove `regionModule: IRegionModuleService` variable and resolve; replace `regionModule.createRegions(...)` calls with `userModule.createUsers(...)` (resolve `Modules.USER`)
  3. Update remote query call: replace `region: { fields: [...] }` with `user: { fields: [...] }`
  4. Remove `POST /admin/products` and `POST /admin/shipping-profiles` calls; replace with `GET /admin/users`

**Module load-standalone helper** — `load-standalone.ts` is NOT a spec file but a standalone helper. It imports `IProductModuleService` and uses `Modules.PRODUCT`:
- Edit `integration-tests/modules/__tests__/modules/load-standalone.ts`:
  1. Replace `import { IProductModuleService }` with `import { IApiKeyModuleService }` from `@medusajs/types`
  2. Replace `Modules.PRODUCT` with `Modules.API_KEY`
  3. Replace `modules[Modules.API_KEY] as unknown as IApiKeyModuleService`
  4. Replace `product.listProducts()` with `apiKey.listApiKeys()`

**Workflow link test** — `common/workflows.spec.ts` creates a product and variant via `POST /admin/products` and `POST /admin/shipping-profiles`, then links product variant to inventory item via `createLinksWorkflow`. The test validates link compensation (rollback).
- Edit `integration-tests/modules/__tests__/common/workflows.spec.ts`:
  1. Remove the `product` and `variant` variables and the `beforeEach` block that creates them via API calls
  2. Replace the link test data: instead of `{[Modules.PRODUCT]: {variant_id}, [Modules.INVENTORY]: {inventory_item_id}}`, use a kept link — the two remaining link definitions are `invite-rbac-role.ts` and `user-rbac-role.ts`. Use user-rbac link: `{[Modules.USER]: {user_id}, [Modules.RBAC]: {rbac_role_id}}`
  3. Create test users + roles in `beforeEach` instead of products
  4. Replace inventory-item API calls with user/role API calls

**Defaults test** — `defaults.spec.ts` queries `entity: "store"` and `entity: "sales_channel"` and `entity: "api_key"`. After store and sales-channel slices, this test will have no valid store/sales_channel entities to query:
- Delete `integration-tests/modules/__tests__/defaults/defaults.spec.ts` — the test only validates commerce defaults (store + sales channel + publishable key on first run). After removing those modules there are no framework-level defaults to validate. If a replacement test is desired, write a new test that validates the only remaining defaults (e.g. admin user invite flow or workflow engine initialization).

**Index tests** — all three use products/brands populated via `/admin/shipping-profiles` + `/admin/products` API calls:
- `query-index.spec.ts`: replace `POST /admin/shipping-profiles` + `POST /admin/products` with `POST /admin/users` (bulk create users); replace product field assertions with user field assertions (`title` → `first_name`, `handle` → `email`, etc.); replace `CustomerModule` import with `Modules.USER`
- `search.spec.ts`: same as above — replace product population with user population; update all search assertions
- `sync.spec.ts`: same as above — replace product sync with user sync
- `http/__tests__/index/index.spec.ts`: the test asserts `response.data.metadata.length` is `7` and checks for `"Product"`, `"ProductVariant"`, `"LinkProductVariantPriceSet"`, `"Price"`, `"SalesChannel"`, `"LinkProductSalesChannel"`, `"PriceSet"` entities. After commerce module removal, these entities will not be indexed. Update to assert the correct post-slice entities (e.g. `"User"`, `"ApiKey"` etc.) and update the count to match the number of kept-module entities the index module is configured to track.

**Translation-test fixture links** — the 4 files deleted in Step 1 need a replacement so the `query-graph.ts` (also deleted) test infrastructure has a kept-module equivalent. Create a single replacement link for kept tests that need to demonstrate the link infrastructure:
```bash
cat > integration-tests/modules/__tests__/__fixtures__/translation-test/src/links/user-translation.ts << 'EOF'
import { defineLink } from "@medusajs/framework/utils"
import UserModule from "@medusajs/medusa/user"
import Translation from "../modules/translation"

export default defineLink(
  UserModule.linkable.user.id,
  Translation.linkable.translation.id
)
EOF
```

- [ ] **Step 4: Fix "Moderate" integration tests**

```bash
# http/__tests__/event-bus/subscriber-registration.spec.ts
# Imports PaymentWebhookEvents from @medusajs/utils — this enum is removed with the payment module.
# The test checks subscribersMap.get(PaymentWebhookEvents.WebhookReceived) — replace with a kept
# event enum. Check the worker-mode fixture's subscribers for what is actually registered:
# Replace the import and the event lookup:
perl -pi -e 's/PaymentWebhookEvents/UserEvents/g' \
  integration-tests/http/__tests__/event-bus/subscriber-registration.spec.ts
# Then manually update the import line to: import { composeMessage, Modules, UserEvents } from "@acmekit/utils"
# and verify that the worker-mode-server fixture registers a UserEvents subscriber
# (if not, remove the subscribersMap assertion block and keep only the emit/receive tests).

# http/__tests__/upload/admin/presigned-urls.spec.ts
# References a __fixtures__/products.csv file and uses "products.csv" as the filename.
# Only the filename string matters (the content is arbitrary CSV for upload testing).
# Rename the fixture file and update the path constant:
mv integration-tests/http/__tests__/upload/admin/__fixtures__/products.csv \
   integration-tests/http/__tests__/upload/admin/__fixtures__/data.csv 2>/dev/null || true
perl -pi -e 's/products\.csv/data.csv/g;
             s|__fixtures__/products\.csv|__fixtures__/data.csv|g' \
  integration-tests/http/__tests__/upload/admin/presigned-urls.spec.ts

# modules/__tests__/rbac/rbac-workflows.spec.ts
# Uses resource: "product", resource: "order", resource: "user" as string policy resource names.
# "product" and "order" resources will not exist post-slice, but the RBAC module only stores
# arbitrary strings — the test does NOT resolve a product module. These are string-only references
# that won't cause compile errors. However, for semantic correctness, replace commerce resource names:
perl -pi -e 's/resource: "product"/resource: "user"/g;
             s/resource: "order"/resource: "api-key"/g;
             s/key: "read:products"/key: "read:users"/g;
             s/key: "write:products"/key: "write:users"/g;
             s/key: "read:orders"/key: "read:api-keys"/g;
             s/key: "write:orders"/key: "write:api-keys"/g;
             s/name: "Read Products"/name: "Read Users"/g;
             s/name: "Write Products"/name: "Write Users"/g;
             s/name: "Read Orders"/name: "Read Api-keys"/g;
             s/name: "Write Orders"/name: "Write Api-keys"/g;
             s/description: "Permission to read products"/description: "Permission to read users"/g;
             s/description: "Permission to write products"/description: "Permission to write users"/g;
             s/description: "Permission to read orders"/description: "Permission to read api-keys"/g;
             s/description: "Permission to write orders"/description: "Permission to write api-keys"/g' \
  integration-tests/modules/__tests__/rbac/rbac-workflows.spec.ts
```

- [ ] **Step 5: Fix "Low" tests — update RBAC policy strings and notification string data**

These won't cause compile errors (string-only references) but will be semantically misleading:
```bash
# rbac-policies.spec.ts uses resource: "product" and resource: "order" as string policy data.
# rbac-roles.spec.ts has no commerce resource strings (confirmed clean).
# user.spec.ts uses resource: "product", "product_tag", "product_variant" in RBAC policy setup.
perl -pi -e 's/resource: "product"/resource: "user"/g;
             s/resource: "order"/resource: "api-key"/g;
             s/key: "read:products"/key: "read:users"/g;
             s/key: "write:products"/key: "write:users"/g;
             s/key: "read:orders"/key: "read:api-keys"/g;
             s/key: "write:orders"/key: "write:api-keys"/g;
             s/name: "Read Products"/name: "Read Users"/g;
             s/name: "Write Products"/name: "Write Users"/g;
             s/name: "Full product access"/name: "Full user access"/g;
             s/description: "Can view products"/description: "Can view users"/g;
             s/description: "Can edit products"/description: "Can edit users"/g;
             s/description: "Permission to read products"/description: "Permission to read users"/g;
             s/description: "Permission to write products"/description: "Permission to write users"/g;
             s/resource_type: "product_tag"/resource_type: "api_key"/g;
             s/resource: "product_tag"/resource: "api-key"/g;
             s/resource: "product_variant"/resource: "workflow-execution"/g' \
  integration-tests/http/__tests__/rbac/admin/rbac-policies.spec.ts \
  integration-tests/http/__tests__/user/admin/user.spec.ts

# Notification test — trigger_type and template strings reference "order-created", "product-created".
# These are arbitrary string identifiers; the test does NOT resolve a commerce module.
# Update for semantic correctness:
perl -pi -e 's/trigger_type: "order-created"/trigger_type: "user-created"/g;
             s/template: "order-created"/template: "user-created"/g;
             s/resource_type: "order"/resource_type: "user"/g;
             s/resource_id: "order-id"/resource_id: "user-id"/g;
             s/trigger_type: "product-created"/trigger_type: "api-key-created"/g;
             s/template: "product-created"/template: "api-key-created"/g;
             s|channel: .email.|channel: "log"|g' \
  integration-tests/modules/__tests__/notification/admin/notification.spec.ts
# (Review manually — some string assertions reference the template name in expect() calls)
```

**RBAC match-endpoint-entities test** — `rbac-match-endpoint-entities.spec.ts` auto-discovers admin endpoint entities by scanning `packages/medusa/src/api/admin/*/query-config.ts` files and comparing them against `PolicyResource` enum values. After commerce slices remove `admin/products`, `admin/orders`, etc., the test will discover FEWER entities — but as long as remaining endpoint entities are all present in `PolicyResource`, `missingInPolicies` will be empty and the test will pass. **No refactoring needed** — this test is self-adaptive.

However, if the `PolicyResource` enum in `packages/core/utils/src/common/policy-resource.ts` still contains commerce entities (e.g. `PRODUCT = "product"`) after slices, those will be in `policyResourceEntities` but not in `adminEndpointEntities` — that is fine (the assertion only checks the other direction). The test will pass without changes as long as the API is consistent. Mark as KEEP-CLEAN.

- [ ] **Step 6: Clean shared fixture helpers**

```bash
# helpers/fixtures.ts — contains ONLY getProductFixture() and getPricelistFixture(), both typed
# with HttpTypes.AdminCreateProduct / AdminCreatePriceList which will be gone.
# The file has no kept exports. Delete entirely:
rm integration-tests/helpers/fixtures.ts

# Verify no kept file imports from fixtures.ts after Step 3 cleanup:
grep -r "from.*helpers/fixtures\|getProductFixture\|getPricelistFixture" \
  integration-tests/ --include="*.ts" | grep -v node_modules
# Expected: 0 results (rbac-field-filtering.spec.ts removes the import in Step 3)

# helpers/seed-storefront-defaults.ts — resolves Modules.REGION and Modules.STORE.
# This helper is imported by 3 files (all in cart/): cart.workflows.spec.ts, carts.spec.ts,
# and cart.completion.ts — ALL of which are deleted in the slice steps.
# After slice deletion, 0 kept files import seed-storefront-defaults.ts. Delete:
rm integration-tests/helpers/seed-storefront-defaults.ts

# modules/__tests__/fixtures/index.ts — re-exports from ./tax and ./fulfillment.
# setupTaxStructure (from ./tax) is imported by the deleted order/cart/promotion/exchange
# spec files AND by http/__tests__/views/admin/columns.spec.ts (that import is removed in Step 3).
# setupFullDataFulfillmentStructure (from ./fulfillment) is imported by
# modules/__tests__/fulfillment/index.spec.ts (a DELETE-in-slice file).
# After all slice deletions and Step 3 cleanup, verify 0 kept tests import from this file:
grep -r "from.*modules/__tests__/fixtures\|setupTaxStructure\|setupFullDataFulfillmentStructure" \
  integration-tests/ --include="*.ts" | grep -v node_modules
# If 0 results: delete the fixtures directory
# rm -rf integration-tests/modules/__tests__/fixtures/
```

- [ ] **Step 7: Run integration test suite to verify**

```bash
# Modules integration tests:
yarn test:integration:modules 2>&1 | tail -30

# HTTP integration tests (kept tests only):
yarn test:integration:http 2>&1 | tail -30
```

Expected: 0 compile errors, 0 test failures from commerce references.

- [ ] **Commit:** `git commit -m "chore(acmekit): integration test surgery — refactor framework tests off commerce fixtures, delete link-module tests"`

---

### Task 30: String-level branding cleanup

**Spec reference:** Section 9

- [ ] **Step 1: Admin dashboard i18n translations**

```bash
find packages/admin/dashboard/src/i18n/translations/ -name "*.json" \
  -exec perl -pi -e 's/Medusa Admin/AcmeKit Admin/g; s/Medusa API/AcmeKit API/g; s/"Medusa"/"AcmeKit"/g' {} +
```

- [ ] **Step 2: Admin dashboard components + HTML title**

```bash
# Fix index.html <title> (not a .ts/.tsx file — glob must include .html):
perl -pi -e 's/<title>Medusa Admin<\/title>/<title>AcmeKit Admin<\/title>/g' \
  packages/admin/dashboard/index.html

# Fix branding strings in dashboard TS/TSX source:
grep -rn "Medusa\|medusa" packages/admin/dashboard/src --include="*.tsx" --include="*.ts" \
  -l | grep -v node_modules | grep -v __tests__
# For each file: replace branding strings (login page, sidebar header, meta tags)

# Fix user-facing farewell message + URL in main package develop command:
perl -pi -e 's/Thanks for using Medusa\./Thanks for using AcmeKit./g;
             s|https://medusajs\.com/star|https://acmekit.dev/star|g' \
  packages/medusa/src/commands/develop.ts
```

- [ ] **Step 2b: Design-system source file strings (stories, JSDoc, spec constants)**

These are NOT caught by the namespace rename (not `@medusajs/` patterns) and NOT by the symbol rename (not class/type names):

```bash
# Storybook story files — user-visible labels and example code:
perl -pi -e 's/label: "Medusa JS Client"/label: "AcmeKit JS Client"/g;
             s/label: "Medusa React"/label: "AcmeKit React"/g;
             s/`medusa develop\\n/`acmekit develop\\n/g' \
  packages/design-system/ui/src/components/code-block/code-block.stories.tsx

perl -pi -e 's/\bMedusa is a headless/AcmeKit is a headless/g;
             s/\bMedusa data model/AcmeKit data model/g;
             s/medusa-config\.js/acmekit-config.js/g' \
  packages/design-system/ui/src/components/inline-tip/inline-tip.stories.tsx

# JSDoc comment in data-table.tsx (visible in IDE hover + generated docs):
perl -pi -e 's/the Medusa Admin dashboard/the AcmeKit Admin dashboard/g' \
  packages/design-system/ui/src/blocks/data-table/data-table.tsx

# Test constant in use-prompt.spec.tsx (internal consistency):
perl -pi -e 's/"medusa-design-system"/"acmekit-design-system"/g' \
  packages/design-system/ui/src/hooks/use-prompt/use-prompt.spec.tsx

# www/apps/ui OG image URL contains "Medusa%20Resources" — this is a Cloudinary-hosted asset.
# It CANNOT be changed by code alone (requires uploading a new image to Cloudinary).
# ACTION REQUIRED: Replace the OG image in www/apps/ui/app/layout.tsx:
#   Current:  https://res.cloudinary.com/dza7lstvk/.../Medusa%20Resources/opengraph-image_daq6nx.jpg
#   Required: Upload new AcmeKit branded OG image and update the URL in layout.tsx
grep -n "Medusa%20Resources\|cloudinary" www/apps/ui/app/layout.tsx
```

- [ ] **Step 3: CLI hardcoded strings (create-acmekit-app + acmekit-cli + acmekit-dev-cli)**

These files contain concrete hardcoded Medusa strings that a generic "s/Medusa/AcmeKit/g" won't cover correctly:

```bash
# create-acmekit-app — config store key (used as OS keychain entry name):
perl -pi -e "s/ConfigStore\('medusa'/ConfigStore('acmekit'/g; \
             s/configstore\.name.*medusa/configstore.name: 'acmekit'/g" \
  packages/cli/create-acmekit-app/src/utils/get-config-store.ts

# create-acmekit-app — starter template repo URL + default admin email + docs CORS URL:
perl -pi -e "s|medusajs/medusa-starter-default|acmekit/acmekit-starter-default|g; \
             s|medusajs/medusa-starter-plugin|acmekit/acmekit-starter-plugin|g; \
             s|admin\@medusa-test\.com|admin\@acmekit-test.com|g; \
             s|docs\.medusajs\.com|docs.acmekit.dev|g" \
  packages/cli/create-acmekit-app/src/utils/clone-repo.ts \
  packages/cli/create-acmekit-app/src/utils/prepare-project.ts

# create-acmekit-app — generated .env content: env var names written into new project .env files:
# prepare-project.ts writes NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY into the storefront's .env
perl -pi -e 's/NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY/NEXT_PUBLIC_ACMEKIT_PUBLISHABLE_KEY/g' \
  packages/cli/create-acmekit-app/src/utils/prepare-project.ts

# acmekit-cli — config store key, error/version message strings:
perl -pi -e "s/ConfigStore\('medusa'/ConfigStore('acmekit'/g; \
             s/isLocalMedusaProject/isLocalAcmeKitProject/g; \
             s/inMedusaProject/inAcmeKitProject/g; \
             s/Medusa project/AcmeKit project/g; \
             s/Medusa CLI version/AcmeKit CLI version/g; \
             s/Medusa version/AcmeKit version/g" \
  \$(find packages/cli/acmekit-cli/src/ -name "*.ts" | grep -v node_modules)

# Catch any remaining "medusa\|Medusa" strings in all CLI packages:
grep -rl "medusa\|Medusa" packages/cli/ --include="*.ts" | \
  grep -v node_modules | grep -v "\.spec\.\|\.test\." | \
  xargs perl -pi -e 's/\bMedusa\b/AcmeKit/g; s/\bmedusa\b/acmekit/g' || true
```

- [ ] **Step 4: package.json metadata — all packages + www (names, descriptions, repository URLs)**

```bash
# Update repository URL references (medusajs/medusa → acmekit/acmekit):
find packages/ www/utils/ www/packages/ www/apps/ -name "package.json" \
  -not -path "*/node_modules/*" \
  -exec perl -pi -e 's|medusajs/medusa\b|acmekit/acmekit|g;
                     s|medusajs\.com|acmekit.dev|g;
                     s|medusajs/medusa\.git|acmekit/acmekit.git|g' {} +

# Update package description fields that contain "Medusa":
# (e.g. "Telemetry for Medusa", "Medusa UI React icon library", "Medusa UI preset")
find packages/ www/utils/ www/packages/ www/apps/ -name "package.json" \
  -not -path "*/node_modules/*" \
  -exec perl -pi -e 's/"description": "Telemetry for Medusa"/"description": "Telemetry for AcmeKit"/g;
                     s/Medusa UI /AcmeKit UI /g;
                     s/for Medusa\b/for AcmeKit/g' {} +
```

- [ ] **Step 5: Root + design-system documentation files**

```bash
# Root docs:
perl -pi -e 's/\bMedusa\b/AcmeKit/g; s/\bmedusajs\b/acmekit/g; s/medusajs\.com/acmekit\.dev/g' \
  README.md CONTRIBUTING.md SECURITY.md

# Design-system package READMEs (not covered by root glob above):
find packages/design-system/ -name "README.md" -not -path "*/node_modules/*" | \
  xargs perl -pi -e 's/\bMedusa\b/AcmeKit/g; s/\bmedusajs\b/acmekit/g; s/medusajs\.com/acmekit\.dev/g;
                     s/medusajs\.svg/acmekit.svg/g; s/Follow%20\@medusajs/Follow%20\@acmekit/g'
```

- [ ] **Step 6: GitHub Actions workflow hardcoded strings (beyond MEDUSA_* env vars)**

The `.github/workflows/` files contain hardcoded non-env-var medusa references not caught by the Section 16.3 bulk rename:
```bash
# Binary name in test-cli-with-database.yml (npx medusa → npx acmekit, medusa new → acmekit new, etc.):
perl -pi -e 's/npx medusa\b/npx acmekit/g; s/medusa new\b/acmekit new/g;
             s/medusa develop\b/acmekit develop/g; s/medusa start\b/acmekit start/g;
             s/medusa user\b/acmekit user/g; s|@medusajs/cli|@acmekit/cli|g' \
  .github/workflows/test-cli-with-database.yml
# GIT_REPO references in generate-public-references.yml:
perl -pi -e 's/GIT_REPO: medusa/GIT_REPO: acmekit/g; s/yarn up:medusa/yarn up:acmekit/g' \
  .github/workflows/generate-public-references.yml
# Hardcoded Vercel/GitHub org URLs (update to acmekit domains once decided; for now flag only):
grep -n "medusa-docs\.vercel\|medusajs/staging\|medusajs/engineering\|orgs/medusajs" \
  .github/workflows/*.yml
# ^ Review the above hits manually — external org/URL references need human decision on final values.
```

- [ ] **Step 6b: GitHub issue templates**

```bash
# .github/ISSUE_TEMPLATE/bug_report.md — prose and GitHub link:
perl -pi -e 's/improve Medusa/improve AcmeKit/g;
             s/Medusa version/AcmeKit version/g;
             s|medusajs/medusa/blob/master/CONTRIBUTING|acmekit/acmekit/blob/main/CONTRIBUTING|g' \
  .github/ISSUE_TEMPLATE/bug_report.md

# .github/ISSUE_TEMPLATE/docs.yml — "Medusa maintainers" and version label:
perl -pi -e 's/Medusa maintainers/AcmeKit maintainers/g;
             s/What Medusa version/What AcmeKit version/g' \
  .github/ISSUE_TEMPLATE/docs.yml

# .github/FUNDING.yml — GitHub sponsor org:
perl -pi -e 's/github: \[ medusajs \]/github: [ acmekit ]/g' \
  .github/FUNDING.yml
```

- [ ] **Step 7: Runtime string constants in core packages and kept modules**

These are hardcoded string values used at runtime — not symbol names, not `@medusajs/` imports — and are NOT caught by any of the bulk rename passes:

```bash
# packages/core/utils/src/common/define-config.ts
# "medusa-cloud" execution context string + "medusa-sessions" DynamoDB table default:
perl -pi -e 's/"medusa-cloud"/"acmekit-cloud"/g;
             s/"medusa-sessions"/"acmekit-sessions"/g' \
  packages/core/utils/src/common/define-config.ts

# packages/core/modules-sdk/src/medusa-app.ts
# "medusa" passed as DB schema name to loadDatabaseConfig:
perl -pi -e 's/loadDatabaseConfig\(\s*"medusa"/loadDatabaseConfig("acmekit"/g' \
  packages/core/modules-sdk/src/medusa-app.ts

# packages/core/utils/src/common/get-resolved-plugins.ts
# .medusa/ build-output directory paths + MEDUSA_PROJECT_NAME constant value:
perl -pi -e 's|"\.medusa/server/src"|".acmekit/server/src"|g;
             s|"\.medusa/server/medusa-plugin-options\.json"|".acmekit/server/acmekit-plugin-options.json"|g;
             s/"project-plugin"/"project-plugin"/g' \
  packages/core/utils/src/common/get-resolved-plugins.ts
# (MEDUSA_APP_SOURCE_PATH / MEDUSA_PLUGIN_SOURCE_PATH const names are caught by MEDUSA_* bulk rename)

# packages/modules/cache-redis/src/services/redis-cache.ts
# Redis namespace prefix:
perl -pi -e 's/const DEFAULT_NAMESPACE = "medusa"/const DEFAULT_NAMESPACE = "acmekit"/g' \
  packages/modules/cache-redis/src/services/redis-cache.ts

# packages/modules/workflow-engine-redis/src/loaders/redis.ts
# Default Redis queue names (also update JSDoc in types/index.ts):
perl -pi -e 's/"medusa-workflows"/"acmekit-workflows"/g;
             s/"medusa-workflows-jobs"/"acmekit-workflows-jobs"/g' \
  packages/modules/workflow-engine-redis/src/loaders/redis.ts \
  packages/modules/workflow-engine-redis/src/types/index.ts

# packages/modules/providers/caching-redis/src/loaders/connection.ts
# Redis connection name:
perl -pi -e 's/"medusa-cache-redis"/"acmekit-cache-redis"/g' \
  packages/modules/providers/caching-redis/src/loaders/connection.ts

# packages/modules/providers/locking-redis/ — lock key prefix:
perl -pi -e 's/"medusa_lock:"/"acmekit_lock:"/g' \
  packages/modules/providers/locking-redis/src/loaders/index.ts \
  packages/modules/providers/locking-redis/src/services/redis-lock.ts

# packages/core/framework/src/build-tools/compiler.ts + related files
# .medusa/ build output paths (user-visible directory names in built projects):
grep -rl '\.medusa/' packages/ --include="*.ts" \
  | grep -v "node_modules\|/dist/\|\.spec\.\|\.test\.\|draft-order" \
  | xargs perl -pi -e 's|"\.medusa/|".acmekit/|g; s|"\.medusa/|".acmekit/|g;
                       s|= "\.medusa/|= ".acmekit/|g;
                       s|\`\.medusa/|`.acmekit/|g;
                       s|"\.medusa"|".acmekit"|g' || true

# packages/medusa-test-utils/src/medusa-test-runner.ts
# DB name prefix string literal:
perl -pi -e 's/`medusa-\$\{moduleName/`acmekit-${moduleName/g' \
  packages/medusa-test-utils/src/medusa-test-runner.ts

# packages/admin/admin-bundler/src/ — Vite plugin name strings, DOM id, build dir path, error message:
perl -pi -e 's/name: "medusa:clear-plugin-build"/name: "acmekit:clear-plugin-build"/g' \
  packages/admin/admin-bundler/src/plugins/clear-plugin-build.ts
perl -pi -e 's/name: "medusa:inject-tailwindcss"/name: "acmekit:inject-tailwindcss"/g' \
  packages/admin/admin-bundler/src/plugins/inject-tailwindcss.ts
perl -pi -e 's/name: "medusa:write-static-files"/name: "acmekit:write-static-files"/g' \
  packages/admin/admin-bundler/src/plugins/write-static-files.ts
perl -pi -e 's/getElementById\("medusa"\)/getElementById("acmekit")/g;
             s|id="medusa"|id="acmekit"|g;
             s|"\.medusa/client"|".acmekit/client"|g' \
  packages/admin/admin-bundler/src/utils/write-static-files.ts \
  packages/admin/admin-bundler/src/utils/config.ts
perl -pi -e "s|'medusa build'|'acmekit build'|g" \
  packages/admin/admin-bundler/src/commands/serve.ts

# packages/medusa/src/loaders/admin.ts — error message referencing 'medusa-config.js':
perl -pi -e "s/'medusa-config\.js'/'acmekit-config.js'/g" \
  packages/medusa/src/loaders/admin.ts
```

- [ ] **Step 8: JSDoc code-example strings in core types and utils**

These strings appear inside TSDoc `/** ... */` comment blocks and are user-visible in IDE hover docs and generated API reference. They are NOT caught by the `MEDUSA_*` bulk rename (they are lowercase/mixed-case strings inside comments, not constants):

```bash
# packages/core/types/src/common/config-module.ts
# JSDoc code examples: filename in code fence titles, "medusa-store" DB name example,
# "medusa:" Redis prefix example, JWT issuer/keyid example values:
perl -pi -e 's/title="medusa-config\.ts"/title="acmekit-config.ts"/g;
             s/title="medusa-config\.js"/title="acmekit-config.js"/g;
             s/"medusa-store"/"acmekit-store"/g;
             s/redisPrefix.*"medusa:"/redisPrefix: process.env.REDIS_URL || "acmekit:"/g;
             s/issuer: "medusa"/issuer: "acmekit"/g;
             s/keyid: "medusa"/keyid: "acmekit"/g;
             s|postgres://postgres\@localhost/medusa-store|postgres://postgres@localhost/acmekit-store|g' \
  packages/core/types/src/common/config-module.ts

# packages/core/utils/src/auth/abstract-auth-provider.ts
# JSDoc links to old docs URL:
perl -pi -e 's|https://docs\.medusajs\.com/resources/commerce-modules/auth/|https://docs.acmekit.dev/resources/application-modules/auth/|g' \
  packages/core/utils/src/auth/abstract-auth-provider.ts

# packages/core/utils/src/search/abstract-service.ts
# JSDoc prose and links:
perl -pi -e 's|https://docs\.medusajs\.com/plugins/search/meilisearch|https://docs.acmekit.dev/resources/infrastructure-modules|g;
             s|https://docs\.medusajs\.com/api/store#|https://docs.acmekit.dev/api/client#|g;
             s/In the Medusa backend/In the AcmeKit backend/g' \
  packages/core/utils/src/search/abstract-service.ts

# Design-system test files — medusajs.com URLs in test fixtures:
perl -pi -e 's|https://www\.medusajs\.com|https://www.acmekit.dev|g' \
  packages/design-system/ui/src/components/button/button.spec.tsx \
  packages/design-system/ui/src/components/icon-button/icon-button.spec.tsx

# Catch-all: remaining "Medusa" prose in TSDoc comments across kept .ts packages/
# (covers phrases like "the Medusa application", "the Medusa backend", "Medusa generates",
#  "Medusa service", "a Medusa service" — NOT symbol names which ts-morph handles):
grep -rl "\bMedusa\b" \
  packages/core/framework/src/ packages/core/utils/src/ packages/core/types/src/ \
  packages/core/modules-sdk/src/ packages/core/workflows-sdk/src/ \
  packages/modules/auth/src/ packages/modules/notification/src/ \
  packages/modules/file/src/ packages/modules/customer/src/ \
  packages/modules/user/src/ packages/modules/api-key/src/ \
  packages/modules/analytics/src/ packages/modules/providers/ \
  --include="*.ts" \
  | grep -v "node_modules\|/dist/\|\.spec\.\|\.test\." \
  | xargs perl -pi -e '
    # Only replace "Medusa" in comment lines (// or * prefix) and string literals
    # to avoid breaking symbol names in code lines
    s|(\s*(?://|\*)[^\n]*)\bMedusa application\b|${1}AcmeKit application|g;
    s|(\s*(?://|\*)[^\n]*)\bMedusa backend\b|${1}AcmeKit backend|g;
    s|(\s*(?://|\*)[^\n]*)\bMedusa generates\b|${1}AcmeKit generates|g;
    s|(\s*(?://|\*)[^\n]*)\bMedusa service\b|${1}AcmeKit service|g;
    s|(\s*(?://|\*)[^\n]*)\bMedusa core\b|${1}AcmeKit core|g;
    s|(\s*(?://|\*)[^\n]*)\bMedusa Cloud\b|${1}AcmeKit Cloud|g;
    s|(\s*(?://|\*)[^\n]*)https://docs\.medusajs\.com|${1}https://docs.acmekit.dev|g;
  ' 2>/dev/null || true

- [ ] **Step 9: www/packages/tailwind CSS color token rename (medusa → acmekit)**

The `www/packages/tailwind/base.tailwind.config.js` defines a Tailwind color key named `medusa:` which generates `bg-medusa-*`, `text-medusa-*`, `border-medusa-*`, etc. CSS utility classes. These are used in 222+ `.tsx` files across `www/packages/docs-ui/`. The key must be renamed from `medusa` to `acmekit`, then all usages updated:

```bash
# 1. Rename the color key in base.tailwind.config.js:
perl -pi -e 's/^        medusa: \{/        acmekit: {/g' \
  www/packages/tailwind/base.tailwind.config.js

# 2. Update all Tailwind class usages in www/packages/docs-ui/ src:
grep -rl "bg-medusa-\|text-medusa-\|border-medusa-\|ring-medusa-\|fill-medusa-\|shadow-medusa-\|from-medusa-\|to-medusa-\|via-medusa-\|hover:bg-medusa-\|hover:text-medusa-\|hover:border-medusa-\|focus:ring-medusa-\|\[&.*medusa-" \
  www/packages/docs-ui/src/ www/apps/ --include="*.tsx" --include="*.ts" \
  | grep -v node_modules | grep -v "/dist/" \
  | xargs perl -pi -e '
    s/\bbg-medusa-/bg-acmekit-/g;
    s/\btext-medusa-/text-acmekit-/g;
    s/\bborder-medusa-/border-acmekit-/g;
    s/\bring-medusa-/ring-acmekit-/g;
    s/\bfill-medusa-/fill-acmekit-/g;
    s/\bfrom-medusa-/from-acmekit-/g;
    s/\bto-medusa-/to-acmekit-/g;
    s/\bvia-medusa-/via-acmekit-/g;
    s/hover:bg-medusa-/hover:bg-acmekit-/g;
    s/hover:text-medusa-/hover:text-acmekit-/g;
    s/hover:border-medusa-/hover:border-acmekit-/g;
    s/focus:ring-medusa-/focus:ring-acmekit-/g;
    s/medusa-bg-/acmekit-bg-/g;
    s/medusa-fg-/acmekit-fg-/g;
    s/medusa-border-/acmekit-border-/g;
    s/medusa-tag-/acmekit-tag-/g;
    s/medusa-button-/acmekit-button-/g;
    s/medusa-contrast-/acmekit-contrast-/g;
    s/medusa-code-/acmekit-code-/g;
  ' || true

# 3. Verify no bg-medusa-* remain:
grep -rl "bg-medusa-\|text-medusa-\|border-medusa-" \
  www/packages/docs-ui/src/ --include="*.tsx" | wc -l
# Expected: 0
```

- [ ] **Step 10: www/packages/docs-ui constants, AI assistant, and npx-to-yarn JSDoc**

```bash
# www/packages/docs-ui/src/constants.tsx — nav link titles, paths, GitHub URL:
perl -pi -e 's|title: "Medusa Container"|title: "AcmeKit Container"|g;
             s|link: "/learn/fundamentals/medusa-container"|link: "/learn/fundamentals/acmekit-container"|g;
             s|title: "create-medusa-app"|title: "create-acmekit-app"|g;
             s|link: "/resources/create-medusa-app"|link: "/resources/create-acmekit-app"|g;
             s|title: "Medusa CLI"|title: "AcmeKit CLI"|g;
             s|link: "/resources/medusa-cli"|link: "/resources/acmekit-cli"|g;
             s|title: "Medusa UI"|title: "AcmeKit UI"|g;
             s|link: "/resources/medusa-container-resources"|link: "/resources/acmekit-container-resources"|g;
             s|link: "/resources/medusa-workflows-reference"|link: "/resources/acmekit-workflows-reference"|g;
             s|medusajs/medusa/issues/new|acmekit/acmekit/issues/new|g' \
  www/packages/docs-ui/src/constants.tsx

# www/packages/docs-ui/src/providers/AiAssistant/index.tsx — suggested question strings:
perl -pi -e 's/What is Medusa\?/What is AcmeKit?/g;
             s/with Medusa\?/with AcmeKit?/g;
             s/the Medusa documentation/the AcmeKit documentation/g' \
  www/packages/docs-ui/src/providers/AiAssistant/index.tsx

# www/packages/docs-ui/src/utils/npx-to-yarn.ts — JSDoc example strings:
perl -pi -e 's/npx medusa /npx acmekit /g;
             s/create-medusa-app/create-acmekit-app/g;
             s/--db-url postgres:\/\/localhost\/medusa/--db-url postgres:\/\/localhost\/acmekit/g' \
  www/packages/docs-ui/src/utils/npx-to-yarn.ts
```

- [ ] **Step 11: www/apps/api-reference branding**

```bash
# www/apps/api-reference/config/index.ts — page title suffix and description:
perl -pi -e 's/titleSuffix: "Medusa API Reference"/titleSuffix: "AcmeKit API Reference"/g;
             s/Medusa'\''s API routes/AcmeKit'\''s API routes/g' \
  www/apps/api-reference/config/index.ts

# www/apps/api-reference/app/layout.tsx — OG image (Cloudinary-hosted; requires new asset upload):
# ACTION REQUIRED: Upload new AcmeKit branded OG image to Cloudinary and update URL in:
#   www/apps/api-reference/app/layout.tsx
grep -n "Medusa%20Resources\|cloudinary" www/apps/api-reference/app/layout.tsx
```

- [ ] **Step 12: www/apps/resources layout, not-found, and next.config.mjs remaining redirects**

```bash
# www/apps/resources/app/layout.tsx — OG image (same Cloudinary asset as ui/book):
# ACTION REQUIRED: Upload new AcmeKit branded OG image and update URL.
grep -n "Medusa%20Resources" www/apps/resources/app/layout.tsx

# www/apps/resources/app/not-found.mdx — prose and GitHub link:
perl -pi -e 's/Medusa v1 documentation/AcmeKit v1 documentation/g;
             s|medusajs/medusa/issues/new|acmekit/acmekit/issues/new|g;
             s|docs\.medusajs\.com/v1|docs.acmekit.dev/v1|g' \
  www/apps/resources/app/not-found.mdx

# www/apps/resources/next.config.mjs — remaining path redirects not yet covered:
perl -pi -e 's|/medusa-cli/commands/start-cluster|/acmekit-cli/commands/start-cluster|g;
             s|/medusa-cli/commands/start\b|/acmekit-cli/commands/start|g;
             s|deployment/medusa-application|deployment/acmekit-application|g' \
  www/apps/resources/next.config.mjs

# www/apps/resources/app/test-tools-reference/page.mdx — title prose:
perl -pi -e 's/Medusa'\''s Testing Framework Reference/AcmeKit'\''s Testing Framework Reference/g' \
  www/apps/resources/app/test-tools-reference/page.mdx
```

- [ ] **Step 13: www/apps/book + www/apps/resources bulk medusa-config prose rename in MDX**

The kept book and resources MDX pages contain hundreds of occurrences of `medusa-config.ts` and `medusa.config.ts` as filename strings inside code-block `title=` attributes and prose. These are NOT caught by the `medusa-config` directory rename (which renames a URL path). All prose/code-block instances must also be renamed:

```bash
# www/apps/book/app/ — all kept MDX pages:
find www/apps/book/app/ -name "*.mdx" \
  | xargs perl -pi -e '
    s/medusa-config\.ts/acmekit-config.ts/g;
    s/medusa-config\.js/acmekit-config.js/g;
    s/medusa\.config\.ts/acmekit.config.ts/g;
    s/\bMedusa application\b/AcmeKit application/g;
    s/\bMedusa container\b/AcmeKit container/g;
    s/\bMedusa Container\b/AcmeKit Container/g;
    s|/learn/fundamentals/medusa-container|/learn/fundamentals/acmekit-container|g;
    s|docs\.medusajs\.com|docs.acmekit.dev|g;
    s|medusajs/medusa\b|acmekit/acmekit|g;
    s/\bMedusa\b/AcmeKit/g;
  ' || true

# www/apps/resources/app/ — all kept MDX pages (storefront-development/ and nextjs-starter/ will be deleted;
# only rename in KEPT directories):
find www/apps/resources/app/ -name "*.mdx" \
  -not -path "*/storefront-development/*" \
  -not -path "*/nextjs-starter/*" \
  -not -path "*/commerce-modules/*" \
  -not -path "*/recipes/*" \
  | xargs perl -pi -e '
    s/medusa-config\.ts/acmekit-config.ts/g;
    s/medusa-config\.js/acmekit-config.js/g;
    s/medusa\.config\.ts/acmekit.config.ts/g;
    s/\bMedusa\b/AcmeKit/g;
    s|docs\.medusajs\.com|docs.acmekit.dev|g;
    s|medusajs/medusa\b|acmekit/acmekit|g;
  ' || true
```

> **Note:** The `medusa-config` **directory** rename (URL path) is handled in Task 23 Step 5b. This step handles the `medusa-config.ts` **filename string** appearing in code-block titles and prose within MDX files.

- [ ] **Step 14: TypeDoc reference config cleanup**

```bash
# www/utils/packages/typedoc-generate-references/src/constants/custom-options.ts
# "medusa" key, tsConfigName, name, jsonFileName, and source path:
perl -pi -e 's/  medusa: getOptions\(/  acmekit: getOptions(/g;
             s/tsConfigName: "medusa\.json"/tsConfigName: "acmekit.json"/g;
             s/name: "medusa"/name: "acmekit"/g;
             s/jsonFileName: "0-medusa"/jsonFileName: "0-acmekit"/g;
             s|packages", "medusa", "src"|packages", "acmekit", "src"|g' \
  www/utils/packages/typedoc-generate-references/src/constants/custom-options.ts

# (medusa.ts merger config file rename is already covered in Task 23 Step 4)
```

- [ ] **Commit:** `git commit -m "chore(acmekit): string-level branding cleanup — Medusa → AcmeKit"`

---

## Chunk 6: Namespace Rename, Symbol Rename, Final Verification & Scaffold Cleanup

---

### Task 31: Namespace rename `@medusajs/*` → `@acmekit/*`

**Spec reference:** Section 15

> ⚠️ This is a large-blast-radius change. Do on a dedicated branch. Run `tsc --noEmit` before and after.

- [ ] **Step 1: Create namespace-rename branch and capture pre-rename baseline**

```bash
git checkout develop
git checkout -b feat/namespace-rename
npx tsc --noEmit --project tsconfig.json 2>&1 | grep -c "error TS" || true
```

- [ ] **Step 2: jscodeshift — update TS/TSX import declarations (spec 15.1)**

```bash
npx jscodeshift -t scripts/codemods/rename-namespace.ts \
  --extensions=ts,tsx --parser=tsx --ignore-pattern="**/node_modules/**" \
  packages/ www/
```

- [ ] **Step 3: tsconfig path aliases (spec 15.1)**

```bash
find . -name "tsconfig*.json" -not -path "*/node_modules/*" \
  -exec perl -pi -e 's/\@medusajs\//@acmekit\//g' {} +
```

- [ ] **Step 4: Non-TS files (spec 15.1)**

```bash
grep -rl "@medusajs/" \
  --include="*.json" --include="*.md" --include="*.mdx" \
  --include="*.yml" --include="*.yaml" --include="*.mjs" --include="*.sh" \
  --exclude-dir=node_modules . | \
  xargs perl -pi -e 's/\@medusajs\//@acmekit\//g'
```

- [ ] **Step 5: Rename CLI packages, main package directory, test-utils, and oas (spec 15.2)**

```bash
mv packages/cli/create-medusa-app packages/cli/create-acmekit-app
mv packages/cli/medusa-cli packages/cli/acmekit-cli
mv packages/cli/medusa-dev-cli packages/cli/acmekit-dev-cli
mv packages/medusa packages/acmekit
# Rename test-utils and telemetry directories:
mv packages/medusa-test-utils packages/acmekit-test-utils
mv packages/medusa-telemetry packages/acmekit-telemetry
# Rename oas CLI packages (packages/cli/oas/ contains medusa-oas-cli and oas-github-ci):
[ -d packages/cli/oas/medusa-oas-cli ] && mv packages/cli/oas/medusa-oas-cli packages/cli/oas/acmekit-oas-cli
# Update oas-cli package.json name + bin:
[ -f packages/cli/oas/acmekit-oas-cli/package.json ] && \
  perl -pi -e 's/medusa-oas-cli/acmekit-oas-cli/g; s/medusa-oas/acmekit-oas/g' \
    packages/cli/oas/acmekit-oas-cli/package.json
# Update medusa-dev-cli package.json name + bin (not @-scoped, not caught by namespace jscodeshift):
perl -pi -e 's/"name": "medusa-dev-cli"/"name": "acmekit-dev-cli"/g;
             s/"medusa-dev": /"acmekit-dev": /g' \
  packages/cli/acmekit-dev-cli/package.json
# Update root package.json workspace entries and scripts:
perl -pi -e 's|"packages/medusa"|"packages/acmekit"|g;
             s|"packages/medusa-test-utils"|"packages/acmekit-test-utils"|g;
             s|"packages/medusa-telemetry"|"packages/acmekit-telemetry"|g;
             s|medusa-oas-cli run medusa-oas|acmekit-oas-cli run acmekit-oas|g;
             s|"medusa-oas":|"acmekit-oas":|g' package.json
# Update tsconfig directory path aliases:
grep -rl '"packages/medusa/' --include="tsconfig*.json" -r . | grep -v node_modules | \
  xargs perl -pi -e 's|packages/medusa/|packages/acmekit/|g' || true
# Update jest.config.js — it references `packages/medusa` by path:
perl -pi -e 's|/medusa$|/acmekit|g; s|packages/medusa-react|packages/acmekit-react|g;
             s|reMedusa|reAcmeKit|g' jest.config.js
yarn install
yarn workspaces list | grep acmekit
```

> **Design system icons build artifact:** `packages/design-system/icons/package.json` has `"main": "dist/cjs/medusa-icons.js"` (build output filename). After the `@medusajs/` → `@acmekit/` namespace pass, also update the dist filename:
> ```bash
> perl -pi -e 's|medusa-icons\.js|acmekit-icons.js|g;
>              s|medusa-icons\.cjs|acmekit-icons.cjs|g' \
>   packages/design-system/icons/package.json \
>   packages/design-system/icons/rollup.config.mjs 2>/dev/null || true
> ```

- [ ] **Step 5b: Fix `@medusajs/medusa/` string values in .ts runtime code (NOT caught by jscodeshift)**

jscodeshift operates on AST import/require statements only. Runtime string values like `resolve: "@medusajs/medusa/auth-emailpass"` and `MODULE_PACKAGE_NAMES` entries are plain strings in object literals — jscodeshift does NOT touch them. After the package dir rename `packages/medusa` → `packages/acmekit`, these strings must become `"@acmekit/acmekit/..."`:

```bash
# After jscodeshift, "@medusajs/medusa/X" strings become "@acmekit/medusa/X" (jscodeshift handles @medusajs/ only)
# Then apply a second pass to fix "/medusa/" → "/acmekit/" in kept .ts files:
grep -rl '"@acmekit/medusa/' \
  packages/ --include="*.ts" \
  | grep -v "node_modules\|/dist/\|\.spec\.\|\.test\." \
  | xargs perl -pi -e 's|"@acmekit/medusa/|"@acmekit/acmekit/|g' || true

# Also fix require("@acmekit/medusa/loaders/index") in medusa-test-utils bootstrap:
perl -pi -e 's|require\("@acmekit/medusa/loaders/index"\)|require("@acmekit/acmekit/loaders/index")|g' \
  packages/acmekit-test-utils/src/medusa-test-runner-utils/bootstrap-app.ts || true
```

> **Note:** This step must run AFTER Step 2 (jscodeshift) and AFTER Step 5 (package dir rename), so jscodeshift has already changed `@medusajs/` → `@acmekit/`.

- [ ] **Step 6: Verify namespace rename (spec 15.3)**

```bash
grep -r "@medusajs/" packages/ --include="*.ts" --include="*.tsx" \
  --include="*.json" -l | grep -v node_modules
```

Expected: 0 results.

```bash
npx tsc --noEmit --project tsconfig.json 2>&1 | head -50
```

- [ ] **Commit:** `git commit -m "feat(acmekit): namespace rename @medusajs/* → @acmekit/*"`

---

### Task 32: Symbol-level rename (Medusa→AcmeKit)

**Spec reference:** Section 16

- [ ] **Step 0: Create symbol-rename branch off namespace-rename**

```bash
# Branch from feat/namespace-rename (not develop) so symbol rename builds on
# the already-updated import strings. Avoids merge conflicts at Task 34 Step 2.
git checkout feat/namespace-rename
git checkout -b feat/symbol-rename
```

- [ ] **Step 1: Run ts-morph rename script (spec 16.2)**

```bash
npx ts-node scripts/codemods/rename-symbols.ts
```

The script handles all 39 symbols from the Section 16.1 table using TypeScript Language Server for cross-file correctness.

> **Unlisted symbols:** The codebase contains ~24 additional `Medusa*` symbols not in the spec's Section 16.1 table. The ts-morph script targets only the listed 39. After Step 1, these will still exist and will be caught by Step 3's grep verify. Handle remaining hits manually or by extending the rename script. Known unlisted symbols include: `MedusaAPIError`, `MedusaAccountHolder`, `MedusaAppGetLinksExecutionPlanner`, `MedusaAppMigrate*`, `MedusaAppProxy`, `MedusaCardError`, `MedusaCommand`, `MedusaConfig`, `MedusaConnectionError`, `MedusaErrorType` (singular — `MedusaErrorTypes` IS in the table), `MedusaJS`, `MedusaLinkModule`, `MedusaPolicy`, `MedusaPricingContext`, `MedusaProject`, `MedusaProjectCreator`, `MedusaRateLimitError`, `MedusaRefund`, `MedusaSchema`, `MedusaSession`, `MedusaSuiteOptions`, `MedusaTestRunner`, `MedusaVitePlugin`, `MedusaVitePluginOptions`. Note: the `Medusa*` symbols from commerce modules (`MedusaPayment*`, `MedusaPaymentsProvider`, etc.) will be gone after slice removal — no action needed for those.

- [ ] **Step 2: Constant renames — SCREAMING_SNAKE_CASE (spec 16.3)**

Follow spec Section 16.3 Steps 1–4 in order:
- Delete `MEDUSA_CLOUD_*` and `MEDUSA_STOREFRONT_URL` declarations
- Rename remaining `MEDUSA_*` → `ACMEKIT_*` in packages/
- Rename in CI configs
- Rename in www/ MDX docs and www/utils merger configs
- Verify: no remaining `MEDUSA_` in packages/ or www/

> **API reference TypeScript code samples:** `www/apps/api-reference/specs/store/code_samples/TypeScript/` contains `.ts` files with `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. Spec Section 16.3 may not explicitly list this path. Ensure the bulk rename covers it:
> ```bash
> grep -rl "MEDUSA_" www/apps/api-reference/ --include="*.ts" | \
>   xargs perl -pi -e 's/MEDUSA_BACKEND_URL/ACMEKIT_BACKEND_URL/g;
>                      s/NEXT_PUBLIC_MEDUSA_BACKEND_URL/NEXT_PUBLIC_ACMEKIT_BACKEND_URL/g;
>                      s/NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY/NEXT_PUBLIC_ACMEKIT_PUBLISHABLE_KEY/g;
>                      s/MEDUSA_PUBLISHABLE_KEY/ACMEKIT_PUBLISHABLE_KEY/g' || true
> # Also update import names: "import Medusa from" → "import AcmeKit from" in these samples:
> grep -rl "import Medusa from" www/apps/api-reference/ --include="*.ts" | \
>   xargs perl -pi -e 's/import Medusa from/import AcmeKit from/g;
>                      s/new Medusa\(/new AcmeKit(/g' || true
> ```

> **`MEDUSA_ADMIN_*` env vars** (`MEDUSA_ADMIN_BACKEND_URL`, `MEDUSA_ADMIN_ADDITIONAL_ALLOWED_HOSTS`, `MEDUSA_ADMIN_ONBOARDING_*`) are in `packages/admin/admin-bundler/` and `packages/admin/dashboard/src/vite-env.d.ts`. They are NOT in the spec's explicit rename table but WILL be caught by the bulk `s/MEDUSA_/ACMEKIT_/g` regex. No extra action needed — just verify after the bulk rename.

> **`MEDUSA_PUBLISHABLE_KEY` semantic note:** The bulk rename converts this to `ACMEKIT_PUBLISHABLE_KEY`. Pre-Work conceptually renamed "publishable key" → "client key" at the API/SDK level. If you want full semantic consistency, rename this constant to `ACMEKIT_CLIENT_KEY` instead — but that requires updating all usage sites. Decide and apply consistently.

- [ ] **Step 2b: `x-medusa-locale` / `LOCALE_STORAGE_KEY` deferred cleanup (spec 4.7)**

The spec deferred these but no section implements the cleanup. Do it now:
```bash
# Rename HTTP header x-medusa-locale → x-acmekit-locale:
grep -rl "x-medusa-locale" packages/ www/ --include="*.ts" --include="*.tsx" --include="*.mdx" | \
  xargs perl -pi -e 's/x-medusa-locale/x-acmekit-locale/g'
# Rename storage key "medusa_locale" → "acmekit_locale":
grep -rl "medusa_locale\|LOCALE_STORAGE_KEY" packages/ --include="*.ts" | \
  xargs perl -pi -e 's/"medusa_locale"/"acmekit_locale"/g'
```

- [ ] **Step 3: Verify symbol renames (spec 16.4)**

```bash
grep -rn "Medusa[A-Z]\|medusa[A-Z]\|MEDUSA_" \
  packages/ --include="*.ts" --include="*.tsx" | \
  grep -v "node_modules\|\.spec\.\|\.test\." | \
  grep -v "//.*[Mm]edusa\|#.*[Mm]edusa\|\*.*[Mm]edusa" | \
  head -30
```

Expected: 0 results.

- [ ] **Commit:** `git commit -m "feat(acmekit): symbol rename MedusaX → AcmeKitX, MEDUSA_* → ACMEKIT_*"`

---

### Task 33: Scaffold cleanup

**Spec reference:** Section 18 (scaffold removal)

- [ ] **Step 0: Create scaffold-cleanup branch**

```bash
git checkout develop
git checkout -b feat/scaffold-cleanup
```

- [ ] **Step 1: Remove all scaffold scripts added during setup**

```bash
rm -rf scripts/codemods/
rm -f scripts/docs-remove-domain-references.mjs
rm -f scripts/verify-slice.sh
rm -f scripts/verify-docs-slice.sh
rm -f scripts/find-orphaned-docs.mjs
rm -f .knip-baseline.txt
rm -f .knip-after-*.txt
rm -f .acmekit-progress.json
```

Keep:
- `scripts/sync-upstream.sh` — permanent operational tool
- `scripts/sync-manifest.json` — permanent operational tool

- [ ] **Step 2: Commit scaffold removal**

```bash
git add -A
git commit -m "chore: remove rebranding scaffold scripts — migration complete"
```

---

### Task 34: Final merge to develop, done-check + full build verification

- [ ] **Step 1: Merge all remaining branches to develop (sequential — one at a time)**

```bash
git checkout develop
# (pre-work already merged after Task 2; slice branches already merged at Task 11 + Task 21)
# Merge sequentially so rerere can replay each conflict resolution independently:
git merge --no-ff feat/www-cleanup
git merge --no-ff feat/core-surgery
# feat/symbol-rename was branched from feat/namespace-rename, so merge namespace first:
git merge --no-ff feat/namespace-rename
git merge --no-ff feat/symbol-rename
git merge --no-ff feat/scaffold-cleanup
git push origin develop
```

> **Note on merge conflicts:** `rerere` (enabled in Task 1) replays previously resolved conflicts automatically. Barrel `index.ts` files are the most likely conflict source. Resolve conflicts by keeping only non-commerce/AcmeKit exports.

- [ ] **Step 2: Final unified done-check (spec 16.5) — runs on merged develop**

```bash
# Check @medusajs/ namespace (full repo):
grep -rn "@medusajs/" \
  packages/ www/ integration-tests/ scripts/ .github/ \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" \
  --include="*.json" --include="*.mdx" --include="*.md" --include="*.yml" \
  | grep -v node_modules \
  | grep -v "scripts/sync-manifest\.json" \
  | grep -v "scripts/sync-upstream\.sh" \
  | grep -v "CONTRIBUTING\|CHANGELOG\|SECURITY" \
  | head -30

# Check Medusa-prefixed symbols (full repo):
grep -rn "\bMedusa[A-Z]\|\bmedusa[A-Z]\|\bMEDUSA_" \
  packages/ www/ integration-tests/ scripts/ \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" \
  --include="*.mdx" --include="*.md" \
  | grep -v node_modules \
  | grep -v "\.spec\.\|\.test\." \
  | grep -v "//.*[Mm]edusa\|#.*[Mm]edusa\|\*.*[Mm]edusa" \
  | grep -v "sync-upstream\.sh\|sync-manifest\.json" \
  | head -30
```

Expected: 0 results on both checks.

- [ ] **Step 3: Full monorepo build**

```bash
yarn build 2>&1 | tail -30
```

Expected: 0 errors.

- [ ] **Step 4: Full www build**

```bash
cd www && yarn build 2>&1 | tail -30
```

Expected: 0 broken links, 0 build errors.

- [ ] **Step 5: Unit test suite**

```bash
yarn test 2>&1 | tail -30
```

Expected: all tests pass (or only pre-existing failures unrelated to commerce removal).

- [ ] **Step 6: PR to main**

Create PR: `develop` → `main`
Title: `feat: AcmeKit rebranding — Medusa v2 fork transformed to general-purpose framework`

---

## Summary

| Chunk | Tasks | Description |
|---|---|---|
| 1 | 1–2 | Setup, tooling, pre-work client API rename |
| 2 | 3–11 | Commerce slices 1–8 (store, currency, tax, region, pricing, promotion, product, inventory) |
| 3 | 12–21 | Commerce slices 9–16 (stock-location, fulfillment, payment, cart, order, sales-channel, link-modules, draft-order) + customer cleanup |
| 4 | 22–25 | www docs cleanup (cloud/bloom/user-guide deletion, resources surgery, book cleanup, UI rewrites) |
| 5 | 26–30 | Core surgery, dashboard nav, JS SDK, dependencies, branding strings |
| 6 | 31–34 | Namespace rename, symbol rename, final verification, scaffold removal, merge to main |

**Total:** 34 tasks across 6 chunks.
