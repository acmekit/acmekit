import { defineConfig } from "/utils"

const { Modules } = require("/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL
process.env.LOG_LEVEL = "error"

const customTaxProviderRegistration = {
  resolve: {
    services: [require("/tax/dist/providers/system").default],
  },
  id: "system_2",
}

const customPaymentProvider = {
  resolve: {
    services: [require("/payment/dist/providers/system").default],
  },
  id: "default_2",
}

const customFulfillmentProvider = {
  resolve: "/fulfillment-manual",
  id: "test-provider",
}

const customFulfillmentProviderCalculated = {
  resolve: require("./dist/utils/providers/fulfillment-manual-calculated")
    .default,
  id: "test-provider-calculated",
}

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
      resolve: "/auth",
      options: {
        providers: [
          {
            id: "emailpass",
            resolve: "/auth-emailpass",
          },
        ],
      },
    },
    {
      key: Modules.USER,
      scope: "internal",
      resolve: "/user",
      options: {
        jwt_secret: "test",
      },
    },
    {
      key: Modules.CACHE,
      resolve: "/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    {
      key: Modules.LOCKING,
      resolve: "/locking",
    },
    {
      key: Modules.STOCK_LOCATION,
      resolve: "/stock-location",
      options: {},
    },
    {
      key: Modules.INVENTORY,
      resolve: "/inventory",
      options: {},
    },
    {
      key: Modules.PRODUCT,
      resolve: "/product",
    },
    {
      key: Modules.PRICING,
      resolve: "/pricing",
    },
    {
      key: Modules.PROMOTION,
      resolve: "/promotion",
    },
    {
      key: Modules.REGION,
      resolve: "/region",
    },
    {
      key: Modules.CUSTOMER,
      resolve: "/customer",
    },
    {
      key: Modules.SALES_CHANNEL,
      resolve: "/sales-channel",
    },
    {
      key: Modules.CART,
      resolve: "/cart",
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: "/workflow-engine-inmemory",
    },
    {
      key: Modules.API_KEY,
      resolve: "/api-key",
    },
    {
      key: Modules.STORE,
      resolve: "/store",
    },
    {
      key: Modules.TAX,
      resolve: "/tax",
      options: {
        providers: [customTaxProviderRegistration],
      },
    },
    {
      key: Modules.CURRENCY,
      resolve: "/currency",
    },
    {
      key: Modules.ORDER,
      resolve: "/order",
    },
    {
      key: Modules.PAYMENT,
      resolve: "/payment",
      options: {
        providers: [customPaymentProvider],
      },
    },
    {
      key: Modules.FULFILLMENT,
      resolve: "/fulfillment",
      options: {
        providers: [
          customFulfillmentProvider,
          customFulfillmentProviderCalculated,
        ],
      },
    },
    {
      key: Modules.NOTIFICATION,
      options: {
        providers: [
          {
            resolve: "/notification-local",
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
      resolve: "/index",
      disable: process.env.ENABLE_INDEX_MODULE !== "true",
    },
    {
      key: "brand",
      resolve: "src/modules/brand",
    },
    {
      key: Modules.RBAC,
      resolve: "/rbac",
    },
  ],
})
