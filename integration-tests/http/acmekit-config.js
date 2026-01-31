const { defineConfig, Modules } = require("@acmekit/utils")
const os = require("os")
const path = require("path")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.DATABASE_URL = DB_URL
process.env.LOG_LEVEL = "error"

const customFulfillmentProvider = {
  resolve: "@acmekit/fulfillment-manual",
  id: "test-provider",
}

const customFulfillmentProviderCalculated = {
  resolve: require("./dist/utils/providers/fulfillment-manual-calculated")
    .default,
  id: "test-provider-calculated",
}

const modules = {
  [Modules.FULFILLMENT]: {
    /** @type {import('@acmekit/fulfillment').FulfillmentModuleOptions} */
    options: {
      providers: [
        customFulfillmentProvider,
        customFulfillmentProviderCalculated,
      ],
    },
  },
  [Modules.NOTIFICATION]: {
    resolve: "@acmekit/notification",
    options: {
      providers: [
        {
          resolve: "@acmekit/notification-local",
          id: "local",
          options: {
            name: "Local Notification Provider",
            channels: ["feed"],
          },
        },
      ],
    },
  },
  [Modules.FILE]: {
    resolve: "@acmekit/file",
    options: {
      providers: [
        {
          resolve: "@acmekit/file-local",
          id: "local",
          options: {
            // This is the directory where we can reliably write in CI environments
            upload_dir: path.join(os.tmpdir(), "uploads"),
            private_upload_dir: path.join(os.tmpdir(), "static"),
          },
        },
      ],
    },
  },
  [Modules.INDEX]: {
    resolve: "@acmekit/index",
    disable: process.env.ENABLE_INDEX_MODULE !== "true",
  },
  [Modules.RBAC]: {
    resolve: "@acmekit/rbac",
    disable: process.env.MEDUSA_FF_RBAC !== "true",
  },
}

if (process.env.MEDUSA_FF_TRANSLATION === "true") {
  modules[Modules.TRANSLATION] = {
    resolve: "@acmekit/translation",
  }
}

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: "test",
    },
  },
  featureFlags: {
    index_engine: process.env.ENABLE_INDEX_MODULE === "true",
    translation: process.env.MEDUSA_FF_TRANSLATION === "true",
    rbac: process.env.MEDUSA_FF_RBAC === "true",
  },
  modules,
})
