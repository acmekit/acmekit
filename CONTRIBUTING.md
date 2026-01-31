# Contributing

Thank you for considering contributing to AcmeKit! This document will outline how to submit changes to this repository and which conventions to follow. If you are ever in doubt about anything we encourage you to reach out either by submitting an issue here or reaching out [via Discord](https://discord.gg/xpCwq3Kfn8).

If you're contributing to our documentation, make sure to also check out the [contribution guidelines on our documentation website](https://docs.acmekit.com/resources/contribution-guidelines/docs).

### Important

Our core maintainers prioritize pull requests (PRs) from within our organization. External contributions are regularly triaged, but not at any fixed cadence. It varies depending on how busy the maintainers are. This is applicable to all types of PRs, so we kindly ask for your patience.

If you, as a community contributor, wish to work on more extensive features, please reach out to CODEOWNERS instead of directly submitting a PR with all the changes. This approach saves us both time, especially if the PR is not accepted (which will be the case if it does not align with our roadmap), and helps us effectively review and evaluate your contribution if it is accepted.

## Prerequisites

- **You're familiar with GitHub Issues and Pull Requests**
- **You've read the [docs](https://docs.acmekit.com).**
- **You've setup a test project with `npx create-acmekit-app@latest`**

## Issues before PRs

1. Before you start working on a change please make sure that there is an issue for what you will be working on. You can either find and [existing issue](https://github.com/acmekit/acmekit/issues) or [open a new issue](https://github.com/acmekit/acmekit/issues/new) if none exists. Doing this makes sure that others can contribute with thoughts or suggest alternatives, ultimately making sure that we only add changes that make

2. When you are ready to start working on a change you should first [fork the AcmeKit repo](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) and [branch out](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-and-deleting-branches-within-your-repository) from the `develop` branch.
3. Make your changes.
4. [Open a pull request towards the develop branch in the AcmeKit repo](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Within a couple of days a AcmeKit team member will review, comment and eventually approve your PR.

## Local development

> Prerequisites:
>
> 1. [Forked AcmeKit repository cloned locally](https://github.com/acmekit/acmekit).
> 2. [A local AcmeKit application for testing](https://docs.acmekit.com/learn/installation).

The code snippets in this section assume that your forked AcmeKit project and the test project are sibling directories, and you optionally setup the starter storefront as part of the installation. For example:

```
|
|__ acmekit  // forked repository
|
|__ test-project // acmekit application for testing
|
|__ test-project_storefront // (optional) storefront to interact with acmekit application
```

1. Replace the @acmekit/\* dependencies and devDependencies in you test project's `package.json` to point to the corresponding local packages in your forked AcmeKit repository. You will also need to add the acmekit packages in the resolutions section of the `package.json`, so that every dependency is resolved locally. For example, assuming your forked AcmeKit project and the test project are sibling directories:

```json
// test project package.json (for npm/yarn)
"dependencies": {
    // more deps
    "@acmekit/admin-sdk": "file:../acmekit/packages/admin/admin-sdk",
    "@acmekit/cli": "file:../acmekit/packages/cli/acmekit-cli",
    "@acmekit/framework": "file:../acmekit/packages/core/framework",
    "@acmekit/acmekit": "file:../acmekit/packages/acmekit",
},
"devDependencies": {
    // more dev deps
    "@acmekit/test-utils": "file:../acmekit/packages/acmekit-test-utils",
},
"resolutions": {
    // more resolutions
    "@acmekit/test-utils": "file:../acmekit/packages/acmekit-test-utils",
    "@acmekit/api-key": "file:../acmekit/packages/modules/api-key",
    "@acmekit/auth": "file:../acmekit/packages/modules/auth",
    "@acmekit/cache-inmemory": "file:../acmekit/packages/modules/cache-inmemory",
    "@acmekit/cache-redis": "file:../acmekit/packages/modules/cache-redis",
    "@acmekit/cart": "file:../acmekit/packages/modules/cart",
    "@acmekit/locking": "file:../acmekit/packages/modules/locking",
    "@acmekit/currency": "file:../acmekit/packages/modules/currency",
    "@acmekit/customer": "file:../acmekit/packages/modules/customer",
    "@acmekit/event-bus-local": "file:../acmekit/packages/modules/event-bus-local",
    "@acmekit/file": "file:../acmekit/packages/modules/file",
    "@acmekit/file-local": "file:../acmekit/packages/modules/providers/file-local",
    "@acmekit/fulfillment": "file:../acmekit/packages/modules/fulfillment",
    "@acmekit/fulfillment-manual": "file:../acmekit/packages/modules/providers/fulfillment-manual",
    "@acmekit/index": "file:../acmekit/packages/modules/index",
    "@acmekit/inventory": "file:../acmekit/packages/modules/inventory",
    "@acmekit/acmekit": "file:../acmekit/packages/acmekit",
    "@acmekit/notification": "file:../acmekit/packages/modules/notification",
    "@acmekit/notification-local": "file:../acmekit/packages/modules/providers/notification-local",
    "@acmekit/order": "file:../acmekit/packages/modules/order",
    "@acmekit/payment": "file:../acmekit/packages/modules/payment",
    "@acmekit/pricing": "file:../acmekit/packages/modules/pricing",
    "@acmekit/product": "file:../acmekit/packages/modules/product",
    "@acmekit/promotion": "file:../acmekit/packages/modules/promotion",
    "@acmekit/rbac": "file:../acmekit/packages/modules/rbac",
    "@acmekit/region": "file:../acmekit/packages/modules/region",
    "@acmekit/sales-channel": "file:../acmekit/packages/modules/sales-channel",
    "@acmekit/stock-location": "file:../acmekit/packages/modules/stock-location",
    "@acmekit/store": "file:../acmekit/packages/modules/store",
    "@acmekit/tax": "file:../acmekit/packages/modules/tax",
    "@acmekit/user": "file:../acmekit/packages/modules/user",
    "@acmekit/workflow-engine-inmemory": "file:../acmekit/packages/modules/workflow-engine-inmemory",
    "@acmekit/link-modules": "file:../acmekit/packages/modules/link-modules",
    "@acmekit/admin-bundler": "file:../acmekit/packages/admin/admin-bundler",
    "@acmekit/admin-sdk": "file:../acmekit/packages/admin/admin-sdk",
    "@acmekit/admin-shared": "file:../acmekit/packages/admin/admin-shared",
    "@acmekit/dashboard": "file:../acmekit/packages/admin/dashboard",
    "@acmekit/admin-vite-plugin": "file:../acmekit/packages/admin/admin-vite-plugin",
    "@acmekit/ui": "file:../acmekit/packages/design-system/ui",
    "@acmekit/icons": "file:../acmekit/packages/design-system/icons",
    "@acmekit/toolbox": "file:../acmekit/packages/design-system/toolbox",
    "@acmekit/ui-preset": "file:../acmekit/packages/design-system/ui-preset",
    "@acmekit/utils": "file:../acmekit/packages/core/utils",
    "@acmekit/types": "file:../acmekit/packages/core/types",
    "@acmekit/core-flows": "file:../acmekit/packages/core/core-flows",
    "@acmekit/orchestration": "file:../acmekit/packages/core/orchestration",
    "@acmekit/cli": "file:../acmekit/packages/cli/acmekit-cli",
    "@acmekit/modules-sdk": "file:../acmekit/packages/core/modules-sdk",
    "@acmekit/workflows-sdk": "file:../acmekit/packages/core/workflows-sdk",
    "@acmekit/js-sdk": "file:../../acmekit/packages/core/js-sdk",
    "@acmekit/framework": "file:../acmekit/packages/core/framework",
    "@acmekit/auth-emailpass": "file:../acmekit/packages/modules/providers/auth-emailpass",
    "@acmekit/locking-redis": "file:../acmekit/packages/modules/providers/locking-redis",
    "@acmekit/locking-postgres": "file:../acmekit/packages/modules/providers/locking-postgres",
    "@acmekit/telemetry": "file:../acmekit/packages/acmekit-telemetry",
    "@acmekit/settings": "file:../acmekit/packages/modules/settings",
    "@acmekit/draft-order": "file:../acmekit/packages/plugins/draft-order",
    "@acmekit/deps": "file:../acmekit/packages/deps",
    "@acmekit/caching-redis": "file:../acmekit/packages/modules/providers/caching-redis",
    "@acmekit/caching": "file:../acmekit/packages/modules/caching",
    "@acmekit/translation": "file:../acmekit/packages/modules/translation",
}
```

   If you're using `pnpm`, use `pnpm.overrides` instead of `resolutions`:

```json
// test project package.json (for pnpm)
"dependencies": {
    // more deps
    "@acmekit/admin-sdk": "file:../acmekit/packages/admin/admin-sdk",
    "@acmekit/cli": "file:../acmekit/packages/cli/acmekit-cli",
    "@acmekit/framework": "file:../acmekit/packages/core/framework",
    "@acmekit/acmekit": "file:../acmekit/packages/acmekit",
},
"devDependencies": {
    // more dev deps
    "@acmekit/test-utils": "file:../acmekit/packages/acmekit-test-utils",
},
"pnpm": {
  "overrides": {
    // more overrides
    "@acmekit/test-utils": "file:../acmekit/packages/acmekit-test-utils",
    "@acmekit/api-key": "file:../acmekit/packages/modules/api-key",
    "@acmekit/auth": "file:../acmekit/packages/modules/auth",
    "@acmekit/cache-inmemory": "file:../acmekit/packages/modules/cache-inmemory",
    "@acmekit/cache-redis": "file:../acmekit/packages/modules/cache-redis",
    "@acmekit/cart": "file:../acmekit/packages/modules/cart",
    "@acmekit/locking": "file:../acmekit/packages/modules/locking",
    "@acmekit/currency": "file:../acmekit/packages/modules/currency",
    "@acmekit/customer": "file:../acmekit/packages/modules/customer",
    "@acmekit/event-bus-local": "file:../acmekit/packages/modules/event-bus-local",
    "@acmekit/file": "file:../acmekit/packages/modules/file",
    "@acmekit/file-local": "file:../acmekit/packages/modules/providers/file-local",
    "@acmekit/fulfillment": "file:../acmekit/packages/modules/fulfillment",
    "@acmekit/fulfillment-manual": "file:../acmekit/packages/modules/providers/fulfillment-manual",
    "@acmekit/index": "file:../acmekit/packages/modules/index",
    "@acmekit/inventory": "file:../acmekit/packages/modules/inventory",
    "@acmekit/acmekit": "file:../acmekit/packages/acmekit",
    "@acmekit/notification": "file:../acmekit/packages/modules/notification",
    "@acmekit/notification-local": "file:../acmekit/packages/modules/providers/notification-local",
    "@acmekit/order": "file:../acmekit/packages/modules/order",
    "@acmekit/payment": "file:../acmekit/packages/modules/payment",
    "@acmekit/pricing": "file:../acmekit/packages/modules/pricing",
    "@acmekit/product": "file:../acmekit/packages/modules/product",
    "@acmekit/promotion": "file:../acmekit/packages/modules/promotion",
    "@acmekit/rbac": "file:../acmekit/packages/modules/rbac",
    "@acmekit/region": "file:../acmekit/packages/modules/region",
    "@acmekit/sales-channel": "file:../acmekit/packages/modules/sales-channel",
    "@acmekit/stock-location": "file:../acmekit/packages/modules/stock-location",
    "@acmekit/store": "file:../acmekit/packages/modules/store",
    "@acmekit/tax": "file:../acmekit/packages/modules/tax",
    "@acmekit/user": "file:../acmekit/packages/modules/user",
    "@acmekit/workflow-engine-inmemory": "file:../acmekit/packages/modules/workflow-engine-inmemory",
    "@acmekit/link-modules": "file:../acmekit/packages/modules/link-modules",
    "@acmekit/admin-bundler": "file:../acmekit/packages/admin/admin-bundler",
    "@acmekit/admin-sdk": "file:../acmekit/packages/admin/admin-sdk",
    "@acmekit/admin-shared": "file:../acmekit/packages/admin/admin-shared",
    "@acmekit/dashboard": "file:../acmekit/packages/admin/dashboard",
    "@acmekit/admin-vite-plugin": "file:../acmekit/packages/admin/admin-vite-plugin",
    "@acmekit/ui": "file:../acmekit/packages/design-system/ui",
    "@acmekit/icons": "file:../acmekit/packages/design-system/icons",
    "@acmekit/toolbox": "file:../acmekit/packages/design-system/toolbox",
    "@acmekit/ui-preset": "file:../acmekit/packages/design-system/ui-preset",
    "@acmekit/utils": "file:../acmekit/packages/core/utils",
    "@acmekit/types": "file:../acmekit/packages/core/types",
    "@acmekit/core-flows": "file:../acmekit/packages/core/core-flows",
    "@acmekit/orchestration": "file:../acmekit/packages/core/orchestration",
    "@acmekit/cli": "file:../acmekit/packages/cli/acmekit-cli",
    "@acmekit/modules-sdk": "file:../acmekit/packages/core/modules-sdk",
    "@acmekit/workflows-sdk": "file:../acmekit/packages/core/workflows-sdk",
    "@acmekit/js-sdk": "file:../../acmekit/packages/core/js-sdk",
    "@acmekit/framework": "file:../acmekit/packages/core/framework",
    "@acmekit/auth-emailpass": "file:../acmekit/packages/modules/providers/auth-emailpass",
    "@acmekit/locking-redis": "file:../acmekit/packages/modules/providers/locking-redis",
    "@acmekit/locking-postgres": "file:../acmekit/packages/modules/providers/locking-postgres",
    "@acmekit/telemetry": "file:../acmekit/packages/acmekit-telemetry",
    "@acmekit/settings": "file:../acmekit/packages/modules/settings",
    "@acmekit/draft-order": "file:../acmekit/packages/plugins/draft-order",
    "@acmekit/deps": "file:../acmekit/packages/deps",
    "@acmekit/caching-redis": "file:../acmekit/packages/modules/providers/caching-redis",
    "@acmekit/caching": "file:../acmekit/packages/modules/caching",
    "@acmekit/translation": "file:../acmekit/packages/modules/translation",
  }
}
```

2. Every time you make a change in the forked AcmeKit repository, you need to build the packages where the modifications took place with `yarn build`. Some packages have a watch script, so you can execute `yarn watch` once and it will automatically build on changes:

```bash
yarn build # or yarn watch
```

3. After building changes in the forked acmekit repository, run the following command in the test project to regenerate the `node_modules` directory with the newly built contents from the previous step:

```bash
# For npm/yarn
rm -R node_modules && yarn && yarn dev

# For pnpm
rm -R node_modules && pnpm install && pnpm dev
```

## Workflow

### Branches

There are currently two base branches:

- `develop` - development of AcmeKit 2.0
- `v1.x` - development of AcmeKit v1.x

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

If your changes should result in a new version of AcmeKit, you will need to generate a **changelog**. Follow [this guide](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) on how to generate a changeset.

Finally, submit your branch as a pull request. Your pull request should be opened against the `develop` branch in the main AcmeKit repo.

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

The AcmeKit team will regularly create releases from two release branches:

- `develop` - preview releases of AcmeKit 2.0
- `v1.x` - official releases of AcmeKit 1.x
