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
  [Modules.ANALYTICS]: "/medusa/analytics",
  [Modules.AUTH]: "/medusa/auth",
  [Modules.CACHE]: "/medusa/cache-inmemory",
  [Modules.CUSTOMER]: "/medusa/customer",
  [Modules.EVENT_BUS]: "/medusa/event-bus-local",
  [Modules.LINK]: "/medusa/link-modules",
  [Modules.USER]: "/medusa/user",
  [Modules.WORKFLOW_ENGINE]: "/medusa/workflow-engine-inmemory",
  [Modules.API_KEY]: "/medusa/api-key",
  [Modules.FILE]: "/medusa/file",
  [Modules.NOTIFICATION]: "/medusa/notification",
  [Modules.INDEX]: "/medusa/index-module",
  [Modules.LOCKING]: "/medusa/locking",
  [Modules.SETTINGS]: "/medusa/settings",
  [Modules.CACHING]: "/medusa/caching",
  [Modules.TRANSLATION]: "/medusa/translation",
  [Modules.RBAC]: "/medusa/rbac",
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

// TODO: temporary fix until the event bus, cache and workflow engine are migrated to use providers and therefore only a single resolution will be good
export const TEMPORARY_REDIS_MODULE_PACKAGE_NAMES = {
  [Modules.EVENT_BUS]: "/medusa/event-bus-redis",
  [Modules.CACHE]: "/medusa/cache-redis",
  [Modules.WORKFLOW_ENGINE]: "/medusa/workflow-engine-redis",
  [Modules.LOCKING]: "/medusa/locking-redis",
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
