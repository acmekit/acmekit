export const Modules = {
  ANALYTICS: "analytics",
  AUTH: "auth",
  CACHE: "cache",
  CUSTOMER: "customer",
  EVENT_BUS: "event_bus",
  LINK: "link_modules",
  SALES_CHANNEL: "sales_channel",
  USER: "user",
  WORKFLOW_ENGINE: "workflows",
  ORDER: "order",
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
  [Modules.ANALYTICS]: "@medusajs/medusa/analytics",
  [Modules.AUTH]: "@medusajs/medusa/auth",
  [Modules.CACHE]: "@medusajs/medusa/cache-inmemory",
  [Modules.CUSTOMER]: "@medusajs/medusa/customer",
  [Modules.EVENT_BUS]: "@medusajs/medusa/event-bus-local",
  [Modules.LINK]: "@medusajs/medusa/link-modules",
  [Modules.SALES_CHANNEL]: "@medusajs/medusa/sales-channel",
  [Modules.USER]: "@medusajs/medusa/user",
  [Modules.WORKFLOW_ENGINE]: "@medusajs/medusa/workflow-engine-inmemory",
  [Modules.ORDER]: "@medusajs/medusa/order",
  [Modules.API_KEY]: "@medusajs/medusa/api-key",
  [Modules.FILE]: "@medusajs/medusa/file",
  [Modules.NOTIFICATION]: "@medusajs/medusa/notification",
  [Modules.INDEX]: "@medusajs/medusa/index-module",
  [Modules.LOCKING]: "@medusajs/medusa/locking",
  [Modules.SETTINGS]: "@medusajs/medusa/settings",
  [Modules.CACHING]: "@medusajs/medusa/caching",
  [Modules.TRANSLATION]: "@medusajs/medusa/translation",
  [Modules.RBAC]: "@medusajs/medusa/rbac",
}

export const REVERSED_MODULE_PACKAGE_NAMES = Object.entries(
  MODULE_PACKAGE_NAMES
).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {})

// TODO: temporary fix until the event bus, cache and workflow engine are migrated to use providers and therefore only a single resolution will be good
export const TEMPORARY_REDIS_MODULE_PACKAGE_NAMES = {
  [Modules.EVENT_BUS]: "@medusajs/medusa/event-bus-redis",
  [Modules.CACHE]: "@medusajs/medusa/cache-redis",
  [Modules.WORKFLOW_ENGINE]: "@medusajs/medusa/workflow-engine-redis",
  [Modules.LOCKING]: "@medusajs/medusa/locking-redis",
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
