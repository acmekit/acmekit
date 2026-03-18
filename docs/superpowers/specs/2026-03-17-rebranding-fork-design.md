# AcmeKit Fork Rebranding & Adoption Design

**Date:** 2026-03-17
**Status:** Approved
**Version:** 4.0 (Merged with client-api-rename-design.md — Pre-Work section added, conflicts resolved)

---

## 1. Goal

Transform the Medusa v2 monorepo into **AcmeKit** — a general-purpose application framework (fintech, blockchain, SaaS, any vertical) by:

1. Removing all commerce-domain modules and every trace of them across the entire codebase
2. Renaming `/*` → `@acmekit/*` across all 75 packages
3. Fully cleaning the `/www` documentation monorepo (7 Next.js apps, ~7,345 MDX files)
4. Establishing a maintainable selective upstream sync strategy

**What we KEEP** (generic infrastructure):
- `framework`, `workflows-sdk`, `orchestration`, `modules-sdk`, `types`, `utils`, `core-flows` (generic steps only)
- `auth` + providers (emailpass, github, google)
- `api-key`, `user`, `rbac`, `settings`, `translation`
- `cache-inmemory`, `cache-redis`, `caching`, `caching-redis`
- `event-bus-local`, `event-bus-redis`
- `file`, `file-local`, `file-s3`
- `notification`, `notification-local`, `notification-sendgrid`
- `locking`, `locking-postgres`, `locking-redis`
- `workflow-engine-inmemory`, `workflow-engine-redis`
- `analytics`, `analytics-local`, `analytics-posthog` ← PostHog stays
- `index` (search/indexing infrastructure)
- `customer` ← **KEPT**: user identity/account management is domain-agnostic; repurposed as generic "account" concept
- `admin` suite (dashboard, admin-sdk, admin-shared, admin-bundler, admin-vite-plugin)
- `design-system`, `ui`, `icons`, `ui-preset`, `toolbox`
- `js-sdk` (stripped of commerce methods)
- `cli` suite (renamed), `medusa-telemetry` (rebranded, PostHog kept)
- `deps`, `test-utils`, `medusa-test-utils`
- `link-modules` (partial — 3 of 41 definition files kept)

**What we DROP** (commerce domain):
`cart`, `order`, `payment`, `pricing`, `product`, `promotion`, `fulfillment`, `inventory`, `stock-location`, `sales-channel`, `currency`, `region`, `store`, `tax` — and all their traces in types, utils, core-flows, API routes, subscribers, policies, dashboard routes, SDK methods, tests, docs, and www content.
Also drop: `payment-stripe`, `fulfillment-manual`, `plugins/draft-order/`.

---

## 2. Repository & Branch Structure

```
origin/main            ← AcmeKit stable releases
origin/develop         ← active development (all PRs target here)
origin/upstream-mirror ← read-only mirror of medusajs/medusa main (never commit here manually)
```

**Rules:**
- `upstream-mirror` is updated only by `scripts/sync-upstream.sh`, never manually
- Feature branches cut from `develop`; upstream sync PRs also target `develop`
- `main` receives merges from `develop` only via PR

```bash
# One-time setup
git remote add upstream https://github.com/medusajs/medusa.git
git remote set-url --push upstream no_push   # prevent accidental upstream pushes
git config rerere.enabled true               # auto-replay conflict resolutions
git config rerere.autoupdate true
```

---

## 3. Tooling Setup (Do First — Before Any Removal)

Install all tools before beginning any slice work.

```bash
# Dead code detection
yarn add -D knip madge

# AST-based transforms
yarn add -D jscodeshift ts-morph

# Install ast-grep globally (Rust binary, cannot be npm-installed in all envs)
brew install ast-grep        # macOS
# or: cargo install ast-grep

# MDX / docs processing (run inside www/)
cd www && yarn add -D gray-matter unified remark-parse remark-frontmatter remark-stringify glob && cd ..

# Broken link checking
npm install -g linkinator
```

**Baseline snapshot and progress tracker — do before ANY slice work:**

```bash
# Knip baseline (used by verify-slice.sh) — sort output for deterministic diff later
npx knip --production --reporter compact | sort > .knip-baseline.txt
git add .knip-baseline.txt

# Progress tracker (used to resume after interrupted sessions)
cat > .acmekit-progress.json << 'EOF'
{
  "completedSlices": [],
  "lastCompletedAt": null,
  "notes": "Track completed slices here. Check this file to know where to resume."
}
EOF
git add .acmekit-progress.json
git commit -m "chore: rebranding setup — knip baseline + progress tracker"
```

**`yarn install` requirement:** After each `rm -rf packages/modules/DOMAIN/` (Step 1 of every slice) and after all Section 8 `package.json` mutations, run `yarn install`. Without it, stale symlinks in `node_modules` will let TypeScript resolve deleted packages and give false-green compile results. The `verify-slice.sh` tsc check is only meaningful against a fresh `yarn install`.

**Resuming an interrupted session:** Read `.acmekit-progress.json`, find the last entry in `completedSlices`, start the next slice in Section 5's removal order.

---

## 4. Pre-Work: Client API Rename (Execute First)

> **This entire section must be completed and merged BEFORE any Slice removal work begins.** It renames foundational API/SDK structure that every subsequent slice references. Execute this as a standalone branch, merge it, then start Slice 1.

### 4.1 Goal

Rename the `/store` API prefix to `/client` and the `sdk.store` JS SDK namespace to `sdk.client`, reflecting AcmeKit's generic (non-commerce) identity. Add a raw `fetch()` escape hatch to both `sdk.admin` and `sdk.client` that hides auth complexity. Rename the `x-publishable-api-key` header to `x-client-api-key`. Update the admin dashboard to call these "Client Keys" instead of "Publishable Keys".

### 4.2 Scope

| Layer | Change |
|---|---|
| API routes | Directory `api/store/` → `api/client/`, prefix `"/store"` → `"/client"` in `router.ts` and per-resource middleware files |
| Auth header | `x-publishable-api-key` → `x-client-api-key` (constant + string value in utils + sdk) |
| `storeCors` → `clientCors` | Rename config field in `config-module.ts` and update `router.ts` to reference `clientCors` |
| JS SDK | `Store` class → `ClientSdk`, `sdk.store` → `sdk.client`, paths `/store/*` → `/client/*` |
| JS SDK | Rename HTTP client property `this.client` → `this.http` inside `Medusa` class; expose SDK namespace as `sdk.client` |
| JS SDK | Add `fetch<T>()` method to both `Admin` and `ClientSdk` classes |
| JS SDK | Rename `Config.publishableKey` → `Config.clientKey`; rename internal method `getPublishableKeyHeader_()` → `getClientKeyHeader_()` |
| Dashboard | UI labels "Publishable Keys" → "Client Keys", header copy updated |
| Data model | No change — `type: "publishable"` stays in DB |

### 4.3 API Layer

#### 4.3.1 Route Directory

Move `packages/medusa/src/api/store/` → `packages/medusa/src/api/client/`. File contents are unchanged during the move — only the directory name changes.

#### 4.3.2 Prefix Strings in router.ts

The primary location of `"/store"` prefix registration is `packages/core/framework/src/http/router.ts`. It hardcodes `/store` in approximately five places for CORS, publishable-key middleware, auth, locale, and restricted-fields middleware registration. Update all five occurrences from `"/store"` to `"/client"`.

`packages/medusa/src/api/middlewares.ts` does not contain the prefix string directly — it spreads `...storeRoutesMiddlewares` from per-resource files. Rename references in those per-resource middleware files (`./store/*/middlewares.ts` → `./client/*/middlewares.ts`) as part of the directory move.

#### 4.3.3 Auth Header Constant

The canonical definition is in `packages/core/utils/src/api-key/api-key-type.ts`:

```typescript
// Before
export const PUBLISHABLE_KEY_HEADER = "x-publishable-api-key"

// After
export const CLIENT_KEY_HEADER = "x-client-api-key"
```

Update all import sites: framework middleware (`router.ts`, `ensure-publishable-api-key.ts`), and any integration tests. Note: `packages/core/js-sdk/src/client.ts` defines its own independent copy of this constant (not an import from utils) — see Section 4.4.3 for that rename.

Also update user-visible copy in `ensure-publishable-api-key.ts` — any error messages or response strings containing "Publishable API key" should read "Client API key".

#### 4.3.4 storeCors → clientCors Config Field Rename

`configManager.config.projectConfig.http.storeCors` is passed to `router.ts`'s CORS middleware for the `/store` namespace. Now that the namespace is `/client`, rename this config field as part of Pre-Work:

1. In `packages/core/types/src/common/config-module.ts` — rename `storeCors: string` → `clientCors: string` in the `http` config interface
2. In `packages/core/framework/src/http/router.ts` — rename all `storeCors` references to `clientCors`
3. Search for any other `storeCors` references: `grep -rn "storeCors" packages/ --include="*.ts" | grep -v node_modules`

This is a user-facing breaking change: any project config using `http: { storeCors: "..." }` must update to `clientCors`.

#### 4.3.5 OpenAPI Spec and api-reference Specs Directory

Verify after the directory rename that OpenAPI generation tooling scans the new `api/client/` directory. If the generator has a hardcoded `api/store/` glob, update it. Do not assume auto-detection — explicitly confirm the client routes appear in the generated spec output.

Also rename the www api-reference specs directory:
```bash
mv www/apps/api-reference/specs/store www/apps/api-reference/specs/client
# Update all references to specs/store path inside remaining spec files:
grep -rl "specs/store" www/apps/api-reference/ --include="*.yaml" --include="*.json" --include="*.mjs" | \
  xargs perl -pi -e 's|specs/store|specs/client|g' || true
```

> Commerce-specific endpoint entries within `specs/client/` (cart, product, region, etc.) are removed per-slice during their respective slice removals, not here.

### 4.4 JS SDK

#### 4.4.1 Directory and Class Rename

- `packages/core/js-sdk/src/store/` → `packages/core/js-sdk/src/client-sdk/`
- Class `Store` → `ClientSdk` (avoids collision with the HTTP `Client` class already exported from `./client.ts`)
- All internal `this.client.fetch()` calls inside `ClientSdk`: paths `/store/...` → `/client/...`

> **Why `ClientSdk` not `Client`**: `packages/core/js-sdk/src/client.ts` already exports a class named `Client` (the base HTTP client). Using the same name for the SDK namespace class creates an export collision at the barrel level (Section 4.4.6). `ClientSdk` is unambiguous. The public-facing property on `Medusa` is still `sdk.client`.

#### 4.4.2 Medusa Root Class

In `packages/core/js-sdk/src/index.ts`, the `Medusa` class currently exposes `this.client` as the HTTP `Client` instance. Since `sdk.client` is the desired public name for the SDK namespace, rename the HTTP client property internally:

```typescript
// Before
export class Medusa {
  client: Client   // HTTP base client
  store: Store
  admin: Admin
  auth: Auth

  constructor(options: Config) {
    this.client = new Client(options)
    this.store  = new Store(this.client)
    this.admin  = new Admin(this.client)
    this.auth   = new Auth(this.client)
  }
}

// After
export class Medusa {
  http: Client        // renamed — HTTP base client (internal use)
  client: ClientSdk   // public SDK namespace (was sdk.store)
  admin: Admin
  auth: Auth

  constructor(options: Config) {
    this.http   = new Client(options)
    this.client = new ClientSdk(this.http)
    this.admin  = new Admin(this.http)
    this.auth   = new Auth(this.http)
  }
}
```

> **Breaking change**: Any consumer who accessed `sdk.client` to call the raw HTTP client (e.g., `sdk.client.fetch(...)`) will now get the `ClientSdk` instance instead. Document this in the migration notes. Consumers who used `sdk.store` for storefronts are now on `sdk.client`.

> **Method bodies**: The `Medusa` class has `setLocale(locale)` and a `locale` getter that delegate to `this.client.setLocale(locale)` / `this.client.locale`. After renaming the HTTP client property from `client` to `http`, update these method bodies to `this.http.setLocale(locale)` and `this.http.locale`.

#### 4.4.3 Header Constant and Config Field in client.ts

`packages/core/js-sdk/src/client.ts` contains a module-level exported constant and a config field that reference the old header name:

```typescript
// Before (module level)
export const PUBLISHABLE_KEY_HEADER = "x-publishable-api-key"

// Before (Config type in types.ts)
publishableKey?: string

// Before (method in Client class)
private getPublishableKeyHeader_(): Record<string, string> { ... }

// After (module level)
export const CLIENT_KEY_HEADER = "x-client-api-key"

// After (Config type in types.ts)
clientKey?: string

// After (method in Client class)
private getClientKeyHeader_(): Record<string, string> { ... }
```

Update all internal usages of the config field (`this.config.publishableKey` → `this.config.clientKey`) and method references throughout `client.ts`.

#### 4.4.4 Generic fetch() Method

Add to both `Admin` (`packages/core/js-sdk/src/admin/index.ts`) and `ClientSdk` (`packages/core/js-sdk/src/client-sdk/index.ts`). Each class holds a `protected readonly prefix` set in its constructor:

**In Admin:**
```typescript
protected readonly prefix = "/admin"
```

**In ClientSdk:**
```typescript
protected readonly prefix = "/client"
```

**Shared method (identical in both classes):**
```typescript
import type { FetchArgs } from "../types"  // use the existing exported type

/**
 * Generic fetch method. Injects auth headers automatically.
 * Path is relative to this section's root: "/orders" → "/admin/orders" (Admin)
 * or "/products" → "/client/products" (ClientSdk).
 */
async fetch<T = unknown>(
  path: string,
  options?: FetchArgs
): Promise<T> {
  const normalizedPath = path.startsWith(this.prefix)
    ? path
    : `${this.prefix}${path}`
  return await this.client.fetch<T>(normalizedPath, options)
}
```

> Do not use `this instanceof Admin` to determine the prefix — that pattern creates a cross-class dependency and is fragile under inheritance. Use the `readonly prefix` property set per class.

`this.client` here is the HTTP `Client` instance passed into each constructor. It handles:
- Injecting `x-client-api-key` header (for ClientSdk requests)
- Injecting `Authorization: Bearer <token>` or `Authorization: Basic <apiKey>` (for Admin requests)
- Token storage and refresh

No auth logic is duplicated in the `fetch()` method.

#### 4.4.5 Admin's store Sub-resource

`packages/core/js-sdk/src/admin/index.ts` has a property `public store: Store` that refers to an **admin sub-resource** (admin store settings), defined in `packages/core/js-sdk/src/admin/store.ts`. This is **not** the storefront `Store` class being renamed. Do **not** rename `admin.store` or `admin/store.ts` here — they refer to different things. Only rename the top-level `Medusa.store` property and the `packages/core/js-sdk/src/store/` directory. (The `admin/store.ts` file will be deleted later during Slice 1 commerce removal.)

#### 4.4.6 Barrel Export Collision Resolution

`packages/core/js-sdk/src/index.ts` currently exports:
```typescript
export { Client } from "./client"           // HTTP base client
export { Store } from "./store"             // Storefront SDK namespace
```

After the rename, this becomes:
```typescript
export { Client as HttpClient } from "./client"   // renamed export alias to avoid collision
export { ClientSdk } from "./client-sdk"          // SDK namespace class
```

Consumers importing `Client` from `/js-sdk` (or `@acmekit/js-sdk`) will need to update to `HttpClient`. Document this as a breaking change.

### 4.5 Admin Dashboard

#### 4.5.1 UI Label Changes

In `packages/admin/dashboard/src/`:

- All occurrences of "Publishable Key" / "Publishable Keys" → "Client Key" / "Client Keys"
- Page title, breadcrumb, table column headers, empty state copy, help text
- The header name shown in the "Usage" / code sample section: `x-publishable-api-key` → `x-client-api-key`

#### 4.5.2 No Data Model Changes

The api-key module stores keys with `type: "publishable"`. This value does **not** change. Dashboard filters by `type === "publishable"` to show Client Keys — that filter stays unchanged. Only display strings change.

#### 4.5.3 Affected Files (approximate)

- `packages/admin/dashboard/src/routes/api-keys/` — route pages for publishable key management
- Any i18n/translation files if present

### 4.6 Files Affected

| File | Change |
|---|---|
| `packages/core/utils/src/api-key/api-key-type.ts` | Rename `PUBLISHABLE_KEY_HEADER` const → `CLIENT_KEY_HEADER`, update string value |
| `packages/core/types/src/common/config-module.ts` | Rename `storeCors: string` → `clientCors: string` in the `http` config interface |
| `packages/core/framework/src/http/router.ts` | Update ~5 `"/store"` prefix strings → `"/client"`; rename `#applyStorePublishableKeyMiddleware` → `#applyClientKeyMiddleware`; rename `storeCors` references → `clientCors` |
| `packages/core/framework/src/http/middlewares/ensure-publishable-api-key.ts` | Update import of header constant; update user-visible error copy — **file survives** |
| `packages/medusa/src/api/store/` | Rename directory → `api/client/` |
| `packages/medusa/src/api/middlewares.ts` | Update import paths after directory rename |
| `packages/core/js-sdk/src/store/` | Rename directory → `src/client-sdk/` |
| `packages/core/js-sdk/src/store/index.ts` | Rename class `Store` → `ClientSdk`, update `/store/*` paths → `/client/*`, add `prefix` property and `fetch()` method |
| `packages/core/js-sdk/src/client.ts` | Rename `PUBLISHABLE_KEY_HEADER` → `CLIENT_KEY_HEADER`, rename `getPublishableKeyHeader_()` → `getClientKeyHeader_()`; no changes to `LOCALE_STORAGE_KEY` or `x-medusa-locale` (deferred) |
| `packages/core/js-sdk/src/types.ts` | Rename `Config.publishableKey` → `Config.clientKey` |
| `packages/core/js-sdk/src/admin/index.ts` | Add `prefix` property and `fetch<T>()` method |
| `packages/core/js-sdk/src/index.ts` | Rename `store` → `client` property; rename HTTP client property `client` → `http`; update barrel exports (add `HttpClient` alias, export `ClientSdk`) |
| `packages/admin/dashboard/src/routes/api-keys/` | Update UI copy + header string display |
| Integration tests | Update any `/store/` path references → `/client/`, update `x-publishable-api-key` header → `x-client-api-key`, update `publishableKey` config field → `clientKey` |

### 4.7 Out of Scope for Pre-Work

- Changing auth behavior (middleware, token flows, session handling) — unchanged
- Changing the `api-key` module's data model or service
- Adding `get/post/put/delete` shorthand methods to the SDK
- Updating `/www` documentation (covered by main rebranding spec)
- Renaming `x-medusa-locale` or `LOCALE_STORAGE_KEY` — deferred to branding cleanup pass

---

## 5. The Slice-by-Slice Removal Strategy

Remove **one commerce domain at a time, fully and completely**, across all codebase layers simultaneously. Each slice produces a compilable, testable state.

**Removal order** (topological — dependents before dependencies):

| Order | Domain | Notes |
|-------|--------|-------|
| 1 | `store` | Thin, few cross-refs. Delete the `store` commerce module. `storeCors` → `clientCors` rename and route infrastructure already done in Pre-Work. |
| 2 | `currency` | Referenced by region/pricing but standalone |
| 3 | `tax` | Self-contained |
| 4 | `region` | Depends on currency (already gone) |
| 5 | `pricing` / `price-list` | Referenced by product/promotion |
| 6 | `promotion` | References pricing |
| 7 | `product` | Large but now unblocked |
| 8 | `inventory` | Depends on product for variant links |
| 9 | `stock-location` | Tightly paired with inventory |
| 10 | `fulfillment` | References inventory/stock-location |
| 11 | `payment` | References order |
| 12 | `cart` | References most things above |
| 13 | `order` | Most complex; references cart, payment, fulfillment, inventory |
| 14 | `sales-channel` | **Must come after cart+order** (both depend on it) |
| 15 | `link-modules` | Delete 38 of 41 definition files; keep 3 |
| 16 | `plugins/draft-order` | Depends on order (already gone). **Note: lives under `packages/plugins/`, not `packages/modules/` — Step 1 template path does not apply; use `rm -rf packages/plugins/draft-order/` directly.** |

> **Note on `customer`:** Kept deliberately. User identity/account management is infrastructure, not commerce. Repurposed as the generic "account" concept for AcmeKit. The specific commerce-wiring to remove after all slices are done:
> - `packages/core/types/src/customer/common.ts` — remove the `orders: { id: string }[]` field from `CustomerDTO`
> - `packages/admin/dashboard/src/routes/customer-groups/` — **DELETE** (customer groups are a commerce concept for pricing/promotions; does not survive rebranding)
> - `packages/core/core-flows/src/customer/` — identify and remove any step that calls cart or order services:
>   ```bash
>   grep -rn '"cart"\|"order"\|Modules\.CART\|Modules\.ORDER' \
>     packages/core/core-flows/src/customer/ --include="*.ts"
>   # For each file reported: delete the file if it is entirely commerce-specific,
>   # or remove the commerce-importing lines with:
>   # perl -pi -e 's/^.*(?:cart|order|Modules\.CART|Modules\.ORDER).*\n//gm' <file>
>   ```
> - `packages/core/js-sdk/src/admin/customer-group.ts` — **DELETE** (customer group SDK methods are commerce-specific)
> - `packages/modules/link-modules/src/definitions/readonly/customer-account-holder.ts` — **KEEP** (generic auth/identity link)

---

## 6. Per-Slice Removal Playbook

> **Claude executor note:** Execute all 12 steps for each domain in the removal order from Section 5. After each domain, run `bash scripts/verify-slice.sh DOMAIN`. If verify-slice reports failures, fix them before proceeding to the next domain. Check `.acmekit-progress.json` at session start to determine which domain to start from.

Execute all steps for each domain before moving to the next. Replace `DOMAIN` with the actual domain name (e.g. `cart`).

### Step 0 — Map blast radius first

```bash
# Find all TypeScript files that import from this domain
grep -r "/DOMAIN\|@acmekit/DOMAIN\|Modules\.DOMAIN_UPPER\|modules/DOMAIN" \
  packages/ --include="*.ts" --include="*.tsx" -l | grep -v node_modules
```

### Step 1 — Delete the module package

```bash
rm -rf packages/modules/DOMAIN/
# Also delete commerce providers for this domain (if any)
rm -rf packages/modules/providers/DOMAIN-*/
rm -rf packages/modules/providers/payment-stripe/   # when removing payment
rm -rf packages/modules/providers/fulfillment-manual/  # when removing fulfillment
```

### Step 2 — Delete core-flows for this domain

```bash
rm -rf packages/core/core-flows/src/DOMAIN/
rm -rf packages/core/core-flows/src/DOMAIN-*/    # e.g. draft-order, price-list
# Remove the domain's re-export from the core-flows barrel:
[ -f packages/core/core-flows/src/index.ts ] && \
  perl -pi -e 's/^export \* from "\.\/DOMAIN[^"]*";\n//gm' packages/core/core-flows/src/index.ts
```

**Special case — `store` (Slice 1) only:** `defaults/` core-flows imports store and sales-channel:
```bash
# Delete the store-specific step entirely
rm -f packages/core/core-flows/src/defaults/steps/create-default-store.ts

# Remove store/sales-channel import lines from create-defaults.ts:
perl -pi -e 's/^.*linkSalesChannelsToApiKeyWorkflow.*\n//gm' \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
perl -pi -e 's/^.*createDefaultSalesChannelStep.*\n//gm' \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
perl -pi -e 's/^.*createDefaultStoreStep.*\n//gm' \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
# Then remove the workflow steps that use them from the workflow body.
# Verify remaining references:
grep -n "Store\|SalesChannel\|salesChannel\|store" \
  packages/core/core-flows/src/defaults/workflows/create-defaults.ts
# For any remaining lines that call these removed steps, delete them manually.
```

### Step 3 — Delete API routes

```bash
# Admin routes
rm -rf packages/medusa/src/api/admin/DOMAIN*/
rm -rf packages/medusa/src/api/admin/DOMAIN-*/
```

> **Slice 1 (store) special note:** The `api/store/` directory was **already renamed** to `api/client/` in Pre-Work (Section 4). Do NOT delete `api/client/` — it is the client API route directory and survives. During Slice 1, delete only the admin-side store routes:
> ```bash
> rm -rf packages/medusa/src/api/admin/store*/
> rm -rf packages/medusa/src/api/admin/store-*/
> ```

### Step 4 — Delete module config in medusa package

```bash
rm -f packages/medusa/src/modules/DOMAIN.ts
# Remove the import+export lines from modules/index.ts:
perl -pi -e 's/^.*[Ii]mport.*DOMAIN.*\n//gm' packages/medusa/src/modules/index.ts
perl -pi -e 's/^.*DOMAIN.*\n//gm' packages/medusa/src/modules/index.ts
```

### Step 5 — Delete subscribers and policies for this domain

```bash
# Subscribers: check which reference this domain
grep -l "DOMAIN" packages/medusa/src/subscribers/*.ts | xargs rm -f

# Policy files
rm -f packages/medusa/src/policies/DOMAIN.ts
# Remove its export from packages/medusa/src/policies/index.ts:
perl -pi -e 's/^export \* from "\.\/DOMAIN[^"]*";\n//gm' packages/medusa/src/policies/index.ts
```

### Step 6 — Surgery on core packages

**`packages/core/utils/src/modules-sdk/definition.ts`**
- Remove `DOMAIN` entry from `Modules` enum
- Remove from `MODULE_PACKAGE_NAMES` and `REVERSED_MODULE_PACKAGE_NAMES`

**`packages/core/utils/src/common/define-config.ts`**
- Remove the DOMAIN module from the default auto-loaded modules array

**`packages/core/utils/src/DOMAIN/`** (if directory exists)
```bash
rm -rf packages/core/utils/src/DOMAIN/
# Remove barrel re-export from packages/core/utils/src/index.ts:
[ -f packages/core/utils/src/index.ts ] && \
  perl -pi -e 's/^export \* from "\.\/DOMAIN[^"]*";\n//gm' packages/core/utils/src/index.ts
```

**`packages/core/types/src/DOMAIN/`** (if directory exists)
```bash
rm -rf packages/core/types/src/DOMAIN/
# Remove barrel re-export from packages/core/types/src/index.ts:
[ -f packages/core/types/src/index.ts ] && \
  perl -pi -e 's/^export \* from "\.\/DOMAIN[^"]*";\n//gm' packages/core/types/src/index.ts
```

**`packages/core/types/src/http/DOMAIN/`** — HTTP request/response types (this layer is separate from `src/DOMAIN/`)

The `packages/core/types/src/http/` directory has its own per-domain subdirectories with nested `admin/` and `store/` subdirectories containing request payloads, responses, entities, and query types. Each domain has a directory here even if it doesn't have a top-level `src/DOMAIN/` directory.

Many domains have sub-domain http directories that do NOT match the primary domain name — `grep -i "DOMAIN"` on the directory listing will miss them. Use the per-slice delete list below instead.

```bash
# Delete the domain's http type directory
rm -rf packages/core/types/src/http/DOMAIN/

# Remove re-export from the http barrel:
[ -f packages/core/types/src/http/index.ts ] && \
  perl -pi -e 's/^export \* from "\.\/DOMAIN[^"]*";\n//gm' packages/core/types/src/http/index.ts
```

**Per-slice http sub-domain directories to also delete** (missed by generic grep):

| Slice | Domain | Additional http/ directories to delete |
|---|---|---|
| 1 | `store` | *(none beyond store/)* |
| 7 | `product` | `product-category/`, `collection/` |
| 11 | `payment` | `refund-reason/` |
| 12 | `cart` | *(none beyond cart/)* |
| 13 | `order` | `order-edit/`, `claim/`, `exchange/`, `return/`, `return-reason/` |
| 6 | `promotion` | `campaign/` |
| 8 | `inventory` | `reservation/` |
| 10 | `fulfillment` | `shipping-option/`, `shipping-profile/` |

For each additional directory above: `rm -rf packages/core/types/src/http/<subdir>/` and remove its export line from `packages/core/types/src/http/index.ts`.

> **Coverage note:** After all slices, only generic domains (auth, api-key, user, customer, file, notification, etc.) should remain in `http/`.

**`packages/core/framework/src/types/container.ts`**
- Remove `IDOMAINModuleService` from `ModuleImplementations`
- Remove its import if separately imported

**Special surgery for `store` domain (Slice 1):**

`packages/core/framework/src/http/router.ts` — the `/store` prefix was already renamed to `/client` in Pre-Work, and `#applyStorePublishableKeyMiddleware` was renamed to `#applyClientKeyMiddleware` (it applies to `/client` now and **stays**). No further changes needed to router.ts for the store commerce module removal.

`packages/core/types/src/common/config-module.ts` — `storeCors` was already renamed to `clientCors` in Pre-Work (Section 4.3.4). No action needed here during Slice 1.

`packages/core/utils/src/common/define-config.ts` — remove `DEFAULT_STORE_RESTRICTED_FIELDS` constant and all references to it (it restricts `/store` response fields; the `/client` API does not need it). See also Section 12.2.

`packages/core/framework/src/http/middlewares/ensure-publishable-api-key.ts` — **do NOT delete**. This file was updated in Pre-Work (Section 4) to use `x-client-api-key` and now enforces client key authentication on `/client` routes. It survives.

### Step 7 — Delete link-module definitions for this domain

```bash
# Check which link-module definition files reference this domain
grep -rl "DOMAIN" packages/modules/link-modules/src/definitions/ | xargs rm -f
```

Full classification of link-modules files — see Section 11.

### Step 8 — Dashboard route cleanup

```bash
# Delete route directories
rm -rf packages/admin/dashboard/src/routes/DOMAIN*/
rm -rf packages/admin/dashboard/src/routes/DOMAIN-*/

# Navigation config — remove the { path, label, icon } object and icon import for DOMAIN:
perl -0777 -pi -e 's/\{[^}]*"\/DOMAIN[^"]*"[^}]*\},?\n?//g' \
  packages/admin/dashboard/src/components/layout/main-layout/main-layout.tsx
# Remove the icon import line for DOMAIN's icon:
perl -pi -e 's/^.*import.*DOMAINIcon.*\n//gm' \
  packages/admin/dashboard/src/components/layout/main-layout/main-layout.tsx
# Note: the nav object may be multi-line — verify the file builds after this step.

# Remove the DOMAIN route registration from route index:
perl -pi -e 's/^.*DOMAIN.*\n//gm' packages/admin/dashboard/src/routes/index.tsx || true
grep -rl "DOMAIN" packages/admin/dashboard/src/dashboard-app/ 2>/dev/null | \
  xargs perl -pi -e 's/^.*DOMAIN.*\n//gm' || true

# Clean i18n keys — remove all keys whose name includes the domain name (case-insensitive):
node -e "
  const fs = require('fs'), glob = require('glob')
  const DOMAIN_LOWER = 'DOMAIN'
  glob.sync('packages/admin/dashboard/src/i18n/**/*.json').forEach(f => {
    const obj = JSON.parse(fs.readFileSync(f, 'utf8'))
    const cleaned = Object.fromEntries(
      Object.entries(obj).filter(([k]) => !k.toLowerCase().includes(DOMAIN_LOWER.toLowerCase()))
    )
    fs.writeFileSync(f, JSON.stringify(cleaned, null, 2) + '\n')
  })
"
```

### Step 9 — JS SDK cleanup

```bash
# Remove the DOMAIN property declaration and its type from the Admin SDK class:
perl -pi -e 's/^.*\bDOMAIN\b.*\n//gm' packages/core/js-sdk/src/admin/index.ts
# Remove the corresponding file import (the per-domain resource file import):
perl -pi -e 's/^.*import.*[Dd][Oo][Mm][Aa][Ii][Nn].*admin\/DOMAIN.*\n//gm' \
  packages/core/js-sdk/src/admin/index.ts
# Verify: check no broken references remain
grep -n "DOMAIN" packages/core/js-sdk/src/admin/index.ts | head -10
```

> **Store SDK note:** The `store/` directory was **already renamed** to `client-sdk/` in Pre-Work (Section 4). During commerce slice removal, we remove only the commerce-specific METHOD files from `ClientSdk` (the storefront resource files: cart, product, region, etc.). The `ClientSdk` class itself and the `client-sdk/` directory **survive** — they are the generic client API SDK. Do not `rm -rf packages/core/js-sdk/src/client-sdk/`.

### Step 10 — Test cleanup

```bash
# Delete module integration tests
rm -rf packages/modules/DOMAIN/integration-tests/

# Delete HTTP integration tests for this domain
rm -rf integration-tests/http/__tests__/DOMAIN/
rm -rf integration-tests/http/__tests__/DOMAIN-*/

# Delete module workflow tests
rm -rf integration-tests/modules/__tests__/DOMAIN/
rm -rf integration-tests/modules/__tests__/DOMAIN-*/

# Delete test factories for this domain's entities
ls integration-tests/factories/ | grep -i DOMAIN
rm -f integration-tests/factories/simple-DOMAIN-*.ts.txt

# Delete any test fixtures referencing this domain
grep -rl "DOMAIN" integration-tests/http/__tests__/__fixtures__/ 2>/dev/null | xargs rm -f || true

# Delete API integration tests (legacy folder)
rm -rf integration-tests/api/__tests__/admin/DOMAIN*/
rm -rf integration-tests/api/__tests__/store/DOMAIN*/

# Slice 1 (store) special note:
# integration-tests/http/__tests__/store/ contains storefront-facing commerce route tests.
# These test /store/* paths against commerce resources — DELETE them.
# After Pre-Work, client API tests (if written) live under integration-tests/http/__tests__/client/
# and test generic /client/* paths. Those are new tests to be written, not migrated.

# Remove DOMAIN from core-flows unit tests
grep -rl "DOMAIN" packages/core/core-flows/src --include="*.spec.ts" -l | xargs rm -f

# Remove framework test fixtures referencing this domain
rm -rf packages/core/framework/src/http/__fixtures__/routers/admin/DOMAIN*/
rm -rf packages/core/framework/src/http/__fixtures__/routers-middleware/webhooks/payment/
```

> **Slice 1 (store) note:** `packages/core/framework/src/http/__fixtures__/routers-middleware/store/` was already updated in Pre-Work to reference `/client` routes. Delete this fixtures directory only if it still contains store-commerce-specific test data (not client API generic test data).

### Step 11 — Documentation cleanup (`/www`)

```bash
# 11a. Delete MDX content directories
rm -rf www/apps/resources/app/commerce-modules/DOMAIN/
rm -rf www/apps/user-guide/app/*/DOMAIN/
rm -rf www/apps/user-guide/app/DOMAIN*/
rm -rf www/apps/book/app/learn/storefront-development/  # when doing last commerce slice

# 11b. Delete TypeDoc-generated reference directories for this domain
rm -rf "www/apps/resources/references/DOMAIN/"
rm -rf "www/apps/resources/references/DOMAIN_models/"  # e.g. cart_models
rm -rf "www/apps/resources/references/DOMAIN_provider/"  # e.g. payment_provider

# 11c. Remove from sidebar configs
# Remove DOMAIN import + entry from commerce-modules sidebar aggregator:
perl -pi -e 's/^.*DOMAIN.*\n//gm' www/apps/resources/sidebars/commerce-modules.mjs || true
# Delete the domain's own sidebar file:
rm -f www/apps/resources/sidebars/DOMAIN.mjs
rm -f www/apps/resources/sidebars/DOMAIN-*.mjs

# Remove DOMAIN sidebar entries from book sidebar (803 lines — JS object format):
# Each domain appears as: { path: "/DOMAIN...", ... } in the config
perl -0777 -pi -e 's/\{[^}]*"path":\s*"\/DOMAIN[^"]*"[^}]*\},?\n?//g' \
  www/apps/book/sidebar.mjs
# Note: sidebar.mjs entries may be multi-line; verify the build passes after this step.

# Remove DOMAIN entries from user-guide sidebar:
perl -0777 -pi -e 's/\{[^}]*"path":\s*"\/DOMAIN[^"]*"[^}]*\},?\n?//g' \
  www/apps/user-guide/sidebar.mjs 2>/dev/null || true

# 11d. Remove from typedoc-generate-references module list
# Remove the "DOMAIN" string entry from the modules array in references.ts:
perl -pi -e 's/^\s*"DOMAIN[^"]*",?\n//gm' \
  www/utils/packages/typedoc-generate-references/src/constants/references.ts
# Delete merger config:
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/DOMAIN.ts

# 11e. Remove from api-reference YAML specs
rm -rf www/apps/api-reference/specs/admin/paths/DOMAIN*/
# For store-facing routes: these were moved to www/apps/api-reference/specs/client/ in
# Pre-Work (see Section 10.4). Remove commerce entries per-slice from specs/client/paths/DOMAIN*/

# 11f. Remove next.config.mjs redirects for this domain (resources app):
perl -0777 -pi -e 's/\{[^}]*source:\s*["'"'"'][^"'"'"']*DOMAIN[^"'"'"']*["'"'"'][^}]*\},?\n?//g' \
  www/apps/resources/next.config.mjs

# 11g. Scan for inline MDX references to this domain
node scripts/docs-remove-domain-references.mjs DOMAIN

# 11h. Run docs prep + build verification (script defined in Section 17)
bash scripts/verify-docs-slice.sh DOMAIN
```

### Step 12 — Verify the slice is clean, then commit

```bash
bash scripts/verify-slice.sh DOMAIN
```

**Success condition:** verify-slice.sh must print `PASS — slice 'DOMAIN' is clean.` and exit 0. If it prints `FAIL`, fix all reported issues before proceeding. Do not commit a failing slice.

```bash
# Explicit verify: no remaining references to DOMAIN in non-test source
REMAINING=$(grep -r "DOMAIN\|Modules\.DOMAIN_UPPER" packages/ --include="*.ts" \
  | grep -v "node_modules\|__tests__\|\.spec\.\|\.test\." | wc -l)
[ "$REMAINING" -eq 0 ] && echo "PASS" || echo "FAIL: $REMAINING remaining references"
```

When `verify-slice.sh` exits 0, commit to create a session resume checkpoint:

```bash
# Record completed slice in progress tracker
node -e "
  const fs = require('fs')
  const p = JSON.parse(fs.readFileSync('.acmekit-progress.json', 'utf8'))
  p.completedSlices.push('DOMAIN')
  p.lastCompletedAt = new Date().toISOString()
  fs.writeFileSync('.acmekit-progress.json', JSON.stringify(p, null, 2))
"
git add -A
git commit -m "feat(rebranding): remove DOMAIN slice"
```

**Resuming after interruption:** Check `.acmekit-progress.json` to see the last completed slice, then start the next one.

---

## 7. Special Handling: Test Infrastructure Cleanup

Beyond per-slice test deletion, these test infrastructure files require attention:

### integration-tests/ Factories (after all slices)
```bash
# After all commerce slices done, delete all commerce factories:
rm -f integration-tests/factories/simple-cart*.ts.txt
rm -f integration-tests/factories/simple-order*.ts.txt
rm -f integration-tests/factories/simple-payment*.ts.txt
rm -f integration-tests/factories/simple-product*.ts.txt
rm -f integration-tests/factories/simple-region*.ts.txt
rm -f integration-tests/factories/simple-sales-channel*.ts.txt
rm -f integration-tests/factories/simple-currency*.ts.txt
rm -f integration-tests/factories/simple-shipping*.ts.txt
rm -f integration-tests/factories/simple-tax*.ts.txt
rm -f integration-tests/factories/simple-price*.ts.txt
rm -f integration-tests/factories/simple-line-item*.ts.txt
rm -f integration-tests/factories/simple-gift-card*.ts.txt
rm -f integration-tests/factories/simple-discount*.ts.txt
rm -f integration-tests/factories/simple-batch-job*.ts.txt
# simple-publishable-api-key: delete only if it contains commerce-specific setup logic
# (if it is purely a generic API key factory it must be kept):
grep -l "cart\|order\|product\|payment\|storefront" \
  integration-tests/factories/simple-publishable-api-key*.ts.txt 2>/dev/null | xargs rm -f || true
```

### integration-tests/ Helpers and Fixtures
```bash
rm -f integration-tests/http/__tests__/__fixtures__/order.ts
rm -f integration-tests/http/__tests__/__fixtures__/shipping.ts
# Delete commerce-specific setup helpers from integration-tests/helpers/:
grep -rl "cart\|order\|product\|payment" integration-tests/helpers/ | xargs rm -f || true
```

### Integration test package.json cleanup
```bash
# integration-tests/http/package.json — remove commerce module deps
# integration-tests/modules/package.json — same
# integration-tests/api/ — delete entire directory (legacy API tests, all commerce)
rm -rf integration-tests/api/
```

### Framework test fixtures (blanket cleanup)
```bash
rm -rf packages/core/framework/src/http/__fixtures__/routers/admin/orders/
rm -rf packages/core/framework/src/http/__fixtures__/routers/admin/products/
rm -rf packages/core/framework/src/http/__fixtures__/routers-middleware/webhooks/payment/
rm -rf packages/core/framework/src/http/__fixtures__/routers-middleware/store/
# Verify no other __fixtures__ dirs reference commerce
grep -r "cart\|order\|product\|payment" packages/core/framework/src --include="*.ts" \
  --include="*.tsx" -l | grep "__fixtures__\|__tests__"
```

---

## 8. Dependencies Cleanup

Commerce-only npm dependencies to remove after all slices are complete:

### packages/medusa/package.json — remove these direct deps
```
/cart, /order, /payment, /product,
/pricing, /promotion, /fulfillment,
/inventory, /tax, /region, /sales-channel,
/stock-location, /currency, /store,
/payment-stripe, /fulfillment-manual,
/link-modules, /draft-order, /core-flows (move to keep)
```

### packages/core/core-flows/package.json — remove commerce-only deps
```
csv-parse      ← only used for product/price-list CSV import/export
json-2-csv     ← same
```

After removing these, run install and verify:
```bash
# Re-generate lockfile and drop stale symlinks from deleted packages:
yarn install

# Confirm no undeclared deps remain:
npx depcheck packages/core/core-flows/
npx depcheck packages/medusa/
```

### Root package.json scripts cleanup
Remove test scripts that reference commerce modules:
```json
// Remove:
"test:integration:packages:slow"  // references workflow-engine-redis,index,product,order,cart
// Update:
"test:integration:packages:fast"  // remove --filter='./packages/modules/{workflow-engine-redis,index,product,order,cart}' exclusion logic
```

### GitHub Actions cleanup
```bash
# Identify workflow files containing commerce domain references:
grep -r "product\|cart\|order\|payment\|fulfillment\|inventory" .github/workflows/ -l
# Remove commerce module entries from generate-public-references.yml:
[ -f .github/workflows/generate-public-references.yml ] && \
  perl -pi -e 's/^\s*(?:cart|order|payment|product|pricing|promotion|fulfillment|inventory|stock-location|region|sales-channel|currency|store|tax),?\n//gm' \
  .github/workflows/generate-public-references.yml
# Remove commerce API route OAS test jobs from oas-test.yml:
[ -f .github/workflows/oas-test.yml ] && \
  perl -pi -e 's/^\s*(?:cart|order|payment|product|pricing|promotion|fulfillment|inventory|stock-location|region|sales-channel|currency|store|tax),?\n//gm' \
  .github/workflows/oas-test.yml
```

---

## 9. "Medusa" Branding Cleanup (String-Level)

All occurrences of "medusa", "Medusa", "MedusaJS", "medusajs" in non-package-name contexts.

### Admin Dashboard i18n translations
Translation files contain hardcoded "Medusa Admin", "Medusa API" strings:
```bash
# Find all translation files with Medusa mentions
grep -rn "Medusa\|medusa" packages/admin/dashboard/src/i18n/translations/ --include="*.json" -l
# Languages affected: tr.json, hu.json, ptPT.json, and likely others

# Batch replace in all translation files
find packages/admin/dashboard/src/i18n/translations/ -name "*.json" \
  -exec perl -pi -e 's/Medusa Admin/AcmeKit Admin/g; s/Medusa API/AcmeKit API/g; s/"Medusa"/"AcmeKit"/g' {} +
```

### Admin Dashboard components (login, layout)
```bash
# Find components with hardcoded Medusa branding
grep -rn "Medusa\|medusa" packages/admin/dashboard/src --include="*.tsx" --include="*.ts" \
  -l | grep -v node_modules | grep -v __tests__
# Common culprits: login page, sidebar header, page title, meta tags
```

### CLI scaffolding templates
```bash
# create-medusa-app scaffolds new projects — update all template strings
grep -rn "medusa\|Medusa" packages/cli/create-medusa-app/src/ --include="*.ts" -l
```

### package.json metadata in all packages
```bash
# All packages (including www/utils and www/apps) have repository.url pointing to
# github.com/medusajs/medusa — update across the entire repo
find packages/ www/utils/ www/packages/ www/apps/ -name "package.json" \
  -not -path "*/node_modules/*" \
  -exec perl -pi -e 's|medusajs/medusa|acmekit/acmekit|g; s|medusajs\.com|acmekit\.dev|g' {} +
```

### Root documentation files
```bash
# README.md: 26 lines to rewrite — replace with AcmeKit-branded content
# CONTRIBUTING.md: 155 lines to rewrite — replace Medusa project details with AcmeKit
# SECURITY.md: 3 lines — update contact/project references
# CHANGELOG.md: replace with a clean AcmeKit CHANGELOG starting from version 1.0.0
# These files contain paragraphs whose meaning changes with context.
# Run the branding batch replace first, then review the result:
perl -pi -e 's/\bMedusa\b/AcmeKit/g; s/\bmedusajs\b/acmekit/g; s/medusajs\.com/acmekit\.dev/g' \
  README.md CONTRIBUTING.md SECURITY.md
# Then manually verify each file reads correctly as an AcmeKit project document.
```

### Telemetry package
```bash
# packages/medusa-telemetry/src/telemeter.js
# - Update any "medusa" in event/property names
# - PostHog stays; just rebrand the event metadata
# - Rename package from /telemetry → @acmekit/telemetry (covered by namespace rename)
grep -n "medusa\|Medusa" packages/medusa-telemetry/src/telemeter.js
```

---

## 10. `www/` Documentation Full Cleanup

> **Claude executor note:** Execute www cleanup in order: 10.2 (delete apps) → 10.3 (gut user-guide) → 10.4 (resources surgery) → 10.5 (TypeDoc) → 10.6 (book) → 10.7 (next.config) → 10.8 (additional dirs) → 10.9 (example replacement) → 10.10 (prose replacement) → 10.11 (UI components). Run `bash scripts/verify-docs-slice.sh all` after completing the full www section.

### 10.1 Build Process Overview (Critical to understand)

```bash
# www/ is a SEPARATE Turbo monorepo — does NOT share root turbo.json
cd www

# ALWAYS run prep before build — generates sidebar files from .mjs configs
# Prep depends on build-scripts and tags packages being built first
yarn prep                    # all apps
# or per-app:
yarn workspace resources prep
yarn workspace book prep
yarn workspace user-guide prep
yarn workspace api-reference prep
yarn workspace bloom prep    # if not deleting
yarn workspace ui prep       # if not deleting

# Build
yarn build
yarn build:resources         # resources only
yarn build:docs              # book only
yarn build:user-guide        # user-guide only
```

**Critical:** Cross-app link validation runs DURING build via `brokenLinkCheckerPlugin`. If you delete content in `resources` that `book` links to, `book`'s build will **fail with a detailed error**. This is your primary verification mechanism.

### 10.2 Apps to DELETE Completely

```bash
# All safe to delete — no other apps link to them critically
rm -rf www/apps/cloud/        # 33 MDX, Medusa Cloud platform (fully delete per user request)
rm -rf www/apps/bloom/        # 43 MDX, AI design tool — commerce + cloud specific
rm -rf www/apps/docs/         # 0 MDX, just a placeholder README for v1.x

# After deleting, remove from www/turbo.json workspaces
# and remove the deleted apps from crossProjects config in remaining apps' next.config.mjs:
grep -rl "cloud\|bloom" www/apps/*/next.config.mjs | \
  xargs perl -pi -e 's/^\s*"cloud",?\n//gm; s/^\s*"bloom",?\n//gm' || true
```

### 10.3 Apps to Keep (but modify heavily)

| App | Action |
|-----|--------|
| `book` | Keep — remove commerce sections from sidebar, delete commerce MDX |
| `resources` | Keep — delete commerce-modules/, storefront-dev/, recipes/, generated references |
| `api-reference` | Keep app shell, delete all commerce YAML specs (all paths under `specs/admin/paths/` and per-slice entries in `specs/client/paths/`), regenerate from your own OpenAPI output |
| `user-guide` | Delete or replace — 100% commerce admin UI guide |
| `ui` | Keep as-is — generic design system docs, zero commerce coupling |

```bash
# Delete user-guide (100% commerce admin operations: orders, products, inventory)
rm -rf www/apps/user-guide/
# Remove from www/turbo.json:
perl -pi -e 's/^\s*"user-guide",?\n//gm' www/turbo.json || true
# Remove from www/package.json workspaces array:
perl -pi -e 's/^\s*"apps\/user-guide",?\n//gm' www/package.json || true
perl -pi -e 's/^\s*"user-guide",?\n//gm' www/package.json || true
# Remove from crossProjects entries in each remaining app's next.config.mjs:
grep -rl "user-guide" www/apps/*/next.config.mjs | \
  xargs perl -pi -e 's/^\s*"user-guide",?\n//gm' || true
# Run yarn install inside www/ to drop the dangling workspace:
(cd www && yarn install) || true
```

### 10.4 `www/apps/resources/` — Surgical Removal

```bash
# IMPORTANT: Before deleting commerce-modules/, move the 5 generic module doc directories
# to a new application-modules/ path. These are kept modules (api-key, auth, customer,
# translation, user) — their doc pages survive under the renamed section.
mkdir -p www/apps/resources/app/application-modules
for MOD in api-key auth customer translation user; do
  [ -d "www/apps/resources/app/commerce-modules/${MOD}" ] && \
    mv "www/apps/resources/app/commerce-modules/${MOD}" \
       "www/apps/resources/app/application-modules/${MOD}"
done
# Verify all 5 were moved:
ls www/apps/resources/app/application-modules/
# Expected: api-key  auth  customer  translation  user

# Also create the application-modules index page (mirrors commerce-modules/page.mdx if present):
[ -f www/apps/resources/app/commerce-modules/page.mdx ] && \
  cp www/apps/resources/app/commerce-modules/page.mdx \
     www/apps/resources/app/application-modules/page.mdx && \
  perl -pi -e 's/commerce modules/application modules/ig; s/Commerce Modules/Application Modules/g' \
    www/apps/resources/app/application-modules/page.mdx

# Delete entire commerce-modules directory (remaining 14 commerce-only modules)
rm -rf www/apps/resources/app/commerce-modules/

# Delete storefront development guides
rm -rf www/apps/resources/app/storefront-development/

# Delete commerce recipes (17 categories, all commerce)
rm -rf www/apps/resources/app/recipes/

# Delete remaining references to nextjs storefront starter
rm -rf www/apps/resources/app/nextjs-starter/

# Delete all commerce sidebar configs (25+ files)
rm -f www/apps/resources/sidebars/commerce-modules.mjs
rm -f www/apps/resources/sidebars/cart.mjs
rm -f www/apps/resources/sidebars/order-module.mjs
rm -f www/apps/resources/sidebars/payment.mjs
rm -f www/apps/resources/sidebars/pricing.mjs
rm -f www/apps/resources/sidebars/product.mjs
rm -f www/apps/resources/sidebars/promotion.mjs
rm -f www/apps/resources/sidebars/fulfillment.mjs
rm -f www/apps/resources/sidebars/inventory.mjs
rm -f www/apps/resources/sidebars/region.mjs
rm -f www/apps/resources/sidebars/sales-channel.mjs
rm -f www/apps/resources/sidebars/store.mjs
rm -f www/apps/resources/sidebars/tax.mjs
rm -f www/apps/resources/sidebars/currency.mjs
rm -f www/apps/resources/sidebars/storefront.mjs
rm -f www/apps/resources/sidebars/recipes.mjs

# Delete commerce-specific UI components
rm -rf www/apps/resources/components/CommerceModuleSections/
# IMPORTANT: Also update the MDX component registry or the resources build will break:
perl -pi -e 's/^.*import.*CommerceModuleSections.*\n//gm' \
  www/apps/resources/components/MDXComponents/index.tsx
perl -pi -e 's/^\s*CommerceModuleSections,?\n//gm' \
  www/apps/resources/components/MDXComponents/index.tsx

# Remove all commerce sidebar imports and the commerce-modules section from resources/sidebar.mjs:
perl -pi -e 's/^.*import.*(?:cart|order|payment|product|pricing|promotion|fulfillment|inventory|region|sales-channel|store|tax|currency|storefront|recipes|commerce-modules).*\n//gm' \
  www/apps/resources/sidebar.mjs
perl -0777 -pi -e 's/\{[^}]*"path":\s*"\/commerce-modules[^"]*"[^}]*\},?\n?//g' \
  www/apps/resources/sidebar.mjs

# IMPORTANT: Update the 5 kept-module sidebar entries to use new /application-modules/ path.
# Any sidebar entry for api-key, auth, customer, translation, user that still points to
# /commerce-modules/ will produce broken links after the directory was moved above.
perl -pi -e 's|/commerce-modules/(api-key\|auth\|customer\|translation\|user)|/application-modules/$1|g' \
  www/apps/resources/sidebar.mjs
# Also update any sidebar .mjs files for those individual modules (kept sidebars):
for MOD in api-key auth customer translation user; do
  [ -f "www/apps/resources/sidebars/${MOD}.mjs" ] && \
    perl -pi -e "s|/commerce-modules/${MOD}|/application-modules/${MOD}|g" \
      "www/apps/resources/sidebars/${MOD}.mjs"
done

# Delete ALL TypeDoc-generated reference directories for commerce modules
# (These are in www/apps/resources/references/ but served via [...slug] route)
# They are generated content — delete the SOURCE from generated/ files too
rm -rf www/apps/resources/generated/generated-commerce-modules-sidebar.mjs
# Check what other generated files exist:
ls www/apps/resources/generated/
# Delete generated sidebars for commerce domains

# Commerce YAML specs in api-reference — admin paths
rm -rf www/apps/api-reference/specs/admin/paths/cart*/
rm -rf www/apps/api-reference/specs/admin/paths/order*/
rm -rf www/apps/api-reference/specs/admin/paths/payment*/
rm -rf www/apps/api-reference/specs/admin/paths/product*/
rm -rf www/apps/api-reference/specs/admin/paths/pricing*/
rm -rf www/apps/api-reference/specs/admin/paths/promotion*/
rm -rf www/apps/api-reference/specs/admin/paths/fulfillment*/
rm -rf www/apps/api-reference/specs/admin/paths/inventory*/
rm -rf www/apps/api-reference/specs/admin/paths/shipping*/
rm -rf www/apps/api-reference/specs/admin/paths/region*/
rm -rf www/apps/api-reference/specs/admin/paths/sales-channel*/
rm -rf www/apps/api-reference/specs/admin/paths/currency*/
rm -rf www/apps/api-reference/specs/admin/paths/tax*/
rm -rf www/apps/api-reference/specs/admin/paths/stock-location*/
rm -rf www/apps/api-reference/specs/admin/paths/return*/
rm -rf www/apps/api-reference/specs/admin/paths/claim*/
rm -rf www/apps/api-reference/specs/admin/paths/exchange*/

# Client API specs — the old www/apps/api-reference/specs/store/ directory
# was MOVED (not deleted) to www/apps/api-reference/specs/client/ as part of Pre-Work (Section 4).
# The client/ specs directory SURVIVES as the client API reference.
# Commerce-specific endpoint entries (cart, product, region, etc.) within those specs
# ARE deleted per-slice during their respective slice removals (Step 11e above).
# Do NOT rm -rf the entire specs/client/ directory here.
```

### 10.5 TypeDoc References Cleanup

The auto-generated TypeDoc content lives in two places:
1. `www/apps/resources/references/` — served via `[...slug]/page.tsx`
2. `www/utils/packages/typedoc-generate-references/` — the generator

```bash
# Step 1: Remove commerce modules from the generator's module list
# Remove commerce domain entries from the modules array in references.ts:
perl -pi -e 's/^\s*"(?:cart|currency|fulfillment|inventory-next|order|payment|pricing|product|promotion|region|sales-channel|stock-location-next|store|tax)",?\n//gm' \
  www/utils/packages/typedoc-generate-references/src/constants/references.ts
# Keep: api-key, auth, customer, translation, user

# Step 2: Delete commerce merger configs (all 14 commerce domains):
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/cart.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/order.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/payment.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/product.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/pricing.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/promotion.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/fulfillment.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/inventory.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/stock-location.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/region.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/sales-channel.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/currency.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/store.ts
rm -f www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/tax.ts

# Step 3: Delete the already-generated reference content
# These directories are under www/apps/resources/references/ and served dynamically
# Find them via generated-references-sidebar.mjs (299 KB) — it lists all paths
grep -o '"path":"[^"]*"' www/apps/resources/generated/generated-references-sidebar.mjs | \
  grep -E "cart|order|product|payment|fulfillment|inventory|pricing|promotion|region|sales.channel|stock.location|currency|store|tax" | \
  sed 's/"path":"//;s/"//' | sort -u
# Delete each corresponding subdirectory under www/apps/resources/references/ (handled by [...slug])
```

### 10.6 book app cleanup

```bash
# Delete commerce sections from sidebar (sidebar.mjs is 803 lines)
# Sections to remove: Storefront Development, Commerce Modules references,
#                     AI Assistants and LLMs, From v1 to v2, Codemods

# Delete storefront development content
rm -rf www/apps/book/app/learn/storefront-development/
# Remove its sidebar entry from www/apps/book/sidebar.mjs:
# Exact entry (sidebar.mjs lines 584-589):
# { type: "link", path: "/learn/storefront-development", title: "Storefront Development", chapterTitle: "Storefront" }
perl -0777 -pi -e 's/\{\s*\n\s*type:\s*"link",\s*\n\s*path:\s*"\/learn\/storefront-development",\s*\n\s*title:\s*"Storefront Development",\s*\n\s*chapterTitle:\s*"Storefront",?\s*\n\s*\},?\n?//g' \
  www/apps/book/sidebar.mjs

# Delete the Commerce Modules guide page (inside fundamentals/modules/, NOT the same as
# resources/app/commerce-modules/ which is handled in Section 10.4)
rm -rf www/apps/book/app/learn/fundamentals/modules/commerce-modules/
# Remove its sidebar entry from www/apps/book/sidebar.mjs:
perl -0777 -pi -e 's/\{[^}]*"path":\s*"[^"]*commerce-modules[^"]*"[^}]*\},?\n?//g' \
  www/apps/book/sidebar.mjs

# Delete the build-with-llms-ai page (Bloom AI assistant — Bloom app is deleted)
rm -rf www/apps/book/app/learn/introduction/build-with-llms-ai/
# Remove its sidebar entry from www/apps/book/sidebar.mjs:
# Exact entry (sidebar.mjs lines 28-32):
# { type: "link", title: "AI Assistants and LLMs", path: "/learn/introduction/build-with-llms-ai" }
perl -0777 -pi -e 's/\{\s*\n\s*type:\s*"link",\s*\n\s*title:\s*"AI Assistants and LLMs",\s*\n\s*path:\s*"\/learn\/introduction\/build-with-llms-ai",?\s*\n\s*\},?\n?//g' \
  www/apps/book/sidebar.mjs

# Delete the "From v1 to v2" migration guide page (Medusa-version-specific, not AcmeKit content)
rm -rf www/apps/book/app/learn/introduction/from-v1-to-v2/
# Remove its sidebar entry from www/apps/book/sidebar.mjs:
# Exact entry (sidebar.mjs lines 38-42):
# { type: "link", title: "From v1 to v2", path: "/learn/introduction/from-v1-to-v2" }
perl -0777 -pi -e 's/\{\s*\n\s*type:\s*"link",\s*\n\s*title:\s*"From v1 to v2",\s*\n\s*path:\s*"\/learn\/introduction\/from-v1-to-v2",?\s*\n\s*\},?\n?//g' \
  www/apps/book/sidebar.mjs

# Delete the codemods pages (Replace Imports, Replace Zod Imports — Medusa-specific migration tooling)
rm -rf www/apps/book/app/learn/codemods/
# Remove its sidebar entry (with children) from www/apps/book/sidebar.mjs:
# Exact entry (sidebar.mjs lines 756-771) — multi-level with children array,
# use a wider window match to capture the whole subtree:
# Dry-run first (print the matched block to confirm before in-place edit):
perl -0777 -e 's/(\{\s*\n\s*type:\s*"link",\s*\n\s*path:\s*"\/learn\/codemods",\s*\n\s*title:\s*"Codemods",\s*\n\s*children:\s*\[.*?\],?\s*\n\s*\},?\n?)/MATCHED: $1/gs; print' \
  www/apps/book/sidebar.mjs | grep -A20 "MATCHED:" || echo "No match — review pattern manually before proceeding"
# Then apply in-place:
perl -0777 -pi -e 's/\{\s*\n\s*type:\s*"link",\s*\n\s*path:\s*"\/learn\/codemods",\s*\n\s*title:\s*"Codemods",\s*\n\s*children:\s*\[.*?\],?\s*\n\s*\},?\n?//gs' \
  www/apps/book/sidebar.mjs

# Verify sidebar is still valid JS after removals (no syntax errors):
# (Use dynamic import — stdin ESM via --input-type=module does not support `export` statements)
node -e "import('./www/apps/book/sidebar.mjs').then(() => console.log('sidebar.mjs OK')).catch(e => { console.error('SYNTAX ERROR:', e.message); process.exit(1) })"

# Find any remaining MDX pages with CommerceModulesSection component import
grep -rn "CommerceModulesSection\|commerce-modules" www/apps/book/app --include="*.mdx" -l

# Homepage UI components — see Section 10.11 for full per-component action list
```

### 10.7 next.config.mjs cleanup (all apps)

```bash
# Each remaining app's next.config.mjs needs:
# 1. Remove commerce redirects:
perl -0777 -pi -e 's/\{[^}]*source:\s*["'"'"'][^"'"'"']*(?:cart|order|product|payment|fulfillment|inventory|region|promotion|storefront|commerce)[^"'"'"']*["'"'"'][^}]*\},?\n?//g' \
  www/apps/resources/next.config.mjs

# 2. Remove crossProjects entries for deleted apps:
grep -rl "cloud\|bloom\|user-guide" www/apps/*/next.config.mjs | \
  xargs perl -pi -e 's/^\s*"(?:cloud|bloom|user-guide)",?\n//gm' || true
```

### 10.8 Additional resources/ directories to delete

```bash
# Commerce how-to tutorials (13 files — all commerce: discounts, product reviews, loyalty, abandoned cart, etc.)
rm -rf www/apps/resources/app/how-to-tutorials/tutorials/

# Commerce examples (3 files — custom item pricing, quote management)
rm -rf www/apps/resources/app/examples/

# Commerce plugin guide (wishlist)
rm -rf www/apps/resources/app/plugins/guides/wishlist/

# Commerce-specific troubleshooting pages (keep framework troubleshooting)
rm -rf www/apps/resources/app/troubleshooting/payment/
rm -rf www/apps/resources/app/troubleshooting/s3/   # S3 troubleshooting page is commerce-context-specific (storefront file upload); the generic file-s3 provider docs are in infrastructure-modules/file/ not here
rm -rf www/apps/resources/app/troubleshooting/storefront-missing-pak/
rm -rf www/apps/resources/app/troubleshooting/storefront-pak-sc/
```

### 10.9 Framework Docs That Use Commerce Examples — Replace, Not Delete

> **Critical distinction**: Some core framework documentation (workflows, events, modules) uses commerce concepts as *examples* in code blocks — but the doc itself teaches a generic framework concept. These files must **not** be deleted. Instead, replace the commerce example code with a generic equivalent.

**Rule**: If the file lives outside `commerce-modules/`, `storefront-development/`, `recipes/`, `storefront-development/` — it is framework documentation. If it happens to import `/cart`, `/product`, use `order.placed` events, or reference `syncProductToErpWorkflow`, replace the example code. Do not delete the page.

#### Known files requiring example replacement:

| File | Commerce example used | Suggested replacement |
|---|---|---|
| `www/apps/book/app/learn/fundamentals/events-and-subscribers/page.mdx` | `order.placed` event name as main example | Replace with generic event like `"custom.user-created"` or `"account.registered"` |
| `www/apps/book/app/learn/fundamentals/scheduled-jobs/page.mdx` | `syncProductToErpWorkflow` as example workflow | Replace with `syncDataWorkflow` or `cleanupExpiredSessionsWorkflow` |
| `www/apps/book/app/learn/customization/extend-features/page.mdx` | Product Module used as example for module-linking concept | Replace with custom generic module example (e.g., `BlogModule` or `BrandModule`) |
| `www/apps/book/app/learn/customization/extend-features/extend-create-product/page.mdx` | Extends product-creation workflow | Rewrite to extend a generic workflow (e.g., `createUserWorkflow`) |
| `www/apps/book/app/learn/customization/extend-features/query-linked-records/page.mdx` | Queries linked product records | Rewrite to query linked records on a generic module |

#### How to find additional files needing replacement:

```bash
# Broad scan: find ALL surviving framework docs that reference commerce packages in code blocks
# Run this across all framework-relevant directories (not just the known ones)
grep -rn "/cart\|/product\|/order\|/payment\|/pricing\|/fulfillment\|/inventory\|/region\|/promotion" \
  www/apps/book/app/learn/ \
  www/apps/resources/app/infrastructure-modules/ \
  www/apps/resources/app/service-factory-reference/ \
  www/apps/resources/app/data-model-repository-reference/ \
  www/apps/resources/app/medusa-cli/ \
  www/apps/resources/app/admin-components/ \
  www/apps/resources/app/test-tools-reference/ \
  www/apps/resources/app/troubleshooting/ \
  www/apps/resources/app/integrations/ \
  www/apps/resources/app/how-to-tutorials/how-to/ \
  --include="*.mdx" -l

# Find commerce event names used in framework examples
grep -rn '"order\.\|"product\.\|"cart\.\|"payment\.\|"fulfillment\.' \
  www/apps/book/app/learn/ \
  --include="*.mdx"

# Any file in kept directories that mentions commerce domain names in prose
grep -rn "\bcart\b\|\bproduct\b\|\bcheckout\b\|\bfulfillment\b\|\binventory\b" \
  www/apps/book/app/learn/fundamentals/ \
  www/apps/book/app/learn/configurations/ \
  www/apps/book/app/learn/deployment/ \
  www/apps/resources/app/infrastructure-modules/ \
  --include="*.mdx" -l | grep -v node_modules
```

> **Decision rule for files found by the above:** If the file is a framework doc (workflow, events, modules, CLI) that uses a commerce *name* only as an example in a code snippet — replace the example. If the file is a guide that requires commerce infrastructure to function (e.g., explains how to build a checkout) — delete it.

#### Replacement strategy:

1. For **event examples**: Use `"custom.event-name"` or `"account.created"` — names that make no reference to commerce entities
2. For **workflow examples**: Use a generic domain: authentication workflows, scheduled data jobs, user management workflows
3. For **module-linking examples**: The `customization/extend-features/` section should use a fictional `BlogModule` or `BrandModule` as its example subject — replace all Product references with this
4. For **data model examples**: Use `User`, `Account`, `Organization`, `Workspace` as generic entity names

### 10.10 Docs Identity Prose Replacement (Commerce → Generic Framework)

Beyond deleting files and replacing code examples, the surviving pages in `book/` and `resources/` describe AcmeKit (formerly Medusa) as a **commerce platform** in their prose. Every surviving page that contains commerce-identity language must have that prose rewritten to describe AcmeKit as a **general-purpose application framework**.

> **Scope**: This is NOT about code examples (covered in Section 10.9). This is about narrative prose — page introductions, descriptions, headings, taglines, and architectural overviews that characterize what the framework IS.

#### Pages requiring full prose rewrite

| File | Current language | Replace with |
|---|---|---|
| `www/apps/book/app/learn/page.mdx` | "Medusa is a digital commerce platform" — intro page defines entire framework as commerce | Rewrite to: "AcmeKit is a general-purpose application framework for building any vertical (SaaS, fintech, blockchain, etc.)" |
| `www/apps/book/app/learn/introduction/architecture/page.mdx` | "Medusa is a headless commerce platform. So, storefronts, admin dashboards..." | Rewrite architecture overview without storefront/commerce framing |
| `www/apps/book/app/learn/introduction/build-with-llms-ai/page.mdx` | References to Bloom as "AI-powered commerce assistant", "ecommerce store" | Update or delete if Bloom app is deleted |
| `www/apps/book/app/learn/deployment/page.mdx` | Image alt text references "ecommerce functionality" | Update alt text and any surrounding prose |

#### Concrete commands for homepage and architecture page rewrites

For `www/apps/book/app/learn/page.mdx`:
```bash
# Delete paragraphs containing commerce-identity nouns:
perl -0777 -pi -e 's/<p>[^<]*(?:Commerce Modules|online store|merchants|storefront)[^<]*<\/p>\n?//g' \
  www/apps/book/app/learn/page.mdx
# Replace the opening description sentence:
perl -pi -e 's/Medusa is a digital commerce platform[^.]*\./AcmeKit is a general-purpose application framework for building SaaS, fintech, blockchain, and any other vertical. It gives you a workflow engine, module system, auth, events, notifications, file storage, and an extensible admin dashboard — all as modular building blocks./g' \
  www/apps/book/app/learn/page.mdx
```

For `www/apps/book/app/learn/introduction/architecture/page.mdx`:
```bash
# Replace headless commerce framing in the architecture overview:
perl -pi -e 's/Medusa is a headless commerce platform[^.]*\./AcmeKit is a headless application framework./g' \
  www/apps/book/app/learn/introduction/architecture/page.mdx
perl -pi -e 's/storefronts, admin dashboards/client applications, admin dashboards/g' \
  www/apps/book/app/learn/introduction/architecture/page.mdx
```

For `www/apps/book/app/learn/deployment/page.mdx`:
```bash
# Replace ecommerce image alt text and surrounding prose:
perl -pi -e 's/ecommerce functionality/application functionality/gi' \
  www/apps/book/app/learn/deployment/page.mdx
```

#### Global prose patterns to find and replace across all surviving docs

```bash
# Find all surviving framework docs with commerce-identity prose
grep -rn \
  "commerce platform\|commerce framework\|digital commerce\|headless commerce\|ecommerce\|e-commerce\|online store\|Medusa is a\|commerce functionalities\|commerce operations\|commerce application\|Commerce Modules" \
  www/apps/book/app/learn/fundamentals/ \
  www/apps/book/app/learn/introduction/ \
  www/apps/book/app/learn/configurations/ \
  www/apps/book/app/learn/deployment/ \
  www/apps/book/app/learn/debugging-and-testing/ \
  www/apps/book/app/learn/customization/ \
  www/apps/resources/app/infrastructure-modules/ \
  www/apps/resources/app/medusa-cli/ \
  www/apps/resources/app/admin-components/ \
  www/apps/resources/app/troubleshooting/ \
  --include="*.mdx" --include="*.md" | grep -v node_modules
```

#### Replacement map

| Find (prose) | Replace with |
|---|---|
| `Medusa is a digital commerce platform` | `AcmeKit is a general-purpose application framework` |
| `Medusa is a headless commerce platform` | `AcmeKit is a headless application framework` |
| `commerce platform` | `application framework` |
| `commerce framework` | `application framework` |
| `digital commerce` | `digital application` |
| `headless commerce` | `headless framework` |
| `ecommerce` / `e-commerce` | remove or replace with `application` |
| `Commerce Modules` (proper noun, Medusa terminology) | `Domain Modules` or `Feature Modules` |
| `commerce functionalities` | `core features` |
| `commerce operations` | `operations` |
| `commerce application` | `application` |
| `storefront` (in prose describing what clients connect to AcmeKit) | `client application` or `frontend application` |
| `store` (referring to an e-commerce store concept) | `application` or `project` |
| `merchants` | `developers` or `teams` |
| `Medusa's admin dashboard for merchants` | `AcmeKit's admin dashboard` |

#### Batch replace for clear-cut cases

> **Run Section 10.10 batch perl AFTER all per-slice Step 11g cleanups are complete** — the per-slice script handles domain-name references; this batch handles identity/branding language. Running both in the correct order avoids re-scanning already-deleted files.

> **Delete files marked for manual deletion BEFORE running batch perl** — specifically `www/apps/book/app/learn/introduction/build-with-llms-ai/page.mdx` (Bloom page, deleted with Bloom app) and `www/apps/book/app/learn/fundamentals/modules/commerce-modules/` contain commerce identifiers inside code blocks (e.g. `ecommerce-storefront` as a CLI package name) that the perl substitution would mangle into `application-storefront`. Delete those first, then run the batch.

```bash
# Step 1: Delete pages with commerce identifiers in code blocks first
rm -rf www/apps/book/app/learn/introduction/build-with-llms-ai/
rm -rf www/apps/book/app/learn/fundamentals/modules/commerce-modules/
# Remove their entries from www/apps/book/sidebar.mjs before building

# Step 2: Run batch replace on remaining surviving MDX/MD files
find www/apps/book www/apps/resources www/apps/ui \
  \( -name "*.mdx" -o -name "*.md" \) | \
  grep -v "node_modules\|commerce-modules\|storefront-development\|recipes\|user-guide\|build-with-llms-ai" | \
  xargs perl -pi -e '
    s/commerce platform/application framework/gi;
    s/headless commerce/headless framework/gi;
    s/digital commerce/digital application/gi;
    s/Commerce Modules/Domain Modules/g;
    s/ecommerce/application/gi;
    s/e-commerce/application/gi;
  '

# Step 3: Replace competitive-framing sentences in fundamentals pages.
# These pages contain phrases like "Other commerce platforms don't have this capability"
# which the batch replace above turns into semantically incoherent "Other application frameworks..."
# Instead use targeted replacement:
grep -n "other.*platform\|compared to\|unlike other\|instead of.*commerce" \
  www/apps/book/app/learn/fundamentals/framework/page.mdx \
  www/apps/book/app/learn/fundamentals/workflows/page.mdx \
  www/apps/book/app/learn/fundamentals/events-and-subscribers/page.mdx \
  www/apps/book/app/learn/fundamentals/modules/page.mdx
# Replace "Other [commerce/ecommerce] platforms" → "Other frameworks":
perl -pi -e 's/[Oo]ther (commerce|ecommerce) platforms/Other frameworks/g' \
  www/apps/book/app/learn/fundamentals/framework/page.mdx \
  www/apps/book/app/learn/fundamentals/workflows/page.mdx \
  www/apps/book/app/learn/fundamentals/events-and-subscribers/page.mdx \
  www/apps/book/app/learn/fundamentals/modules/page.mdx
# Verify no remaining commerce-context comparisons:
grep -n "other.*platform\|compared to\|unlike other\|instead of.*commerce" \
  www/apps/book/app/learn/fundamentals/framework/page.mdx \
  www/apps/book/app/learn/fundamentals/workflows/page.mdx \
  www/apps/book/app/learn/fundamentals/events-and-subscribers/page.mdx \
  www/apps/book/app/learn/fundamentals/modules/page.mdx

# Step 4: Verify remaining commerce-identity terms
grep -rn "commerce platform\|headless commerce\|ecommerce\|e-commerce\|Commerce Modules" \
  www/apps/book/app/learn/ www/apps/resources/app/ \
  --include="*.mdx" | grep -v node_modules | head -30
```

> **After batch replace:** Run `cd www && yarn build:resources && yarn build:docs` and verify both builds exit 0. If the introduction or architecture pages still contain commerce framing, apply the targeted Step 3 commands above to those files as well.

### 10.11 book App UI Components Requiring Rewrite

The `book` app homepage (`www/apps/book/app/page.tsx`) renders several React components under `www/apps/book/components/Homepage/` that contain commerce-specific content. These are `.tsx` files — not MDX prose — so the batch perl in Section 10.10 does not affect them. Each requires an explicit action.

#### Per-component action list

| Component | Commerce content | Action |
|---|---|---|
| `CommerceModulesSection/index.tsx` + `Newsletter/` | Renders a grid of commerce modules (Cart, Order, Product...) as the framework's main selling point | **Rewrite** — replace with generic Infrastructure Modules grid (see rewrite target below) |
| `FrameworkSection/index.tsx` | Lines 34 & 39: "digital commerce platform", "customize and extend the behavior of your commerce platform" | **Rewrite prose strings** — replace with generic framework description |
| `LinksSection/index.tsx` | Line 53: "Explore storefront starter", "Build custom storefront", `ecommerce-storefront-best-practices` anchor | **Remove** storefront-related link entries; keep generic framework links |
| `RecipesSection/index.tsx` | Renders grid of commerce recipe links (bundled-products, subscriptions, digital-products) | **Delete from homepage** — the entire recipes section is removed from resources (Section 10.4); remove `<RecipesSection />` from `page.tsx` and delete `RecipesSection/` |
| `CodeTabs/index.tsx` | Line 178: "Build custom modules with commerce or architectural features"; lines 268-300: `order.placed` event, `createOrderStep`, `createFulfillmentStep` as code examples | **Rewrite code examples** per Section 10.9 replacement strategy (generic event names, generic workflow steps) |
| `Bloom/index.tsx` | Line 65: "Hello! I'm Bloom, your go-to ecommerce assistant" | **Delete entirely** — Bloom app is deleted (Section 10.2); remove `<Bloom />` from `page.tsx` and delete `Bloom/` |

```bash
# Verify no other Homepage components with commerce content:
grep -rn "commerce\|Commerce\|storefront\|ecommerce\|cart\|order\|product\|payment" \
  www/apps/book/components/Homepage/ \
  --include="*.tsx" | grep -v node_modules
```

#### Rewrite target for CommerceModulesSection

Replace the commerce module grid with a generic infrastructure modules showcase. Keep the existing grid layout and `Newsletter/` sub-component structure — only the module content changes:

| Module | Description |
|---|---|
| Workflows | Saga-based distributed workflow engine with compensation |
| Auth | Multi-provider authentication (emailpass, OAuth) |
| Events | Local and Redis-backed event bus |
| Notifications | Multi-channel notification system |
| File Storage | Pluggable file provider (local, S3) |
| Cache | Redis and in-memory cache |
| Analytics | Event tracking (PostHog and custom providers) |
| API Keys | Scoped API key management |
| Users & RBAC | User management with role-based access control |

### 10.12 Top-Nav Dropdown Cleanup (`www/packages/docs-ui/src/constants.tsx`)

The global navigation dropdown (`navDropdownItems` in `www/packages/docs-ui/src/constants.tsx`) is shared across all docs apps via `@/packages/docs-ui`. It contains two areas requiring changes:

#### 10.12.1 — Rename "Commerce Modules" sub-menu → "Application Modules"; remove commerce items

The `"Commerce Modules"` sub-menu (constants.tsx lines 85-185) currently lists 19 modules. Remove the 14 commerce-specific ones; keep the 5 generic ones and rename the section.

**Remove these items** (commerce-specific):
`Cart`, `Currency`, `Fulfillment`, `Inventory`, `Order`, `Payment`, `Pricing`, `Product`, `Promotion`, `Region`, `Sales Channel`, `Stock Location`, `Store`, `Tax`

**Keep these items** (generic infrastructure/platform):
`API Key`, `Auth`, `Customer`, `Translation`, `User`

**Rename the sub-menu**: `"Commerce Modules"` → `"Application Modules"`

**Update the sub-menu link**: `"/resources/commerce-modules"` → `"/resources/application-modules"`

```bash
# Step 1: Rename sub-menu title and top-level link
perl -pi -e 's|title: "Commerce Modules"|title: "Application Modules"|g' \
  www/packages/docs-ui/src/constants.tsx
perl -pi -e 's|link: "/resources/commerce-modules",|link: "/resources/application-modules",|g' \
  www/packages/docs-ui/src/constants.tsx

# Step 2: Remove the 14 commerce-specific link entries from the items array.
# Each entry is a 4-line block of the form:
#   {
#     type: "link",
#     title: "<Title>",
#     link: "/resources/commerce-modules/<slug>",
#   },
# Use perl multi-line delete for each:
for SLUG in cart currency fulfillment inventory order payment pricing product promotion region sales-channel stock-location store tax; do
  perl -0777 -pi -e "s/\\s*\\{\\s*\\n\\s*type: \"link\",\\s*\\n\\s*title: \"[^\"]+\",\\s*\\n\\s*link: \"[^\"]*\\/commerce-modules\\/${SLUG}\",?\\s*\\n\\s*\\},?//g" \
    www/packages/docs-ui/src/constants.tsx
done

# Step 3: Update the 5 remaining item links from /resources/commerce-modules/ to /resources/application-modules/
# These are api-key, auth, customer, translation, user — whose pages were moved in Section 10.4.
perl -pi -e 's|link: "/resources/commerce-modules/(api-key\|auth\|customer\|translation\|user)"|link: "/resources/application-modules/$1"|g' \
  www/packages/docs-ui/src/constants.tsx

# Step 4: Verify exactly 5 entries remain under Application Modules (expected count: 5):
echo "Remaining /resources/application-modules item links:"
grep -c 'link: "/resources/application-modules/' www/packages/docs-ui/src/constants.tsx
# Expected output: 6 (1 for the sub-menu top link + 5 item links)
# OR check only item links:
grep 'link: "/resources/application-modules/' www/packages/docs-ui/src/constants.tsx
# Expected: api-key, auth, customer, translation, user (5 items) + sub-menu link (1)

# Step 5: No commerce-modules item links should remain:
grep 'link: "/resources/commerce-modules/' www/packages/docs-ui/src/constants.tsx && \
  echo "WARNING: commerce-modules refs remain — delete them manually" || echo "Clean"
```

> **Claude executor note**: The perl loop in Step 2 matches by URL slug. If any entry has an unexpected title-slug combination the grep won't catch it, but the URL slug pattern is reliable. After Step 5 reports "Clean", double-check the block between `title: "Application Modules"` and the closing `],` contains only: API Key, Auth, Customer, Translation, User. Delete any stray entries by hand if needed.

#### 10.12.2 — Remove "Storefront" link from the "Build" dropdown

The `"Build"` dropdown (constants.tsx ~lines 231-260) contains a `"Storefront"` link pointing to `/resources/storefront-development`. Remove it — storefront development is being deleted.

```bash
# Remove the Storefront link entry from the Build dropdown:
perl -0777 -pi -e 's/\s*\{\s*\n\s*type: "link",\s*\n\s*title: "Storefront",\s*\n\s*link: "\/resources\/storefront-development",\s*\n\s*sidebar_id: "storefront-development",?\s*\n\s*\},?//g' \
  www/packages/docs-ui/src/constants.tsx
```

#### 10.12.3 — Verify docs-ui compiles after changes

```bash
# Type-check docs-ui to catch any broken imports or refs:
yarn workspace docs-ui build 2>&1 | tail -20
```

---

## 11. Link-Modules Partial Deletion

`packages/modules/link-modules/` is **NOT fully deleted** — 3 of 41 definition files are kept.

### Files to DELETE (38 files, commerce entity relationships):

**definitions/ (19 files):**
`cart-payment-collection.ts`, `cart-promotion.ts`, `fulfillment-provider-location.ts`, `fulfillment-set-location.ts`, `order-cart.ts`, `order-claim-payment-collection.ts`, `order-exchange-payment-collection.ts`, `order-fulfillment.ts`, `order-payment-collection.ts`, `order-promotion.ts`, `order-return-fulfillment.ts`, `product-sales-channel.ts`, `product-shipping-profile.ts`, `product-variant-inventory-item.ts`, `product-variant-price-set.ts`, `publishable-api-key-sales-channel.ts`, `region-payment-provider.ts`, `sales-channel-location.ts`, `shipping-option-price-set.ts`

**definitions/readonly/ (10 files):**
`cart-customer.ts`, `cart-product.ts`, `cart-region.ts`, `cart-sales-channel.ts`, `cart-shipping-option.ts`, `line-item-adjustment-promotion.ts`, `order-customer.ts`, `order-product.ts`, `order-region.ts`, `order-sales-channel.ts`

**Also delete:**
- `inventory-level-stock-location.ts` ← **DELETE** — the inventory module is removed entirely, so the link between inventory levels and stock locations is also removed
- `product-translation.ts` ← delete (product is removed)
- `store-currency.ts` ← delete (store + currency are removed)
- `store-locale.ts` ← delete (store is removed; locale handling stays in framework/translation module)

### Files to KEEP (3 files):
- `definitions/invite-rbac-role.ts` ← RBAC infrastructure
- `definitions/user-rbac-role.ts` ← RBAC infrastructure
- `definitions/readonly/customer-account-holder.ts` ← Customer/auth account linking

After partial deletion, `link-modules` becomes a minimal package. If the 3 remaining links can be moved elsewhere (e.g., into their respective module packages), the entire `link-modules` package can be deleted.

---

## 12. Core Package Surgery (Targeted File Edits)

Files kept but requiring specific edits — not deleted.

### 12.1 `packages/core/utils/src/modules-sdk/definition.ts`

Remove from `Modules` enum AND from `MODULE_PACKAGE_NAMES` / `REVERSED_MODULE_PACKAGE_NAMES`:
`CART`, `PAYMENT`, `PRICING`, `PRODUCT`, `PROMOTION`, `FULFILLMENT`, `STOCK_LOCATION`, `TAX`, `REGION`, `ORDER`, `CURRENCY`, `SALES_CHANNEL`, `STORE`

Keep: `API_KEY`, `AUTH`, `CACHE`, `CACHING`, `EVENT_BUS`, `FILE`, `NOTIFICATION`, `USER`, `LOCKING`, `WORKFLOW_ORCHESTRATION`, `ANALYTICS`, `INDEX`, `CUSTOMER`, `SETTINGS`, `TRANSLATION`, `RBAC`, `MODULES_SDK`, `AUTH_PROVIDER`

### 12.2 `packages/core/utils/src/common/define-config.ts`

Remove from default auto-loaded modules (keep only generic ones):
- Remove: Stock Location, Inventory, Product, Pricing, Promotion, Sales Channel, Cart, Region, Tax, Currency, Payment, Order, Store
- Keep: API Key, Auth, Cache, Event Bus, File, Notification, Locking, User, RBAC, Settings, Translation, Analytics, Workflow Engine, Index, Customer

Remove `DEFAULT_STORE_RESTRICTED_FIELDS` constant and any reference to it.

### 12.3 `packages/core/framework/src/types/container.ts`

Remove from `ModuleImplementations`:
`ICartModuleService`, `IPaymentModuleService`, `IProductModuleService`, `IOrderModuleService`, `IPromotionModuleService`, `IFulfillmentModuleService`, `IInventoryService`, `IStockLocationService`, `IRegionModuleService`, `ISalesChannelModuleService`, `ITaxModuleService`, `ICurrencyModuleService`, **`IStoreModuleService`**

Keep: `IAuthModuleService`, `IApiKeyModuleService`, `ICacheService`, `IEventBusModuleService`, `IFileModuleService`, `INotificationModuleService`, `IUserModuleService`, `IWorkflowEngineService`, `IAnalyticsModuleService`, `IIndexModuleService`, `ICustomerModuleService`, `IRbacModuleService`, `ISettingsModuleService`, `ITranslationModuleService`

### 12.4 `packages/core/framework/src/http/router.ts`

> **Already done in Pre-Work (Section 4) — skip.**

The `/store` → `/client` prefix rename and `#applyStorePublishableKeyMiddleware` → `#applyClientKeyMiddleware` rename were performed in Pre-Work. No further action required here.

### 12.5 `packages/core/types/src/common/config-module.ts`

> **Already done in Pre-Work (Section 4.3.4) — skip.** `storeCors` was renamed to `clientCors` as part of the client API rename.

### 12.6 `packages/core/framework/src/http/middlewares/`

> **Already done in Pre-Work (Section 4) — skip.**

`ensure-publishable-api-key.ts` was updated (not deleted) in Pre-Work. It now enforces `x-client-api-key` on `/client` routes and is a permanent part of the codebase.

---

## 13. Dashboard Navigation Rebuild

After all route deletions, rewrite navigation:

```typescript
// packages/admin/dashboard/src/hooks/use-core-routes.tsx (or equivalent)
const coreRoutes = [
  { path: "/",                    label: "Home",          icon: HomeIcon },
  { path: "/workflow-executions", label: "Workflows",     icon: ArrowPathIcon },
  { path: "/api-key-management",  label: "API Keys",      icon: KeyIcon },
  { path: "/users",               label: "Users",         icon: UsersIcon },
  { path: "/translations",        label: "Translations",  icon: LanguageIcon },
  { path: "/settings",            label: "Settings",      icon: CogIcon },
]
// Remove: Orders, Products, Inventory, Customers, Promotions,
//         Price Lists, Regions, Tax Regions, Shipping, etc.
```

---

## 14. JS SDK Cleanup

```bash
# Admin SDK — remove 32 commerce-specific method properties
# packages/core/js-sdk/src/admin/
# Remove: order, draftOrder, orderEdit, return, claim, exchange,
#         product, productType, productCategory, productTag, productCollection,
#         payment, paymentCollection, refundReason, promotion, campaign,
#         fulfillmentSet, fulfillment, fulfillmentProvider, shippingOption,
#         shippingProfile, shippingOptionType, inventoryItem, reservation,
#         stockLocation, region, salesChannel, currency, priceList, pricePreference,
#         taxRate, taxRegion, taxProvider, customerGroup
# Also delete the admin/store.ts sub-resource file (commerce store settings)
rm -f packages/core/js-sdk/src/admin/store.ts
# Remove admin.store property from packages/core/js-sdk/src/admin/index.ts
```

> **ClientSdk (formerly Store SDK):** The `client-sdk/` directory was renamed from `store/` in Pre-Work (Section 4). During this cleanup phase, remove only the commerce-specific METHOD files within `client-sdk/` (e.g., cart, product, region, order storefront methods). The `ClientSdk` class, its `prefix` property, and its `fetch<T>()` method **survive** as the generic client API SDK. Do **not** delete `packages/core/js-sdk/src/client-sdk/`.

---

## 15. Phase 6 — Namespace Rename

Do this **after ALL slice removals** to avoid renaming files you're about to delete.

### 15.1 Rename automation scripts

**`scripts/codemods/rename-namespace.ts`** (jscodeshift codemod):

```typescript
import type { API, FileInfo } from "jscodeshift"

const FROM = "/"
const TO = "@acmekit/"

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift
  const root = j(file.source)
  let modified = false

  const replace = (val: string): string | null =>
    val.startsWith(FROM) ? val.replace(FROM, TO) : null

  root.find(j.ImportDeclaration).forEach((p) => {
    const next = replace(String(p.value.source.value))
    if (next) { p.value.source = j.stringLiteral(next); modified = true }
  })

  root.find(j.ExportNamedDeclaration).forEach((p) => {
    if (!p.value.source) return
    const next = replace(String(p.value.source.value))
    if (next) { p.value.source = j.stringLiteral(next); modified = true }
  })

  root.find(j.ExportAllDeclaration).forEach((p) => {
    const next = replace(String(p.value.source.value))
    if (next) { p.value.source = j.stringLiteral(next); modified = true }
  })

  root.find(j.CallExpression, { callee: { name: "require" } }).forEach((p) => {
    const arg = p.value.arguments[0]
    if (arg?.type === "StringLiteral" || arg?.type === "Literal") {
      const next = replace(String(arg.value))
      if (next) { p.value.arguments[0] = j.stringLiteral(next); modified = true }
    }
  })

  return modified ? root.toSource({ quote: "double" }) : null
}
```

```bash
# Dry run first — always
npx jscodeshift -t scripts/codemods/rename-namespace.ts \
  --parser=tsx --extensions=ts,tsx --dry packages/ www/

# Apply (cpus for parallelism)
npx jscodeshift -t scripts/codemods/rename-namespace.ts \
  --parser=tsx --extensions=ts,tsx --cpus=8 packages/ www/

# tsconfig path aliases (sed — portable version using perl)
find . -name "tsconfig*.json" -not -path "*/node_modules/*" \
  -exec perl -pi -e 's/\@medusajs\//@acmekit\//g' {} +

# Non-TS files: package.json names/deps, md, mdx, yml, mjs, sh
grep -rl "/" \
  --include="*.json" --include="*.md" --include="*.mdx" \
  --include="*.yml" --include="*.yaml" --include="*.mjs" --include="*.sh" \
  --exclude-dir=node_modules . | \
  xargs perl -pi -e 's/\@medusajs\//@acmekit\//g'
```

### 15.2 Rename CLI packages and binary names

```bash
# Directory renames
mv packages/cli/create-medusa-app packages/cli/create-acmekit-app
mv packages/cli/medusa-cli packages/cli/acmekit-cli
mv packages/cli/medusa-dev-cli packages/cli/acmekit-dev-cli
mv packages/medusa packages/acmekit

# CRITICAL: Update the root package.json workspace entry for the renamed directory.
# Yarn resolves workspaces by directory path — if root package.json still says
# "packages/medusa", Yarn will error on the next install.
perl -pi -e 's|"packages/medusa"|"packages/acmekit"|g' package.json
# Also update any tsconfig.json path aliases that reference packages/medusa/ by directory:
grep -rl '"packages/medusa/' --include="tsconfig*.json" -r . | grep -v node_modules | \
  xargs perl -pi -e 's|packages/medusa/|packages/acmekit/|g' || true

# Re-run yarn install so the new workspace path is registered:
yarn install

# Smoke-check: confirm the acmekit workspace resolves correctly
yarn workspaces list | grep acmekit

# Update package.json "bin" fields (binary executable names):
grep -rl '"medusa"' packages/cli/*/package.json | \
  xargs perl -pi -e 's/"medusa"(\s*:)/"acmekit"$1/g'

# Update internal references to CLI package names:
grep -rl "create-medusa-app\|medusa-cli\|medusa-dev-cli" packages/ --include="*.ts" --include="*.json" | \
  grep -v node_modules | \
  xargs perl -pi -e 's/create-medusa-app/create-acmekit-app/g; s/medusa-dev-cli/acmekit-dev-cli/g; s/medusa-cli/acmekit-cli/g'
```

### 15.3 Verify rename is complete

```bash
# Should return zero results
grep -r "/" packages/ --include="*.ts" --include="*.tsx" \
  --include="*.json" -l | grep -v node_modules

# TypeScript compile
npx tsc --noEmit --project tsconfig.json 2>&1 | head -50

# Knip for orphaned code
npx knip --reporter compact 2>&1 | grep "Cannot find module"
```

> **Note**: This check verifies only namespace import paths (`/`). It does NOT verify that Medusa-prefixed symbols (MedusaError, MedusaContainer, etc.) have been renamed. Run Section 16.4 after Section 16 to confirm full symbol rename completion. Both checks must pass for the rebranding to be complete.

---

## 16. Symbol-Level Renaming (Case-Correct)

The namespace rename (`/` → `@acmekit/`) handles import paths. But **exported symbols** that include "Medusa" or "medusa" in their name must also be renamed — following the correct case convention of the project.

### 16.1 Rename Map

| Current Name | Renamed To | Convention |
|---|---|---|
| `MedusaError` | `AcmeKitError` | PascalCase |
| `MedusaErrorCodes` | `AcmeKitErrorCodes` | PascalCase |
| `MedusaErrorTypes` | `AcmeKitErrorTypes` | PascalCase |
| `MedusaErrorHandlerFunction` | `AcmeKitErrorHandlerFunction` | PascalCase |
| `isMedusaError` | `isAcmeKitError` | camelCase |
| `MedusaService` | `AcmeKitService` | PascalCase |
| `MedusaServiceReturnType` | `AcmeKitServiceReturnType` | PascalCase |
| `MedusaServiceSymbol` | `AcmeKitServiceSymbol` | PascalCase |
| `MedusaServiceModelObjectsSymbol` | `AcmeKitServiceModelObjectsSymbol` | PascalCase |
| `MedusaServiceModelNameToLinkableKeysMapSymbol` | `AcmeKitServiceModelNameToLinkableKeysMapSymbol` | PascalCase |
| `isMedusaService` | `isAcmeKitService` | camelCase |
| `MedusaRequest` | `AcmeKitRequest` | PascalCase |
| `MedusaResponse` | `AcmeKitResponse` | PascalCase |
| `AuthenticatedMedusaRequest` | `AuthenticatedAcmeKitRequest` | PascalCase |
| `MedusaStoreRequest` | `AcmeKitClientRequest` | PascalCase — store routes renamed to client routes |
| `MedusaNextFunction` | `AcmeKitNextFunction` | PascalCase |
| `MedusaRequestHandler` | `AcmeKitRequestHandler` | PascalCase |
| `MedusaContext` | `AcmeKitContext` | PascalCase (decorator) |
| `MedusaContextType` | `AcmeKitContextType` | PascalCase |
| `MedusaModule` | `AcmeKitModule` | PascalCase |
| `MedusaModuleType` | `AcmeKitModuleType` | PascalCase |
| `MedusaModuleProvider` | `AcmeKitModuleProvider` | PascalCase |
| `MedusaModuleProviderType` | `AcmeKitModuleProviderType` | PascalCase |
| `MedusaApp` | `AcmeKitApp` | PascalCase |
| `MedusaAppLoader` | `AcmeKitAppLoader` | PascalCase |
| `medusaApp` | `acmekitApp` | camelCase |
| `medusaService` | `acmekitService` | camelCase |
| `MedusaInternalService` | `AcmeKitInternalService` | PascalCase |
| `MedusaInternalServiceSymbol` | `AcmeKitInternalServiceSymbol` | PascalCase |
| `isMedusaInternalService` | `isAcmeKitInternalService` | camelCase |
| `MedusaContainer` | `AcmeKitContainer` | PascalCase |
| `createMedusaContainer` | `createAcmeKitContainer` | camelCase |
| `registerMedusaLinkModule` | `registerAcmeKitLinkModule` | camelCase |
| `MedusaPolicySymbol` | `AcmeKitPolicySymbol` | PascalCase |
| `MedusaMikroOrmEventSubscriber` | `AcmeKitMikroOrmEventSubscriber` | PascalCase |
| `createMedusaMikroOrmEventSubscriber` | `createAcmeKitMikroOrmEventSubscriber` | camelCase |
| `SymbolMedusaWorkflowComposerContext` | `SymbolAcmeKitWorkflowComposerContext` | PascalCase |
| `SymbolMedusaWorkflowComposerCondition` | `SymbolAcmeKitWorkflowComposerCondition` | PascalCase |
| `SymbolMedusaWorkflowResponse` | `SymbolAcmeKitWorkflowResponse` | PascalCase |
| `MedusaCloudOptions` | **DELETE** | Cloud module removed entirely |
| `MEDUSA_VERSION` | `ACMEKIT_VERSION` | SCREAMING_SNAKE_CASE |
| `MEDUSA_APP_SOURCE_PATH` | `ACMEKIT_APP_SOURCE_PATH` | SCREAMING_SNAKE_CASE |
| `MEDUSA_BACKEND_URL` | `ACMEKIT_BACKEND_URL` | SCREAMING_SNAKE_CASE |
| `MEDUSA_CLI_PATH` | `ACMEKIT_CLI_PATH` | SCREAMING_SNAKE_CASE |
| `MEDUSA_DATABASE_URL` | `ACMEKIT_DATABASE_URL` | SCREAMING_SNAKE_CASE |
| `MEDUSA_WORKER_MODE` | `ACMEKIT_WORKER_MODE` | SCREAMING_SNAKE_CASE |
| `MEDUSA_FF_*` | `ACMEKIT_FF_*` | SCREAMING_SNAKE_CASE |
| `MEDUSA_DB_CONNECTION_*` | `ACMEKIT_DB_CONNECTION_*` | SCREAMING_SNAKE_CASE |
| `MEDUSA_PROJECT_NAME` | `ACMEKIT_PROJECT_NAME` | SCREAMING_SNAKE_CASE |
| `MEDUSA_SKIP_FILE*` | `ACMEKIT_SKIP_FILE*` | SCREAMING_SNAKE_CASE |
| `MEDUSA_HMR_*` | `ACMEKIT_HMR_*` | SCREAMING_SNAKE_CASE |
| `MEDUSA_EPSILON` | `ACMEKIT_EPSILON` | SCREAMING_SNAKE_CASE |
| `MEDUSA_PLUGIN_*` | `ACMEKIT_PLUGIN_*` | SCREAMING_SNAKE_CASE |
| `MEDUSA_STOREFRONT_URL` | **DELETE** | Storefront is gone; this env var serves no purpose |
| `MEDUSA_CLOUD_*` | **DELETE** | Cloud-specific, entire cloud module removed |
| `MEDUSA_DEV_VERSION` / `MEDUSA_TEST_VERSION` | `ACMEKIT_DEV_VERSION` / `ACMEKIT_TEST_VERSION` | SCREAMING_SNAKE_CASE |

> **Note on `defineConfig`, `defineMiddlewares`, `defineLinkConfig`:** These are already generic camelCase names with no "medusa" branding — keep them as-is.

### 16.2 ts-morph rename script (symbol-level, type-safe)

Unlike sed/jscodeshift text replacement, ts-morph uses the TypeScript Language Server to **find all references** to a symbol and rename them everywhere — across files, including re-exports and type positions.

**`scripts/codemods/rename-symbols.ts`:**

```typescript
import { Project } from "ts-morph"

const RENAMES: Array<[from: string, to: string]> = [
  // Error types
  ["MedusaError", "AcmeKitError"],
  ["MedusaErrorCodes", "AcmeKitErrorCodes"],
  ["MedusaErrorTypes", "AcmeKitErrorTypes"],
  ["MedusaErrorHandlerFunction", "AcmeKitErrorHandlerFunction"],
  ["isMedusaError", "isAcmeKitError"],
  // Service base class and symbols
  ["MedusaService", "AcmeKitService"],
  ["MedusaServiceReturnType", "AcmeKitServiceReturnType"],
  ["MedusaServiceSymbol", "AcmeKitServiceSymbol"],
  ["MedusaServiceModelObjectsSymbol", "AcmeKitServiceModelObjectsSymbol"],
  ["MedusaServiceModelNameToLinkableKeysMapSymbol", "AcmeKitServiceModelNameToLinkableKeysMapSymbol"],
  ["isMedusaService", "isAcmeKitService"],
  // Internal service (modules-sdk/medusa-internal-service.ts)
  ["MedusaInternalService", "AcmeKitInternalService"],
  ["MedusaInternalServiceSymbol", "AcmeKitInternalServiceSymbol"],
  ["isMedusaInternalService", "isAcmeKitInternalService"],
  // HTTP types
  ["MedusaRequest", "AcmeKitRequest"],
  ["MedusaResponse", "AcmeKitResponse"],
  ["AuthenticatedMedusaRequest", "AuthenticatedAcmeKitRequest"],
  ["MedusaStoreRequest", "AcmeKitClientRequest"],  // store routes → client routes
  ["MedusaNextFunction", "AcmeKitNextFunction"],
  ["MedusaRequestHandler", "AcmeKitRequestHandler"],
  // Decorator
  ["MedusaContext", "AcmeKitContext"],
  ["MedusaContextType", "AcmeKitContextType"],
  // Module system
  ["MedusaModule", "AcmeKitModule"],
  ["MedusaModuleType", "AcmeKitModuleType"],
  ["MedusaModuleProvider", "AcmeKitModuleProvider"],
  ["MedusaModuleProviderType", "AcmeKitModuleProviderType"],
  ["registerMedusaLinkModule", "registerAcmeKitLinkModule"],
  // Container
  ["MedusaContainer", "AcmeKitContainer"],
  ["createMedusaContainer", "createAcmeKitContainer"],
  // App loader
  ["MedusaApp", "AcmeKitApp"],
  ["MedusaAppLoader", "AcmeKitAppLoader"],
  ["medusaApp", "acmekitApp"],
  ["medusaService", "acmekitService"],
  // Policy
  ["MedusaPolicySymbol", "AcmeKitPolicySymbol"],
  // MikroORM event subscriber
  ["MedusaMikroOrmEventSubscriber", "AcmeKitMikroOrmEventSubscriber"],
  ["createMedusaMikroOrmEventSubscriber", "createAcmeKitMikroOrmEventSubscriber"],
  // Workflow SDK symbols
  ["SymbolMedusaWorkflowComposerContext", "SymbolAcmeKitWorkflowComposerContext"],
  ["SymbolMedusaWorkflowComposerCondition", "SymbolAcmeKitWorkflowComposerCondition"],
  ["SymbolMedusaWorkflowResponse", "SymbolAcmeKitWorkflowResponse"],
]

const CONSTANT_RENAMES: Array<[from: RegExp, to: string]> = [
  [/^MEDUSA_CLOUD_.*$/, "DELETE"],    // entire MEDUSA_CLOUD_* group — remove from source
  [/^MEDUSA_STOREFRONT_URL$/, "DELETE"], // storefront is gone
  [/^MEDUSA_(.+)$/, "ACMEKIT_$1"],    // all other MEDUSA_* constants
]

function main() {
  // Load ALL packages explicitly — tsconfig.json at root may not reference all 75 packages
  // via project references, so we add source files manually to guarantee cross-package rename.
  const project = new Project({ useInMemoryFileSystem: false })
  project.addSourceFilesAtPaths([
    "packages/*/src/**/*.ts",
    "packages/*/src/**/*.tsx",
    "packages/core/*/src/**/*.ts",
    "packages/modules/*/src/**/*.ts",
    "packages/admin/*/src/**/*.ts",
    "packages/admin/*/src/**/*.tsx",
    "packages/cli/*/src/**/*.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/*.spec.ts",
    "!**/*.test.ts",
  ])

  console.log(`Loaded ${project.getSourceFiles().length} source files`)

  // Symbol renames — rename() is synchronous in ts-morph; it propagates across all
  // loaded files via the in-memory Language Service.
  for (const [from, to] of RENAMES) {
    for (const sourceFile of project.getSourceFiles()) {
      const declarations = [
        ...sourceFile.getClasses().filter((c) => c.getName() === from),
        ...sourceFile.getInterfaces().filter((i) => i.getName() === from),
        ...sourceFile.getTypeAliases().filter((t) => t.getName() === from),
        ...sourceFile.getFunctions().filter((f) => f.getName() === from),
        ...sourceFile.getVariableDeclarations().filter((v) => v.getName() === from),
        ...sourceFile.getEnums().filter((e) => e.getName() === from),
      ]
      for (const decl of declarations) {
        console.log(`Renaming ${from} → ${to}`)
        decl.rename(to)  // synchronous — no await needed
      }
    }
  }

  // MedusaCloudOptions: delete the type alias entirely (cloud module is removed)
  for (const sourceFile of project.getSourceFiles()) {
    for (const ta of sourceFile.getTypeAliases()) {
      if (ta.getName() === "MedusaCloudOptions") {
        console.log(`Deleting MedusaCloudOptions from ${sourceFile.getFilePath()}`)
        ta.remove()
      }
    }
  }

  project.saveSync()
  console.log("Symbol renames complete.")
}

main()
```

```bash
# Run the symbol rename script
npx ts-node scripts/codemods/rename-symbols.ts

# After symbol renames, do a pass for any string-literal uses of these names
# (error messages, log strings, telemetry event names, etc.)
grep -rn "MedusaError\|MedusaService\|MedusaRequest\|MEDUSA_" \
  packages/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep '"'
# These are string occurrences (not symbol uses) — fix manually or with perl
perl -pi -e 's/MedusaError/AcmeKitError/g; s/MedusaService/AcmeKitService/g' \
  $(grep -rl "MedusaError\|MedusaService" packages/ --include="*.ts" | grep -v node_modules)
```

### 16.3 Constant renames (SCREAMING_SNAKE_CASE)

Constants won't be found by ts-morph's declaration scan the same way. Use targeted perl:

```bash
# Step 1: Delete MEDUSA_CLOUD_* and MEDUSA_STOREFRONT_URL declarations entirely.
# Simple substitution would leave broken syntax (e.g. `const  = "..."` or `process.env.`).
# Delete the entire declaration line for each:
grep -rl "MEDUSA_CLOUD_\|MEDUSA_STOREFRONT_URL" packages/ --include="*.ts" --include="*.tsx" \
  | grep -v node_modules | \
  xargs perl -pi -e 's/^.*\bMEDUSA_CLOUD_\w+\b.*\n//gm; s/^.*\bMEDUSA_STOREFRONT_URL\b.*\n//gm'
# Verify no syntax errors remain:
npx tsc --noEmit --project tsconfig.json 2>&1 | grep "MEDUSA_CLOUD\|MEDUSA_STOREFRONT" | head -10

# Step 2: Rename remaining MEDUSA_* → ACMEKIT_* (simple identifier rename, no syntax risk)
grep -rl "MEDUSA_" packages/ --include="*.ts" --include="*.tsx" \
  --include="*.js" --include="*.mjs" | grep -v node_modules | \
  xargs perl -pi -e 's/\bMEDUSA_([A-Z_]+)/ACMEKIT_$1/g'

# Step 3: CI configs and env files
grep -rl "MEDUSA_" .github/ --include="*.yml" | \
  xargs perl -pi -e 's/\bMEDUSA_([A-Z_]+)/ACMEKIT_$1/g'

# Step 3b: www/ surviving MDX docs — MEDUSA_* env var names in user-facing code samples
# (e.g. MEDUSA_BACKEND_URL, MEDUSA_WORKER_MODE in book app deployment/config pages)
grep -rl "\bMEDUSA_" www/apps/book www/apps/resources www/apps/ui \
  --include="*.mdx" --include="*.md" 2>/dev/null | grep -v node_modules | \
  xargs perl -pi -e 's/\bMEDUSA_([A-Z_]+)/ACMEKIT_$1/g'
# www/utils TypeDoc merger configs (surviving auth-provider.ts, analytics.ts etc.)
grep -rl "\bMEDUSA_\|medusajs\.com\|commerce-modules" \
  www/utils/packages/typedoc-generate-references/src/constants/merger-custom-options/ \
  --include="*.ts" 2>/dev/null | grep -v node_modules | \
  xargs perl -pi -e 's/\bMEDUSA_([A-Z_]+)/ACMEKIT_$1/g; s|medusajs\.com|acmekit\.dev|g; s|/resources/commerce-modules/|/resources/application-modules/|g'

# Step 4: Verify — no remaining MEDUSA_ identifiers in packages/ or www/
grep -rn "\bMEDUSA_" packages/ www/apps/book www/apps/resources www/utils \
  --include="*.ts" --include="*.tsx" --include="*.mdx" --include="*.md" | \
  grep -v node_modules | grep -v "//.*MEDUSA_\|#.*MEDUSA_\|\*.*MEDUSA_" | head -20
```

### 16.4 Verification after symbol renames

```bash
# No remaining Medusa-prefixed symbols in source (packages/)
grep -rn "Medusa[A-Z]\|medusa[A-Z]\|MEDUSA_" \
  packages/ --include="*.ts" --include="*.tsx" | \
  grep -v "node_modules\|\.spec\.\|\.test\." | \
  grep -v "//.*[Mm]edusa\|#.*[Mm]edusa\|\*.*[Mm]edusa" | \
  head -30   # skip comments; remaining output = symbols that still need renaming

# TypeScript still compiles
npx tsc --noEmit --project tsconfig.json
```

### 16.5 Final Unified "Done" Check (Full Repo)

Run this after completing both Section 15 and Section 16 to confirm the entire repo is clean — not just `packages/`.

```bash
echo "=== Checking / namespace references (full repo) ==="
grep -rn "/" \
  packages/ www/ integration-tests/ scripts/ .github/ \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" \
  --include="*.json" --include="*.mdx" --include="*.md" --include="*.yml" \
  | grep -v node_modules \
  | grep -v "scripts/sync-manifest\.json"  \
  | grep -v "scripts/sync-upstream\.sh" \
  | grep -v "CONTRIBUTING\|CHANGELOG\|SECURITY" \
  | head -30
echo "Expected: 0 results above"

echo ""
echo "=== Checking Medusa-prefixed symbols (full repo) ==="
grep -rn "\bMedusa[A-Z]\|\bmedusa[A-Z]\|\bMEDUSA_" \
  packages/ www/ integration-tests/ scripts/ \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mjs" \
  --include="*.mdx" --include="*.md" \
  | grep -v node_modules \
  | grep -v "\.spec\.\|\.test\." \
  | grep -v "//.*[Mm]edusa\|#.*[Mm]edusa\|\*.*[Mm]edusa" \
  | grep -v "sync-upstream\.sh\|sync-manifest\.json" \
  | head -30
echo "Expected: 0 results above"
```

---

## 17. Automation Scripts Reference

> All scripts below should be created in `scripts/` and committed before starting Week 3.

All scripts in `scripts/` at the monorepo root.

### `scripts/codemods/remove-domain-imports.ts` — Remove all imports for a domain

```typescript
import type { API, FileInfo, Options } from "jscodeshift"

// jscodeshift passes unknown flags directly as the third `options` argument.
// Invocation: npx jscodeshift -t ... --domain=cart packages/
// (NO -- separator — that would treat --domain=cart as a file path, not an option)

export default function transform(
  file: FileInfo,
  api: API,
  options: Options & { domain?: string }
) {
  const domain = options.domain
  if (!domain) throw new Error("Pass --domain=<name> as a jscodeshift flag")

  const j = api.jscodeshift
  const root = j(file.source)
  let modified = false

  const patterns = [
    `/${domain}`,
    `@acmekit/${domain}`,
    `core-flows/${domain}`,
  ]

  root.find(j.ImportDeclaration).filter((p) =>
    patterns.some((pat) => String(p.value.source.value).includes(pat))
  ).forEach((p) => {
    j(p).remove()
    modified = true
  })

  return modified ? root.toSource() : null
}
```

```bash
# Dry run — --domain is passed directly, no -- separator
npx jscodeshift -t scripts/codemods/remove-domain-imports.ts \
  --parser=tsx --extensions=ts,tsx --domain=cart --dry packages/

# Apply
npx jscodeshift -t scripts/codemods/remove-domain-imports.ts \
  --parser=tsx --extensions=ts,tsx --domain=cart packages/
```

### `scripts/verify-slice.sh` — Verify slice is clean

```bash
#!/bin/bash
# No set -e — tsc errors are expected mid-migration; we report, not abort
DOMAIN=${1:-"unknown"}
EXIT_CODE=0

echo "=== [verify:ts] TypeScript compile ==="
# || true prevents abort; head closes pipe safely with pipefail off
TS_ERRORS=$(npx tsc --noEmit --project tsconfig.json 2>&1 || true)
echo "$TS_ERRORS" | head -50
TS_COUNT=$(echo "$TS_ERRORS" | grep -c "error TS" || true)
echo "TypeScript errors: $TS_COUNT"
[ "$TS_COUNT" -gt 0 ] && EXIT_CODE=1

echo ""
echo "=== [verify:knip] Orphaned exports after $DOMAIN removal ==="
# Sort output for deterministic diff (knip output order is non-deterministic across runs)
npx knip --production --reporter compact 2>&1 | sort | tee .knip-after-${DOMAIN}.txt
# Diff vs baseline: any NEW lines in current output are newly introduced orphans
BASELINE=".knip-baseline.txt"
NEW_ISSUES=$(diff "$BASELINE" ".knip-after-${DOMAIN}.txt" | grep '^>' | wc -l | tr -d ' ')
FIXED_ISSUES=$(diff "$BASELINE" ".knip-after-${DOMAIN}.txt" | grep '^<' | wc -l | tr -d ' ')
echo "Knip new orphans introduced: $NEW_ISSUES (fixed: $FIXED_ISSUES)"
if [ "$NEW_ISSUES" -gt 0 ]; then
  echo "WARNING: new orphaned exports detected:"
  diff "$BASELINE" ".knip-after-${DOMAIN}.txt" | grep '^>'
  EXIT_CODE=1
fi

echo ""
echo "=== [verify:refs] Remaining SOURCE references to '$DOMAIN' (non-test) ==="
UPPER=$(echo "$DOMAIN" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
REFS=$(grep -r "${DOMAIN}\|Modules\.${UPPER}" \
  packages/ --include="*.ts" --include="*.tsx" -l \
  | grep -v "node_modules\|__tests__\|\.spec\.\|\.test\." || true)
if [ -n "$REFS" ]; then
  echo "WARNING: remaining references found:"
  echo "$REFS" | head -20
  EXIT_CODE=1
else
  echo "Clean — no remaining source references."
fi

echo ""
echo "=== [verify:result] ==="
[ "$EXIT_CODE" -eq 0 ] && echo "PASS — slice '$DOMAIN' is clean." || echo "FAIL — fix issues above before committing."
exit $EXIT_CODE
```

### `scripts/verify-docs-slice.sh` — Verify docs are clean after each slice

```bash
#!/bin/bash
# Usage: bash scripts/verify-docs-slice.sh cart
# No set -e — we want to see all failures, not abort at first
DOMAIN=${1:-"unknown"}
EXIT_CODE=0
cd www

echo "=== [docs:prep] Regenerating sidebars for all remaining apps ==="
yarn workspace resources prep || { echo "FAIL: resources prep"; EXIT_CODE=1; }
yarn workspace book prep      || { echo "FAIL: book prep"; EXIT_CODE=1; }
# user-guide: only run if it still exists as a workspace
yarn workspaces list 2>/dev/null | grep -q "user-guide" && \
  yarn workspace user-guide prep 2>/dev/null || true
yarn workspace api-reference prep 2>/dev/null || true

echo ""
echo "=== [docs:sidebar] Checking sidebar configs for '$DOMAIN' references ==="
SIDEBAR_REFS=$(grep -rn "$DOMAIN" \
  apps/resources/sidebar.mjs apps/resources/sidebars/ \
  apps/book/sidebar.mjs 2>/dev/null || true)
if [ -n "$SIDEBAR_REFS" ]; then
  echo "WARNING: sidebar still references '$DOMAIN':"
  echo "$SIDEBAR_REFS"
  EXIT_CODE=1
else
  echo "Clean — no sidebar references."
fi

echo ""
echo "=== [docs:mdx] Scanning MDX for remaining '$DOMAIN' inline references ==="
MDX_REFS=$(grep -rl "$DOMAIN" apps/resources/app apps/book/app 2>/dev/null \
  --include="*.mdx" || true)
if [ -n "$MDX_REFS" ]; then
  echo "WARNING: MDX files still reference '$DOMAIN':"
  echo "$MDX_REFS" | head -20
  EXIT_CODE=1
else
  echo "Clean — no MDX references."
fi

echo ""
echo "=== [docs:build:resources] Build resources (catches broken links in resources) ==="
yarn build:resources 2>&1 | tail -40
[ ${PIPESTATUS[0]} -ne 0 ] && EXIT_CODE=1

echo ""
echo "=== [docs:build:book] Build book (catches cross-app broken links) ==="
yarn build:docs 2>&1 | tail -40
[ ${PIPESTATUS[0]} -ne 0 ] && EXIT_CODE=1

echo ""
echo "=== [docs:result] ==="
[ "$EXIT_CODE" -eq 0 ] && echo "PASS — docs slice '$DOMAIN' is clean." || echo "FAIL — fix issues above."
exit $EXIT_CODE
```

### `scripts/docs-remove-domain-references.mjs` — MDX content audit + targeted cleanup

This script has two modes:
- **Audit mode** (default): lists affected files without changing them
- **Delete mode** (`--delete`): deletes files whose entire path belongs to the domain
- After running audit mode, review the output and delete or edit files manually per the criteria below.

```javascript
#!/usr/bin/env node
// Usage:
//   node scripts/docs-remove-domain-references.mjs cart          # audit only
//   node scripts/docs-remove-domain-references.mjs cart --delete # delete domain files

import { readFileSync, unlinkSync } from "fs"
import { globSync } from "glob"

const domain = process.argv[2]
const doDelete = process.argv.includes("--delete")
if (!domain) { console.error("Usage: node script.mjs <domain> [--delete]"); process.exit(1) }

const allMdx = globSync("www/apps/**/*.{mdx,md}", { ignore: ["**/node_modules/**"] })

// Pattern 1: file PATH contains the domain as a path segment (the file BELONGS to the domain)
const pathSegmentPattern = new RegExp(`/${domain}(/|$|\\.)`, "i")
// Pattern 2: file CONTENT imports from the domain (inline reference in kept file)
// No 'g' flag — avoids lastIndex bug when used with .test() in a loop
const importPattern = new RegExp(`from ['"].*${domain}.*['"]`)
// Pattern 3: content references the domain in prose (informational only)
const prosePattern = new RegExp(`\\b${domain}\\b`, "i")

const ownedFiles = []    // file belongs to domain path — DELETE these
const importingFiles = [] // file imports from domain — EDIT these
const proseFiles = []     // file mentions domain in prose — REVIEW these

for (const file of allMdx) {
  const content = readFileSync(file, "utf8")
  if (pathSegmentPattern.test(file)) {
    ownedFiles.push(file)
  } else if (importPattern.test(content)) {
    importingFiles.push(file)
  } else if (prosePattern.test(content)) {
    proseFiles.push(file)
  }
}

console.log(`\n[DELETE — owned by domain] ${ownedFiles.length} files:`)
ownedFiles.forEach((f) => {
  console.log(`  ${f}`)
  if (doDelete) { unlinkSync(f); console.log(`    → deleted`) }
})

console.log(`\n[EDIT — imports from domain] ${importingFiles.length} files (remove import lines):`)
importingFiles.forEach((f) => console.log(`  ${f}`))

console.log(`\n[REVIEW — prose mentions] ${proseFiles.length} files:`)
proseFiles.forEach((f) => console.log(`  ${f}`))

if (!doDelete && ownedFiles.length > 0) {
  console.log(`\nRun with --delete to delete the ${ownedFiles.length} owned files.`)
  console.log("Then manually edit the importing files to remove import lines.")
}
```

### `scripts/sync-upstream.sh` — Selective upstream sync

```bash
#!/bin/bash
# Usage: bash scripts/sync-upstream.sh [target-sha]
# Portable: uses perl instead of sed -i for Linux/macOS compat
set -e

MANIFEST="scripts/sync-manifest.json"
UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"

LAST_SHA=$(node -e "const m=require('./${MANIFEST}');console.log(m.lastSyncedSha)")
TARGET_SHA=${1:-$(git ls-remote ${UPSTREAM_REMOTE} refs/heads/${UPSTREAM_BRANCH} | cut -f1)}

echo "=== Fetching upstream ==="
git fetch ${UPSTREAM_REMOTE}

echo "=== Generating filtered patch (${LAST_SHA:0:8}..${TARGET_SHA:0:8}) ==="
# Build path filter from manifest
PATHS=$(node -e "const m=require('./${MANIFEST}');console.log(m.trackedPaths.join(' '))")
git diff ${LAST_SHA}..${TARGET_SHA} -- ${PATHS} > /tmp/upstream-raw.patch

if [ ! -s /tmp/upstream-raw.patch ]; then
  echo "No changes in tracked paths. Already up to date."
  exit 0
fi

echo "=== Translating / → @acmekit/ ==="
perl -pe 's/\@medusajs\//@acmekit\//g' /tmp/upstream-raw.patch > /tmp/upstream-translated.patch

echo "=== Applying patch ==="
git apply --reject /tmp/upstream-translated.patch || {
  echo "[WARN] Rejected hunks saved as .rej files:"
  find . -name "*.rej" | head -20
  echo "Fix .rej files manually, then run: bash scripts/sync-upstream.sh --finish"
  exit 1
}

echo "=== Updating sync manifest ==="
node -e "
  const fs = require('fs')
  const m = JSON.parse(fs.readFileSync('${MANIFEST}', 'utf8'))
  m.lastSyncedSha = '${TARGET_SHA}'
  m.lastSyncedAt = new Date().toISOString()
  fs.writeFileSync('${MANIFEST}', JSON.stringify(m, null, 2))
"

echo "=== Done. Commit with: ==="
echo "  git add . && git commit -m 'chore: sync upstream core \$(date +%Y-%m-%d) (${TARGET_SHA:0:8})'"
```

### `scripts/sync-manifest.json`

```json
{
  "lastSyncedSha": "REPLACE_WITH_CURRENT_UPSTREAM_HEAD_SHA",
  "lastSyncedAt": "2026-03-17T00:00:00.000Z",
  "trackedPaths": [
    "packages/core/framework",
    "packages/core/types",
    "packages/core/utils",
    "packages/core/workflows-sdk",
    "packages/core/orchestration",
    "packages/core/modules-sdk",
    "packages/core/js-sdk",
    "packages/core/core-flows/src/api-key",
    "packages/core/core-flows/src/auth",
    "packages/core/core-flows/src/user",
    "packages/core/core-flows/src/file",
    "packages/core/core-flows/src/notification",
    "packages/core/core-flows/src/locking",
    "packages/core/core-flows/src/settings",
    "packages/core/core-flows/src/translation",
    "packages/core/core-flows/src/common",
    "packages/core/core-flows/src/defaults",
    "packages/modules/auth",
    "packages/modules/api-key",
    "packages/modules/cache-inmemory",
    "packages/modules/cache-redis",
    "packages/modules/caching",
    "packages/modules/event-bus-local",
    "packages/modules/event-bus-redis",
    "packages/modules/file",
    "packages/modules/locking",
    "packages/modules/notification",
    "packages/modules/user",
    "packages/modules/rbac",
    "packages/modules/settings",
    "packages/modules/translation",
    "packages/modules/workflow-engine-inmemory",
    "packages/modules/workflow-engine-redis",
    "packages/modules/analytics",
    "packages/modules/index",
    "packages/modules/customer",
    "packages/modules/providers/analytics-local",
    "packages/modules/providers/analytics-posthog",
    "packages/modules/providers/auth-emailpass",
    "packages/modules/providers/auth-github",
    "packages/modules/providers/auth-google",
    "packages/modules/providers/file-local",
    "packages/modules/providers/file-s3",
    "packages/modules/providers/notification-local",
    "packages/modules/providers/notification-sendgrid",
    "packages/modules/providers/locking-postgres",
    "packages/modules/providers/locking-redis",
    "packages/modules/providers/caching-redis"
  ],
  "excludedPaths": [
    "packages/modules/cart",
    "packages/modules/order",
    "packages/modules/payment",
    "packages/modules/pricing",
    "packages/modules/product",
    "packages/modules/promotion",
    "packages/modules/fulfillment",
    "packages/modules/inventory",
    "packages/modules/stock-location",
    "packages/modules/sales-channel",
    "packages/modules/currency",
    "packages/modules/region",
    "packages/modules/store",
    "packages/modules/tax",
    "packages/modules/link-modules",
    "packages/plugins/draft-order",
    "packages/modules/providers/payment-stripe",
    "packages/modules/providers/fulfillment-manual"
  ]
}
```

### `scripts/find-orphaned-docs.mjs` — Dead docs detection

```javascript
#!/usr/bin/env node
import { readFileSync } from "fs"
import { globSync } from "glob"

const sidebarContent = globSync("www/apps/*/sidebar.mjs")
  .concat(globSync("www/apps/*/sidebars/*.mjs"))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n")

const allPages = globSync("www/apps/**/*.mdx", { ignore: ["**/node_modules/**"] })
  .map((f) => f.replace(/^www\/apps\/[^/]+\/app/, "").replace(/\/page\.mdx$/, ""))

const orphaned = allPages.filter((p) => !sidebarContent.includes(p.replace(/^\//, "")))
console.log(`Orphaned pages (${orphaned.length}):`)
orphaned.forEach((p) => console.log(`  ${p}`))
```

---

## 18. Tool Reference

| Task | Tool | Command |
|------|------|---------|
| Rename TS imports (namespace) | `jscodeshift` | `npx jscodeshift -t scripts/codemods/rename-namespace.ts --parser=tsx ...` |
| Remove domain imports | `jscodeshift` | `npx jscodeshift -t ... --domain=cart packages/` (no `--` separator) |
| Symbol-level refactoring | `ts-morph` | Script using `project.getSourceFiles()` |
| Structural pattern removal | `ast-grep` | `sg scan --rule rules/foo.yaml packages/` |
| Dead code after deletion | `knip` | `npx knip --production --reporter compact` |
| Unused deps in package | `depcheck` | `npx depcheck packages/modules/DOMAIN/` |
| Dependency graph | `madge` | `npx madge --json packages/` |
| Broken docs links | `linkinator` | `linkinator http://localhost:3001 --recurse` |
| Docs build verification | `turbo` | `cd www && yarn build:resources` |
| Upstream conflict replay | `git rerere` | enabled in git config |
| Portable sed (Linux+macOS) | `perl -pi -e` | `perl -pi -e 's/old/new/g' files...` |
| MDX frontmatter | `gray-matter` | `matter(raw)` → `matter.stringify(content, data)` |
| MDX link rewriting | `unified` + `remark-*` | Custom remark plugin |
| Patch stack management | `stgit` | `stg rebase upstream/main` |

---

## 19. Scaffold Cleanup (After Migration Is Complete)

The migration tooling and scripts added to the repo are temporary. Once all slices are done, namespace is renamed, and the full verify passes — remove all of it.

```bash
# 1. Remove migration codemods
rm -rf scripts/codemods/rename-namespace.ts
rm -rf scripts/codemods/remove-domain-imports.ts
# Keep rename-symbols.ts as a reference only? Or delete it too:
rm -rf scripts/codemods/

# 2. Remove migration verification scripts
rm -f scripts/verify-slice.sh
rm -f scripts/verify-docs-slice.sh
rm -f scripts/docs-remove-domain-references.mjs
rm -f scripts/find-orphaned-docs.mjs

# 3. Remove progress tracker
rm -f .acmekit-progress.json
rm -f .knip-baseline.txt
# Also remove any per-slice knip snapshots
rm -f .knip-after-*.txt

# 4. Remove migration devDependencies (no longer needed after rename)
yarn remove jscodeshift ts-morph ast-grep-cli madge
# Keep: knip (useful permanently for dead code detection)
# Keep: linkinator (useful for ongoing docs validation)

# 5. Remove upstream sync scripts if you've decided on a clean break
# (or keep them if you plan to sync upstream — see Section 2)
# rm -f scripts/sync-upstream.sh
# rm -f scripts/sync-manifest.json

# 6. Verify nothing broke after removing dev deps
yarn build
npx tsc --noEmit --project tsconfig.json

# 7. Final commit
git add -A
git commit -m "chore: remove migration scaffold — rebranding complete"
```

**What to keep permanently:**
- `scripts/sync-upstream.sh` + `scripts/sync-manifest.json` — needed for ongoing upstream sync
- `knip` devDependency — useful for ongoing dead code detection
- `linkinator` — useful for ongoing docs link validation

---

## 20. Execution Timeline

```
Week 1   Pre-Work: Client API rename (Section 4) — api/store/ → api/client/, x-client-api-key,
         sdk.store → sdk.client (ClientSdk), fetch<T>() on Admin+ClientSdk, dashboard "Client Keys"
Week 2   Setup: tooling, knip baseline, progress tracker, upstream remote, scripts committed
Week 3   Slices 1–4: store (admin routes + defaults surgery; api/client/ survives), currency, tax, region
Week 4   Slices 5–7: pricing, promotion, product
Week 5   Slices 8–10: inventory, stock-location, fulfillment
Week 6   Slices 11–13: payment, cart, order
Week 7   Slices 14–16: sales-channel, link-modules (partial), plugins/draft-order
Week 7   customer module commerce wiring cleanup (types + routes + core-flows)
Week 8   Core surgery: definition.ts, define-config.ts, container.ts (Sections 12.1–12.3)
Week 8   Test infra: factories, fixtures, integration-tests/api/ deletion (Section 7)
Week 9   Dashboard nav rebuild, JS SDK cleanup, telemetry rebrand (Sections 13–14)
Week 9   Dependencies cleanup: package.json dep removals, csv-parse, json-2-csv, stripe (Section 8)
Week 10  www cleanup: delete cloud, bloom, docs apps; gut user-guide; resources+book surgery (Section 10)
Week 10  TypeDoc refs cleanup, api-reference YAML specs, next.config.mjs redirects
Week 11  String-level cleanup: i18n, README/CONTRIBUTING, package.json URLs, login screen (Section 9)
Week 12  Namespace rename: jscodeshift codemod, tsconfig aliases, non-TS files, CLI renames (Section 15)
Week 12  Symbol rename: ts-morph script + constant perl (Section 16)
Week 13  Init sync-manifest with current upstream HEAD SHA. Full verify: tsc, knip, docs build.
Week 13  Scaffold cleanup: remove migration tools, dev deps, progress tracker (Section 19)
```
