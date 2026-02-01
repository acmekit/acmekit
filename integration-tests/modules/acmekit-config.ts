import { defineConfig } from "@acmekit/utils"

const { Modules } = require("@acmekit/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL
process.env.LOG_LEVEL = "error"

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  plugins: [],
  projectConfig: {
    databaseUrl: DB_URL,
    databaseType: "postgres",
    http: {
      jwtSecret: "test",
      cookieSecret: "test",
    },
  },
  featureFlags: {},
  modules: [
    {
      key: "testingModule",
      resolve: "__tests__/__fixtures__/testing-module",
    },
    {
      key: "auth",
      resolve: "@acmekit/auth",
      options: {
        providers: [
          {
            id: "emailpass",
            resolve: "@acmekit/auth-emailpass",
          },
        ],
      },
    },
    {
      key: Modules.USER,
      scope: "internal",
      resolve: "@acmekit/user",
      options: {
        jwt_secret: "test",
      },
    },
    {
      key: Modules.CACHE,
      resolve: "@acmekit/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    {
      key: Modules.LOCKING,
      resolve: "@acmekit/locking",
    },
    {
      key: Modules.CUSTOMER,
      resolve: "@acmekit/customer",
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: "@acmekit/workflow-engine-inmemory",
    },
    {
      key: Modules.API_KEY,
      resolve: "@acmekit/api-key",
    },
    {
      key: Modules.STORE,
      resolve: "@acmekit/store",
    },
    {
      key: Modules.NOTIFICATION,
      options: {
        providers: [
          {
            resolve: "@acmekit/notification-local",
            id: "local-notification-provider",
            options: {
              name: "Local Notification Provider",
              channels: ["log", "email"],
            },
          },
        ],
      },
    },
    {
      key: Modules.INDEX,
      resolve: "@acmekit/index",
      disable: process.env.ENABLE_INDEX_MODULE !== "true",
    },
    {
      key: "brand",
      resolve: "src/modules/brand",
    },
    {
      key: Modules.RBAC,
      resolve: "@acmekit/rbac",
    },
  ],
})
