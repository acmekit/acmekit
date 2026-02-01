const { Modules } = require("@acmekit/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL
process.env.LOG_LEVEL = "error"

const enableAcmeKitV2 = process.env.MEDUSA_FF_MEDUSA_V2 == "true"

const customFulfillmentProvider = {
  resolve: "@acmekit/fulfillment-manual",
  id: "test-provider",
}

module.exports = {
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
  featureFlags: {
    acmekit_v2: enableAcmeKitV2,
  },
  modules: {
    [Modules.AUTH]: true,
    [Modules.USER]: {
      scope: "internal",
      resolve: "@acmekit/user",
      options: {
        jwt_secret: "test",
      },
    },
    [Modules.CACHE]: {
      resolve: "@acmekit/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    [Modules.STOCK_LOCATION]: {
      resolve: "@acmekit/stock-location",
      options: {},
    },
    [Modules.INVENTORY]: {
      resolve: "@acmekit/inventory",
      options: {},
    },
    [Modules.FILE]: {
      resolve: "@acmekit/file",
      options: {
        providers: [
          {
            resolve: "@acmekit/file-local",
            id: "local",
          },
        ],
      },
    },
    [Modules.PRODUCT]: true,
    [Modules.PRICING]: true,
    [Modules.PROMOTION]: true,
    [Modules.REGION]: true,
    [Modules.CUSTOMER]: true,
    [Modules.SALES_CHANNEL]: true,
    [Modules.CART]: true,
    [Modules.WORKFLOW_ENGINE]: true,
    [Modules.REGION]: true,
    [Modules.API_KEY]: true,
    [Modules.STORE]: true,
    [Modules.TAX]: true,
    [Modules.CURRENCY]: true,
    [Modules.ORDER]: true,
    [Modules.FULFILLMENT]: {
      /** @type {import('@acmekit/fulfillment').FulfillmentModuleOptions} */
      options: {
        providers: [customFulfillmentProvider],
      },
    },
    [Modules.NOTIFICATION]: {
      /** @type {import('@acmekit/types').LocalNotificationServiceOptions} */
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
  },
}
