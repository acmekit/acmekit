# Contributing

Thank you for considering contributing to Medusa! This document will outline how to submit changes to this repository and which conventions to follow. If you are ever in doubt about anything we encourage you to reach out either by submitting an issue here or reaching out [via Discord](https://discord.gg/xpCwq3Kfn8).

If you're contributing to our documentation, make sure to also check out the [contribution guidelines on our documentation website](https://docs.medusajs.com/resources/contribution-guidelines/docs).

### Important

Our core maintainers prioritize pull requests (PRs) from within our organization. External contributions are regularly triaged, but not at any fixed cadence. It varies depending on how busy the maintainers are. This is applicable to all types of PRs, so we kindly ask for your patience.

If you, as a community contributor, wish to work on more extensive features, please reach out to CODEOWNERS instead of directly submitting a PR with all the changes. This approach saves us both time, especially if the PR is not accepted (which will be the case if it does not align with our roadmap), and helps us effectively review and evaluate your contribution if it is accepted.

## Prerequisites

- **You're familiar with GitHub Issues and Pull Requests**
- **You've read the [docs](https://docs.medusajs.com).**
- **You've setup a test project with `npx create-medusa-app@latest`**

## Issues before PRs

1. Before you start working on a change please make sure that there is an issue for what you will be working on. You can either find and [existing issue](https://github.com/medusajs/medusa/issues) or [open a new issue](https://github.com/medusajs/medusa/issues/new) if none exists. Doing this makes sure that others can contribute with thoughts or suggest alternatives, ultimately making sure that we only add changes that make

2. When you are ready to start working on a change you should first [fork the Medusa repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [branch out](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository) from the `develop` branch.
3. Make your changes.
4. [Open a pull request towards the develop branch in the Medusa repo](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Within a couple of days a Medusa team member will review, comment and eventually approve your PR.

## Local development

> Prerequisites:
>
> 1. [Forked Medusa repository cloned locally](https://github.com/medusajs/medusa).
> 2. [A local Medusa application for testing](https://docs.medusajs.com/learn/installation).

The code snippets in this section assume that your forked Medusa project and the test project are sibling directories, and you optionally setup the starter storefront as part of the installation. For example:

```
|
|__ medusa  // forked repository
|
|__ test-project // medusa application for testing
|
|__ test-project_storefront // (optional) storefront to interact with medusa application
```

1. Replace the /\* dependencies and devDependencies in you test project's `package.json` to point to the corresponding local packages in your forked Medusa repository. You will also need to add the medusa packages in the resolutions section of the `package.json`, so that every dependency is resolved locally. For example, assuming your forked Medusa project and the test project are sibling directories:

```json
// test project package.json (for npm/yarn)
"dependencies": {
    // more deps
    "/admin-sdk": "file:../medusa/packages/admin/admin-sdk",
    "/cli": "file:../medusa/packages/cli/medusa-cli",
    "/framework": "file:../medusa/packages/core/framework",
    "/medusa": "file:../medusa/packages/medusa",
},
"devDependencies": {
    // more dev deps
    "/test-utils": "file:../medusa/packages/medusa-test-utils",
},
"resolutions": {
    // more resolutions
    "/test-utils": "file:../medusa/packages/medusa-test-utils",
    "/api-key": "file:../medusa/packages/modules/api-key",
    "/auth": "file:../medusa/packages/modules/auth",
    "/cache-inmemory": "file:../medusa/packages/modules/cache-inmemory",
    "/cache-redis": "file:../medusa/packages/modules/cache-redis",
    "/cart": "file:../medusa/packages/modules/cart",
    "/locking": "file:../medusa/packages/modules/locking",
    "/currency": "file:../medusa/packages/modules/currency",
    "/customer": "file:../medusa/packages/modules/customer",
    "/event-bus-local": "file:../medusa/packages/modules/event-bus-local",
    "/file": "file:../medusa/packages/modules/file",
    "/file-local": "file:../medusa/packages/modules/providers/file-local",
    "/fulfillment": "file:../medusa/packages/modules/fulfillment",
    "/fulfillment-manual": "file:../medusa/packages/modules/providers/fulfillment-manual",
    "/index": "file:../medusa/packages/modules/index",
    "/inventory": "file:../medusa/packages/modules/inventory",
    "/medusa": "file:../medusa/packages/medusa",
    "/notification": "file:../medusa/packages/modules/notification",
    "/notification-local": "file:../medusa/packages/modules/providers/notification-local",
    "/order": "file:../medusa/packages/modules/order",
    "/payment": "file:../medusa/packages/modules/payment",
    "/pricing": "file:../medusa/packages/modules/pricing",
    "/product": "file:../medusa/packages/modules/product",
    "/promotion": "file:../medusa/packages/modules/promotion",
    "/rbac": "file:../medusa/packages/modules/rbac",
    "/region": "file:../medusa/packages/modules/region",
    "/sales-channel": "file:../medusa/packages/modules/sales-channel",
    "/stock-location": "file:../medusa/packages/modules/stock-location",
    "/store": "file:../medusa/packages/modules/store",
    "/tax": "file:../medusa/packages/modules/tax",
    "/user": "file:../medusa/packages/modules/user",
    "/workflow-engine-inmemory": "file:../medusa/packages/modules/workflow-engine-inmemory",
    "/link-modules": "file:../medusa/packages/modules/link-modules",
    "/admin-bundler": "file:../medusa/packages/admin/admin-bundler",
    "/admin-sdk": "file:../medusa/packages/admin/admin-sdk",
    "/admin-shared": "file:../medusa/packages/admin/admin-shared",
    "/dashboard": "file:../medusa/packages/admin/dashboard",
    "/admin-vite-plugin": "file:../medusa/packages/admin/admin-vite-plugin",
    "/ui": "file:../medusa/packages/design-system/ui",
    "/icons": "file:../medusa/packages/design-system/icons",
    "/toolbox": "file:../medusa/packages/design-system/toolbox",
    "/ui-preset": "file:../medusa/packages/design-system/ui-preset",
    "/utils": "file:../medusa/packages/core/utils",
    "/types": "file:../medusa/packages/core/types",
    "/core-flows": "file:../medusa/packages/core/core-flows",
    "/orchestration": "file:../medusa/packages/core/orchestration",
    "/cli": "file:../medusa/packages/cli/medusa-cli",
    "/modules-sdk": "file:../medusa/packages/core/modules-sdk",
    "/workflows-sdk": "file:../medusa/packages/core/workflows-sdk",
    "/js-sdk": "file:../../medusa/packages/core/js-sdk",
    "/framework": "file:../medusa/packages/core/framework",
    "/auth-emailpass": "file:../medusa/packages/modules/providers/auth-emailpass",
    "/locking-redis": "file:../medusa/packages/modules/providers/locking-redis",
    "/locking-postgres": "file:../medusa/packages/modules/providers/locking-postgres",
    "/telemetry": "file:../medusa/packages/medusa-telemetry",
    "/settings": "file:../medusa/packages/modules/settings",
    "/draft-order": "file:../medusa/packages/plugins/draft-order",
    "/deps": "file:../medusa/packages/deps",
    "/caching-redis": "file:../medusa/packages/modules/providers/caching-redis",
    "/caching": "file:../medusa/packages/modules/caching",
    "/translation": "file:../medusa/packages/modules/translation",
}
```

   If you're using `pnpm`, use `pnpm.overrides` instead of `resolutions`:

```json
// test project package.json (for pnpm)
"dependencies": {
    // more deps
    "/admin-sdk": "file:../medusa/packages/admin/admin-sdk",
    "/cli": "file:../medusa/packages/cli/medusa-cli",
    "/framework": "file:../medusa/packages/core/framework",
    "/medusa": "file:../medusa/packages/medusa",
},
"devDependencies": {
    // more dev deps
    "/test-utils": "file:../medusa/packages/medusa-test-utils",
},
"pnpm": {
  "overrides": {
    // more overrides
    "/test-utils": "file:../medusa/packages/medusa-test-utils",
    "/api-key": "file:../medusa/packages/modules/api-key",
    "/auth": "file:../medusa/packages/modules/auth",
    "/cache-inmemory": "file:../medusa/packages/modules/cache-inmemory",
    "/cache-redis": "file:../medusa/packages/modules/cache-redis",
    "/cart": "file:../medusa/packages/modules/cart",
    "/locking": "file:../medusa/packages/modules/locking",
    "/currency": "file:../medusa/packages/modules/currency",
    "/customer": "file:../medusa/packages/modules/customer",
    "/event-bus-local": "file:../medusa/packages/modules/event-bus-local",
    "/file": "file:../medusa/packages/modules/file",
    "/file-local": "file:../medusa/packages/modules/providers/file-local",
    "/fulfillment": "file:../medusa/packages/modules/fulfillment",
    "/fulfillment-manual": "file:../medusa/packages/modules/providers/fulfillment-manual",
    "/index": "file:../medusa/packages/modules/index",
    "/inventory": "file:../medusa/packages/modules/inventory",
    "/medusa": "file:../medusa/packages/medusa",
    "/notification": "file:../medusa/packages/modules/notification",
    "/notification-local": "file:../medusa/packages/modules/providers/notification-local",
    "/order": "file:../medusa/packages/modules/order",
    "/payment": "file:../medusa/packages/modules/payment",
    "/pricing": "file:../medusa/packages/modules/pricing",
    "/product": "file:../medusa/packages/modules/product",
    "/promotion": "file:../medusa/packages/modules/promotion",
    "/rbac": "file:../medusa/packages/modules/rbac",
    "/region": "file:../medusa/packages/modules/region",
    "/sales-channel": "file:../medusa/packages/modules/sales-channel",
    "/stock-location": "file:../medusa/packages/modules/stock-location",
    "/store": "file:../medusa/packages/modules/store",
    "/tax": "file:../medusa/packages/modules/tax",
    "/user": "file:../medusa/packages/modules/user",
    "/workflow-engine-inmemory": "file:../medusa/packages/modules/workflow-engine-inmemory",
    "/link-modules": "file:../medusa/packages/modules/link-modules",
    "/admin-bundler": "file:../medusa/packages/admin/admin-bundler",
    "/admin-sdk": "file:../medusa/packages/admin/admin-sdk",
    "/admin-shared": "file:../medusa/packages/admin/admin-shared",
    "/dashboard": "file:../medusa/packages/admin/dashboard",
    "/admin-vite-plugin": "file:../medusa/packages/admin/admin-vite-plugin",
    "/ui": "file:../medusa/packages/design-system/ui",
    "/icons": "file:../medusa/packages/design-system/icons",
    "/toolbox": "file:../medusa/packages/design-system/toolbox",
    "/ui-preset": "file:../medusa/packages/design-system/ui-preset",
    "/utils": "file:../medusa/packages/core/utils",
    "/types": "file:../medusa/packages/core/types",
    "/core-flows": "file:../medusa/packages/core/core-flows",
    "/orchestration": "file:../medusa/packages/core/orchestration",
    "/cli": "file:../medusa/packages/cli/medusa-cli",
    "/modules-sdk": "file:../medusa/packages/core/modules-sdk",
    "/workflows-sdk": "file:../medusa/packages/core/workflows-sdk",
    "/js-sdk": "file:../../medusa/packages/core/js-sdk",
    "/framework": "file:../medusa/packages/core/framework",
    "/auth-emailpass": "file:../medusa/packages/modules/providers/auth-emailpass",
    "/locking-redis": "file:../medusa/packages/modules/providers/locking-redis",
    "/locking-postgres": "file:../medusa/packages/modules/providers/locking-postgres",
    "/telemetry": "file:../medusa/packages/medusa-telemetry",
    "/settings": "file:../medusa/packages/modules/settings",
    "/draft-order": "file:../medusa/packages/plugins/draft-order",
    "/deps": "file:../medusa/packages/deps",
    "/caching-redis": "file:../medusa/packages/modules/providers/caching-redis",
    "/caching": "file:../medusa/packages/modules/caching",
    "/translation": "file:../medusa/packages/modules/translation",
  }
}
```

2. Every time you make a change in the forked Medusa repository, you need to build the packages where the modifications took place with `yarn build`. Some packages have a watch script, so you can execute `yarn watch` once and it will automatically build on changes:

```bash
yarn build # or yarn watch
```

3. After building changes in the forked medusa repository, run the following command in the test project to regenerate the `node_modules` directory with the newly built contents from the previous step:

```bash
# For npm/yarn
rm -R node_modules && yarn && yarn dev

# For pnpm
rm -R node_modules && pnpm install && pnpm dev
```

## Workflow

### Branches

There are currently two base branches:

- `develop` - development of Medusa 2.0
- `v1.x` - development of Medusa v1.x

Note, if you wish to patch v1.x you should use `v1.x` as the base branch for your pull request. This is not the default when you clone the repository.

All changes should be part of a branch and submitted as a pull request - your branches should be prefixed with one of:

- `fix/` for bug fixes
- `feat/` for features
- `docs/` for documentation changes

### Commits

Strive towards keeping your commits small and isolated - this helps the reviewer understand what is going on and makes it easier to process your requests.

### Pull Requests

**Base branch**

If you wish to patch v1.x your base branch should be `v1.x`.

If your changes should result in a new version of Medusa, you will need to generate a **changelog**. Follow [this guide](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) on how to generate a changeset.

Finally, submit your branch as a pull request. Your pull request should be opened against the `develop` branch in the main Medusa repo.

In your PR's description you should follow the structure:

- **What** - what changes are in this PR
- **Why** - why are these changes relevant
- **How** - how have the changes been implemented
- **Testing** - how has the changes been tested or how can the reviewer test the feature

We highly encourage that you do a self-review prior to requesting a review. To do a self review click the review button in the top right corner, go through your code and annotate your changes. This makes it easier for the reviewer to process your PR.

#### Merge Style

All pull requests are squashed and merged.

### Testing

All PRs should include tests for the changes that are included. We have two types of tests that must be written:

- **Unit tests** found under `packages/*/src/services/__tests__` and `packages/*/src/api/routes/*/__tests__`
- **Integration tests** found in `integration-tests/*/__tests__`

### Documentation

- We generally encourage to document your changes through comments in your code.
- If you alter user-facing behaviour you must provide documentation for such changes.
- All methods and endpoints should be documented using [TSDoc](https://tsdoc.org/).

### Release

The Medusa team will regularly create releases from two release branches:

- `develop` - preview releases of Medusa 2.0
- `v1.x` - official releases of Medusa 1.x
