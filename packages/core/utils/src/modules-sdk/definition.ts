export const Modules = {
  ANALYTICS: "analytics",
  AUTH: "auth",
  CACHE: "cache",
  CUSTOMER: "customer",
  EVENT_BUS: "event_bus",
  LINK: "link_modules",
  USER: "user",
  WORKFLOW_ENGINE: "workflows",
  API_KEY: "api_key",
  STORE: "store",
  FILE: "file",
  NOTIFICATION: "notification",
  INDEX: "index",
  LOCKING: "locking",
  SETTINGS: "settings",
  CACHING: "caching",
  TRANSLATION: "translation",
  RBAC: "rbac",
} as const

export const MODULE_PACKAGE_NAMES = {
  [Modules.ANALYTICS]: "@acmekit/acmekit/analytics",
  [Modules.AUTH]: "@acmekit/acmekit/auth",
  [Modules.CACHE]: "@acmekit/acmekit/cache-inmemory",
  [Modules.CUSTOMER]: "@acmekit/acmekit/customer",
  [Modules.EVENT_BUS]: "@acmekit/acmekit/event-bus-local",
  [Modules.LINK]: "@acmekit/acmekit/link-modules",
  [Modules.USER]: "@acmekit/acmekit/user",
  [Modules.WORKFLOW_ENGINE]: "@acmekit/acmekit/workflow-engine-inmemory",
  [Modules.API_KEY]: "@acmekit/acmekit/api-key",
  [Modules.STORE]: "@acmekit/acmekit/store",
  [Modules.FILE]: "@acmekit/acmekit/file",
  [Modules.NOTIFICATION]: "@acmekit/acmekit/notification",
  [Modules.INDEX]: "@acmekit/acmekit/index-module",
  [Modules.LOCKING]: "@acmekit/acmekit/locking",
  [Modules.SETTINGS]: "@acmekit/acmekit/settings",
  [Modules.CACHING]: "@acmekit/acmekit/caching",
  [Modules.TRANSLATION]: "@acmekit/acmekit/translation",
  [Modules.RBAC]: "@acmekit/acmekit/rbac",
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

// TODO: temporary fix until the event bus, cache and workflow engine are migrated to use providers and therefore only a single resolution will be good
export const TEMPORARY_REDIS_MODULE_PACKAGE_NAMES = {
  [Modules.EVENT_BUS]: "@acmekit/acmekit/event-bus-redis",
  [Modules.CACHE]: "@acmekit/acmekit/cache-redis",
  [Modules.WORKFLOW_ENGINE]: "@acmekit/acmekit/workflow-engine-redis",
  [Modules.LOCKING]: "@acmekit/acmekit/locking-redis",
}

REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.EVENT_BUS]
] = Modules.EVENT_BUS
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.CACHE]
] = Modules.CACHE
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE]
] = Modules.WORKFLOW_ENGINE
REVERSED_MODULE_PACKAGE_NAMES[
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.LOCKING]
] = Modules.LOCKING

/**
 * Making modules be referenced as a type as well.
 */
export type Modules = (typeof Modules)[keyof typeof Modules]
export const ModuleRegistrationName = Modules
