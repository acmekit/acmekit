import { Modules } from "../../modules-sdk"
import { DEFAULT_STORE_RESTRICTED_FIELDS, defineConfig } from "../define-config"

describe("defineConfig", function () {
  it("should merge empty config with the defaults", function () {
    expect(defineConfig()).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules", function () {
    expect(
      defineConfig({
        modules: {
          GithubModuleService: {
            resolve: "./modules/github",
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "GithubModuleService": {
            "resolve": "./modules/github",
          },
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided", function () {
    expect(
      defineConfig({
        modules: [
          {
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "GithubModuleService": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided with a key to override the module registration name", function () {
    expect(
      defineConfig({
        modules: [
          {
            key: "GithubModuleServiceOverride",
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "GithubModuleServiceOverride": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom project.http config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include disabled modules", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
        modules: {
          [Modules.CUSTOMER]: false,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "disable": true,
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include cloud-based modules when in cloud execution context", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "acmekit-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.CACHE_REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/acmekit-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "acmekit-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@acmekit/acmekit/cache-redis",
          },
          "caching": {
            "options": {
              "providers": [
                {
                  "id": "caching-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@acmekit/acmekit/caching-redis",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/caching",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
              "workerOptions": {
                "concurrency": 1,
              },
            },
            "resolve": "@acmekit/acmekit/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "acmekit-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/acmekit-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@acmekit/acmekit/file-s3",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@acmekit/acmekit/locking-redis",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@acmekit/acmekit/workflow-engine-redis",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include cloud-based config with dynamo db", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "acmekit-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.CACHE_REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/acmekit-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "acmekit-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    process.env.SESSION_STORE = "dynamodb"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@acmekit/acmekit/cache-redis",
          },
          "caching": {
            "options": {
              "providers": [
                {
                  "id": "caching-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@acmekit/acmekit/caching-redis",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/caching",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
              "workerOptions": {
                "concurrency": 1,
              },
            },
            "resolve": "@acmekit/acmekit/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "acmekit-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/acmekit-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@acmekit/acmekit/file-s3",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@acmekit/acmekit/locking-redis",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@acmekit/acmekit/workflow-engine-redis",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {
            "dynamodbOptions": {
              "hashKey": "id",
              "initialized": true,
              "prefix": "sess:",
              "readCapacityUnits": 5,
              "skipThrowMissingSpecialKeys": true,
              "table": "acmekit-sessions",
              "writeCapacityUnits": 5,
            },
          },
        },
      }
    `)
  })

  it("should allow overriding cloud-only dynamodb config values via environment variables", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "acmekit-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.CACHE_REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/acmekit-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "acmekit-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    process.env.SESSION_STORE = "dynamodb"
    process.env.DYNAMO_DB_SESSIONS_CREATE_TABLE = "true"
    process.env.DYNAMO_DB_SESSIONS_HASH_KEY = "user_id"
    process.env.DYNAMO_DB_SESSIONS_PREFIX = "my_session:"
    process.env.DYNAMO_DB_SESSIONS_TABLE = "test-sessions"
    process.env.DYNAMO_DB_SESSIONS_READ_UNITS = "10"
    process.env.DYNAMO_DB_SESSIONS_WRITE_UNITS = "10"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@acmekit/acmekit/cache-redis",
          },
          "caching": {
            "options": {
              "providers": [
                {
                  "id": "caching-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@acmekit/acmekit/caching-redis",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/caching",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
              "workerOptions": {
                "concurrency": 1,
              },
            },
            "resolve": "@acmekit/acmekit/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "acmekit-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/acmekit-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@acmekit/acmekit/file-s3",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@acmekit/acmekit/locking-redis",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@acmekit/acmekit/workflow-engine-redis",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {
            "dynamodbOptions": {
              "hashKey": "user_id",
              "initialized": false,
              "prefix": "my_session:",
              "readCapacityUnits": 10,
              "skipThrowMissingSpecialKeys": true,
              "table": "test-sessions",
              "writeCapacityUnits": 10,
            },
          },
        },
      }
    `)
  })

  it("should include default plugins", function () {
    const config = defineConfig()
    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: {} },
    ])
  })

  it("should append custom plugins to defaults", function () {
    const config = defineConfig({
      plugins: [
        { resolve: "@acmekit/custom-plugin", options: { key: "value" } },
      ],
    })
    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: {} },
      { resolve: "@acmekit/custom-plugin", options: { key: "value" } },
    ])
  })

  it("should handle multiple custom plugins", function () {
    const config = defineConfig({
      plugins: [
        { resolve: "@acmekit/plugin-one", options: { setting: "a" } },
        { resolve: "@acmekit/plugin-two", options: { setting: "b" } },
        { resolve: "./local-plugin", options: {} },
      ],
    })
    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: {} },
      { resolve: "@acmekit/plugin-one", options: { setting: "a" } },
      { resolve: "@acmekit/plugin-two", options: { setting: "b" } },
      { resolve: "./local-plugin", options: {} },
    ])
  })

  it("should merge plugins", function () {
    const config = defineConfig({
      plugins: [
        { resolve: "@acmekit/draft-order", options: { setting: "a" } },
      ],
    })
    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: { setting: "a" } },
    ])
  })

  it("should include plugins in cloud environment", function () {
    const originalEnv = { ...process.env }
    process.env.EXECUTION_CONTEXT = "acmekit-cloud"

    const config = defineConfig({
      plugins: [
        { resolve: "@acmekit/cloud-plugin", options: { cloud: true } },
      ],
    })

    process.env = { ...originalEnv }

    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: {} },
      { resolve: "@acmekit/cloud-plugin", options: { cloud: true } },
    ])
  })

  it("should handle empty plugins array", function () {
    const config = defineConfig({
      plugins: [],
    })
    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: {} },
    ])
  })

  it("should handle undefined plugins", function () {
    const config = defineConfig({
      modules: {},
    })
    expect(config.plugins).toEqual([
      { resolve: "@acmekit/draft-order", options: {} },
    ])
  })

  it("should allow custom dynamodb config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
          sessionOptions: {
            dynamodbOptions: {
              clientOptions: {
                endpoint: "http://localhost:8000",
              },
              table: "acmekit-sessions",
              writeCapacityUnits: 25,
              readCapacityUnits: 25,
            },
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {
            "dynamodbOptions": {
              "clientOptions": {
                "endpoint": "http://localhost:8000",
              },
              "readCapacityUnits": 25,
              "table": "acmekit-sessions",
              "writeCapacityUnits": 25,
            },
          },
        },
      }
    `)
  })

  it("should add cloud options to the project config and relevant modules if the environment variables are set", function () {
    const originalEnv = { ...process.env }
    process.env.MEDUSA_BACKEND_URL = "test-backend-url"
    process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE = "test-environment"
    process.env.MEDUSA_CLOUD_API_KEY = "test-api-key"
    process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT = "test-emails-endpoint"
    process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT = "test-payments-endpoint"
    process.env.MEDUSA_CLOUD_WEBHOOK_SECRET = "test-webhook-secret"
    process.env.MEDUSA_CLOUD_OAUTH_AUTHORIZE_ENDPOINT =
      "test-oauth-authorize-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_TOKEN_ENDPOINT = "test-oauth-token-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_DISABLED = "true"
    const config = defineConfig()
    process.env = { ...originalEnv }

    expect(config).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "test-backend-url",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "callback_url": "test-backend-url/app/login?auth_provider=cloud",
                "disabled": true,
                "environment_handle": "test-environment",
                "oauth_authorize_endpoint": "test-oauth-authorize-endpoint",
                "oauth_token_endpoint": "test-oauth-token-endpoint",
                "sandbox_handle": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-emails-endpoint",
                "environment_handle": "test-environment",
                "sandbox_handle": undefined,
              },
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-payments-endpoint",
                "environment_handle": "test-environment",
                "sandbox_handle": undefined,
                "webhook_secret": "test-webhook-secret",
              },
            },
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "cloud": {
            "apiKey": "test-api-key",
            "emailsEndpoint": "test-emails-endpoint",
            "environmentHandle": "test-environment",
            "oauthAuthorizeEndpoint": "test-oauth-authorize-endpoint",
            "oauthCallbackUrl": undefined,
            "oauthDisabled": true,
            "oauthTokenEndpoint": "test-oauth-token-endpoint",
            "paymentsEndpoint": "test-payments-endpoint",
            "sandboxHandle": undefined,
            "webhookSecret": "test-webhook-secret",
          },
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should add cloud options to the project config and relevant modules if the environment variable is set for a sandbox", function () {
    const originalEnv = { ...process.env }
    process.env.MEDUSA_BACKEND_URL = "test-backend-url"
    process.env.MEDUSA_CLOUD_SANDBOX_HANDLE = "test-sandbox"
    process.env.MEDUSA_CLOUD_API_KEY = "test-api-key"
    process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT = "test-emails-endpoint"
    process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT = "test-payments-endpoint"
    process.env.MEDUSA_CLOUD_WEBHOOK_SECRET = "test-webhook-secret"
    process.env.MEDUSA_CLOUD_OAUTH_AUTHORIZE_ENDPOINT =
      "test-oauth-authorize-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_TOKEN_ENDPOINT = "test-oauth-token-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_DISABLED = "true"
    const config = defineConfig()
    process.env = { ...originalEnv }

    expect(config).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "test-backend-url",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "callback_url": "test-backend-url/app/login?auth_provider=cloud",
                "disabled": true,
                "environment_handle": undefined,
                "oauth_authorize_endpoint": "test-oauth-authorize-endpoint",
                "oauth_token_endpoint": "test-oauth-token-endpoint",
                "sandbox_handle": "test-sandbox",
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-emails-endpoint",
                "environment_handle": undefined,
                "sandbox_handle": "test-sandbox",
              },
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-payments-endpoint",
                "environment_handle": undefined,
                "sandbox_handle": "test-sandbox",
                "webhook_secret": "test-webhook-secret",
              },
            },
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "cloud": {
            "apiKey": "test-api-key",
            "emailsEndpoint": "test-emails-endpoint",
            "environmentHandle": undefined,
            "oauthAuthorizeEndpoint": "test-oauth-authorize-endpoint",
            "oauthCallbackUrl": undefined,
            "oauthDisabled": true,
            "oauthTokenEndpoint": "test-oauth-token-endpoint",
            "paymentsEndpoint": "test-payments-endpoint",
            "sandboxHandle": "test-sandbox",
            "webhookSecret": "test-webhook-secret",
          },
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom projectConfig.cloud", function () {
    const originalEnv = { ...process.env }
    process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE = "test-environment"
    process.env.MEDUSA_CLOUD_API_KEY = "test-api-key"
    process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT = "test-emails-endpoint"
    process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT = "test-payments-endpoint"
    process.env.MEDUSA_CLOUD_WEBHOOK_SECRET = "test-webhook-secret"
    const config = defineConfig({
      projectConfig: {
        http: {} as any,
        cloud: {
          environmentHandle: "overriden-environment",
          apiKey: "overriden-api-key",
          webhookSecret: "overriden-webhook-secret",
          emailsEndpoint: "overriden-emails-endpoint",
          paymentsEndpoint: "overriden-payments-endpoint",
          oauthAuthorizeEndpoint: "overriden-oauth-authorize-endpoint",
          oauthTokenEndpoint: "overriden-oauth-token-endpoint",
          oauthDisabled: true,
        },
      },
    })
    process.env = { ...originalEnv }

    expect(config).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@acmekit/acmekit/api-key",
          },
          "auth": {
            "options": {
              "cloud": {
                "api_key": "overriden-api-key",
                "callback_url": "//app/login?auth_provider=cloud",
                "disabled": true,
                "environment_handle": "overriden-environment",
                "oauth_authorize_endpoint": "overriden-oauth-authorize-endpoint",
                "oauth_token_endpoint": "overriden-oauth-token-endpoint",
                "sandbox_handle": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@acmekit/acmekit/auth-emailpass",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/auth",
          },
          "cache": {
            "resolve": "@acmekit/acmekit/cache-inmemory",
          },
          "cart": {
            "resolve": "@acmekit/acmekit/cart",
          },
          "currency": {
            "resolve": "@acmekit/acmekit/currency",
          },
          "customer": {
            "resolve": "@acmekit/acmekit/customer",
          },
          "event_bus": {
            "resolve": "@acmekit/acmekit/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@acmekit/acmekit/file-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@acmekit/acmekit/fulfillment-manual",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/fulfillment",
          },
          "inventory": {
            "resolve": "@acmekit/acmekit/inventory",
          },
          "locking": {
            "resolve": "@acmekit/acmekit/locking",
          },
          "notification": {
            "options": {
              "cloud": {
                "api_key": "overriden-api-key",
                "endpoint": "overriden-emails-endpoint",
                "environment_handle": "overriden-environment",
                "sandbox_handle": undefined,
              },
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@acmekit/acmekit/notification-local",
                },
              ],
            },
            "resolve": "@acmekit/acmekit/notification",
          },
          "order": {
            "resolve": "@acmekit/acmekit/order",
          },
          "payment": {
            "options": {
              "cloud": {
                "api_key": "overriden-api-key",
                "endpoint": "overriden-payments-endpoint",
                "environment_handle": "overriden-environment",
                "sandbox_handle": undefined,
                "webhook_secret": "overriden-webhook-secret",
              },
            },
            "resolve": "@acmekit/acmekit/payment",
          },
          "pricing": {
            "resolve": "@acmekit/acmekit/pricing",
          },
          "product": {
            "resolve": "@acmekit/acmekit/product",
          },
          "promotion": {
            "resolve": "@acmekit/acmekit/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@acmekit/acmekit/rbac",
          },
          "region": {
            "resolve": "@acmekit/acmekit/region",
          },
          "sales_channel": {
            "resolve": "@acmekit/acmekit/sales-channel",
          },
          "settings": {
            "resolve": "@acmekit/acmekit/settings",
          },
          "stock_location": {
            "resolve": "@acmekit/acmekit/stock-location",
          },
          "store": {
            "resolve": "@acmekit/acmekit/store",
          },
          "tax": {
            "resolve": "@acmekit/acmekit/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@acmekit/acmekit/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@acmekit/acmekit/user",
          },
          "workflows": {
            "resolve": "@acmekit/acmekit/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@acmekit/draft-order",
          },
        ],
        "projectConfig": {
          "cloud": {
            "apiKey": "overriden-api-key",
            "emailsEndpoint": "overriden-emails-endpoint",
            "environmentHandle": "overriden-environment",
            "oauthAuthorizeEndpoint": "overriden-oauth-authorize-endpoint",
            "oauthCallbackUrl": undefined,
            "oauthDisabled": true,
            "oauthTokenEndpoint": "overriden-oauth-token-endpoint",
            "paymentsEndpoint": "overriden-payments-endpoint",
            "sandboxHandle": undefined,
            "webhookSecret": "overriden-webhook-secret",
          },
          "databaseUrl": "postgres://localhost/acmekit-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })
})
