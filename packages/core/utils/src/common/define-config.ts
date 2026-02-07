import {
  AdminOptions,
  ConfigModule,
  InputConfig,
  InputConfigModules,
  InputConfigWithArrayModules,
  InputConfigWithObjectModules,
  InternalModuleDeclaration,
  AcmeKitCloudOptions,
} from "@acmekit/types"
import { FeatureFlag } from "../feature-flags/flag-router"
import {
  MODULE_PACKAGE_NAMES,
  Modules,
  REVERSED_MODULE_PACKAGE_NAMES,
  TEMPORARY_REDIS_MODULE_PACKAGE_NAMES,
} from "../modules-sdk"
import { isObject } from "./is-object"
import { isString } from "./is-string"
import { normalizeImportPathWithSource } from "./normalize-import-path-with-source"
import { resolveExports } from "./resolve-exports"
import { tryConvertToNumber } from "./try-convert-to-number"

const MEDUSA_CLOUD_EXECUTION_CONTEXT = "acmekit-cloud"
const DEFAULT_SECRET = "supersecret"
const DEFAULT_ADMIN_URL = "/"
const DEFAULT_CLIENT_CORS = "http://localhost:8000"
const DEFAULT_DATABASE_URL = "postgres://localhost/acmekit-starter-default"
const DEFAULT_ADMIN_CORS =
  "http://localhost:7000,http://localhost:7001,http://localhost:5173"


/**
 * The "defineConfig" helper can be used to define the configuration
 * of a acmekit application.
 *
 * The helper under the hood merges your config with a set of defaults to
 * make an application work seamlessly, but still provide you the ability
 * to override configuration as needed.
 */
export function defineConfig(config?: InputConfigWithArrayModules): ConfigModule
/**
 * @deprecated Use array-based modules configuration instead
 */
export function defineConfig(
  config?: InputConfigWithObjectModules
): ConfigModule
export function defineConfig(config: InputConfig = {}): ConfigModule {
  const options = {
    isCloud: process.env.EXECUTION_CONTEXT === MEDUSA_CLOUD_EXECUTION_CONTEXT,
  }

  const projectConfig = normalizeProjectConfig(config.projectConfig, options)
  const adminConfig = normalizeAdminConfig(config.admin)
  const modules = resolveModules(config.modules, options, config.projectConfig)
  applyCloudOptionsToModules(modules, projectConfig?.cloud, adminConfig)
  const plugins = resolvePlugins(config.plugins, options)

  return {
    projectConfig,
    featureFlags: (config.featureFlags ?? {}) as ConfigModule["featureFlags"],
    admin: adminConfig,
    modules: modules,
    logger: config.logger,
    plugins,
  }
}

/**
 * Transforms an array of modules into an object. The last module will
 * take precedence in case of duplicate modules
 */
export function transformModules(
  modules: InputConfigModules
): Exclude<ConfigModule["modules"], undefined> {
  const remappedModules = modules.reduce((acc, moduleConfig) => {
    if (moduleConfig.scope === "external" && !moduleConfig.key) {
      throw new Error(
        "External modules configuration must have a 'key'. Please provide a key for the module."
      )
    }

    if ("disable" in moduleConfig && "key" in moduleConfig) {
      acc[moduleConfig.key!] = moduleConfig
    }

    // TODO: handle external modules later
    let serviceName: string =
      "key" in moduleConfig && moduleConfig.key ? moduleConfig.key : ""
    delete moduleConfig.key

    if (!serviceName && "resolve" in moduleConfig) {
      if (
        isString(moduleConfig.resolve!) &&
        REVERSED_MODULE_PACKAGE_NAMES[moduleConfig.resolve!]
      ) {
        serviceName = REVERSED_MODULE_PACKAGE_NAMES[moduleConfig.resolve!]
        acc[serviceName] = moduleConfig
        return acc
      }

      let resolution = isString(moduleConfig.resolve!)
        ? normalizeImportPathWithSource(moduleConfig.resolve as string)
        : moduleConfig.resolve

      const moduleExport = isString(resolution)
        ? require(resolution)
        : resolution

      const defaultExport = resolveExports(moduleExport).default

      const joinerConfig =
        typeof defaultExport.service.prototype.__joinerConfig === "function"
          ? defaultExport.service.prototype.__joinerConfig() ?? {}
          : defaultExport.service.prototype.__joinerConfig ?? {}

      serviceName = joinerConfig.serviceName

      if (!serviceName) {
        throw new Error(
          `Module ${moduleConfig.resolve} doesn't have a serviceName. Please provide a 'key' for the module or check the service joiner config.`
        )
      }
    }

    acc[serviceName] = moduleConfig

    return acc
  }, {})

  return remappedModules as Exclude<ConfigModule["modules"], undefined>
}

function resolvePlugins(
  configPlugins: InputConfig["plugins"],
  { isCloud }: { isCloud: boolean }
): ConfigModule["plugins"] {
  const defaultPlugins: Map<string, ConfigModule["plugins"][number]> = new Map(
    []
  )

  if (configPlugins?.length) {
    configPlugins.forEach((plugin) => {
      if (typeof plugin === "string") {
        defaultPlugins.set(plugin, { resolve: plugin, options: {} })
      } else {
        defaultPlugins.set(plugin.resolve, plugin)
      }
    })
  }

  // We don't have any cloud plugins yet, but we might in the future
  const cloudPlugins = [...Array.from(defaultPlugins.values())]

  return isCloud ? cloudPlugins : Array.from(defaultPlugins.values())
}

/**
 * The user API allow to use array of modules configuration. This method manage the loading of the
 * user modules along side the default modules and re map them to an object.
 *
 * @param configModules
 */
function resolveModules(
  configModules: InputConfig["modules"],
  { isCloud }: { isCloud: boolean },
  projectConfig: InputConfig["projectConfig"]
): Exclude<ConfigModule["modules"], undefined> {
  const sharedModules = [
    { resolve: MODULE_PACKAGE_NAMES[Modules.API_KEY] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.SETTINGS] },

    {
      resolve: MODULE_PACKAGE_NAMES[Modules.TRANSLATION],
      disable: !FeatureFlag.isFeatureEnabled("translation"),
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.RBAC],
      disable: !FeatureFlag.isFeatureEnabled("rbac"),
    },

    {
      resolve: MODULE_PACKAGE_NAMES[Modules.AUTH],
      options: {
        providers: [
          {
            resolve: "@acmekit/acmekit/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.USER],
      options: {
        jwt_secret: projectConfig?.http?.jwtSecret ?? DEFAULT_SECRET,
        jwt_options: projectConfig?.http?.jwtOptions,
        jwt_verify_options: projectConfig?.http?.jwtVerifyOptions,
        jwt_public_key: projectConfig?.http?.jwtPublicKey,
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.NOTIFICATION],
      options: {
        providers: [
          {
            resolve: "@acmekit/acmekit/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["feed"],
            },
          },
        ],
      },
    },
  ]

  const defaultModules = [
    ...sharedModules,
    { resolve: MODULE_PACKAGE_NAMES[Modules.CACHE] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.EVENT_BUS] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE] },
    { resolve: MODULE_PACKAGE_NAMES[Modules.LOCKING] },

    {
      resolve: MODULE_PACKAGE_NAMES[Modules.FILE],
      options: {
        providers: [
          {
            resolve: "@acmekit/acmekit/file-local",
            id: "local",
          },
        ],
      },
    },
  ]

  const cloudModules = [
    ...sharedModules,
    {
      resolve: TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE],
      options: {
        redis: { url: process.env.REDIS_URL },
      },
    },
    {
      resolve: TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.CACHE],
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.EVENT_BUS],
      options: {
        redisUrl: process.env.REDIS_URL,
        workerOptions: { concurrency: 1 },
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.LOCKING],
      options: {
        providers: [
          {
            id: "locking-redis",
            resolve: TEMPORARY_REDIS_MODULE_PACKAGE_NAMES[Modules.LOCKING],
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: MODULE_PACKAGE_NAMES[Modules.FILE],
      options: {
        providers: [
          {
            id: "s3",
            resolve: "@acmekit/acmekit/file-s3",
            options: {
              authentication_method: "s3-iam-role",
              file_url: process.env.S3_FILE_URL,
              prefix: process.env.S3_PREFIX,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ]

  if (process.env.CACHE_REDIS_URL) {
    cloudModules.push({
      resolve: MODULE_PACKAGE_NAMES[Modules.CACHING],
      options: {
        providers: [
          {
            id: "caching-redis",
            resolve: "@acmekit/acmekit/caching-redis",
            is_default: true,
            options: {
              redisUrl: process.env.CACHE_REDIS_URL,
            },
          },
        ],
      },
    })
  }

  /**
   * The default set of modules to always use. The end user can swap
   * the modules by providing an alternate implementation via their
   * config. But they can never remove a module from this list.
   */
  const modules: InputConfig["modules"] = isCloud
    ? cloudModules
    : defaultModules

  /**
   * Backward compatibility for the old way of defining modules (object vs array)
   */
  if (configModules) {
    if (isObject(configModules)) {
      const modules_ = (configModules ??
        {}) as unknown as Required<ConfigModule>["modules"]

      Object.entries(modules_).forEach(([key, moduleConfig]) => {
        modules.push({
          key,
          ...(isObject(moduleConfig)
            ? moduleConfig
            : { disable: !moduleConfig }),
        } as InputConfigModules[number])
      })
    } else if (Array.isArray(configModules)) {
      const modules_ = (configModules ?? []) as InternalModuleDeclaration[]
      modules.push(...(modules_ as InputConfigModules))
    } else {
      throw new Error(
        "Invalid modules configuration. Should be an array or object."
      )
    }
  }

  return transformModules(modules)
}

function normalizeProjectConfig(
  projectConfig: InputConfig["projectConfig"],
  { isCloud }: { isCloud: boolean }
): ConfigModule["projectConfig"] {
  const { http, redisOptions, sessionOptions, cloud, ...restOfProjectConfig } =
    projectConfig || {}

  const mergedCloudOptions: AcmeKitCloudOptions = {
    environmentHandle: process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE,
    sandboxHandle: process.env.MEDUSA_CLOUD_SANDBOX_HANDLE,
    apiKey: process.env.MEDUSA_CLOUD_API_KEY,
    webhookSecret: process.env.MEDUSA_CLOUD_WEBHOOK_SECRET,
    emailsEndpoint: process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT,
    paymentsEndpoint: process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT,
    oauthAuthorizeEndpoint: process.env.MEDUSA_CLOUD_OAUTH_AUTHORIZE_ENDPOINT,
    oauthTokenEndpoint: process.env.MEDUSA_CLOUD_OAUTH_TOKEN_ENDPOINT,
    oauthCallbackUrl: process.env.MEDUSA_CLOUD_OAUTH_CALLBACK_URL,
    oauthDisabled:
      process.env.MEDUSA_CLOUD_OAUTH_DISABLED === "true" ? true : undefined,
    ...cloud,
  }
  const hasCloudOptions = Object.values(mergedCloudOptions).some(
    (value) => value !== undefined
  )

  /**
   * The defaults to use for the project config. They are shallow merged
   * with the user defined config.
   */
  const config = {
    ...(isCloud ? { redisUrl: process.env.REDIS_URL } : {}),
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    http: {
      clientCors: process.env.CLIENT_CORS || DEFAULT_CLIENT_CORS,
      adminCors: process.env.ADMIN_CORS || DEFAULT_ADMIN_CORS,
      authCors: process.env.AUTH_CORS || DEFAULT_ADMIN_CORS,
      jwtSecret: process.env.JWT_SECRET || DEFAULT_SECRET,
      jwtPublicKey: process.env.JWT_PUBLIC_KEY,
      cookieSecret: process.env.COOKIE_SECRET || DEFAULT_SECRET,
      restrictedFields: {},
      ...http,
    },
    redisOptions: {
      retryStrategy(retries) {
        /**
         * Exponentially increase delay with every retry
         * attempt. Max to 4s
         */
        const delay = Math.min(Math.pow(2, retries) * 50, 4000)

        /**
         * Add a random jitter to not choke the server when multiple
         * clients are retrying at the same time
         */
        const jitter = Math.floor(Math.random() * 200)
        return delay + jitter
      },
      ...redisOptions,
    },
    sessionOptions: {
      ...(isCloud && process.env.SESSION_STORE === "dynamodb"
        ? {
            dynamodbOptions: {
              prefix: process.env.DYNAMO_DB_SESSIONS_PREFIX ?? "sess:",
              hashKey: process.env.DYNAMO_DB_SESSIONS_HASH_KEY ?? "id",
              initialized: process.env.DYNAMO_DB_SESSIONS_CREATE_TABLE
                ? false
                : true,
              table: process.env.DYNAMO_DB_SESSIONS_TABLE ?? "acmekit-sessions",
              readCapacityUnits: tryConvertToNumber(
                process.env.DYNAMO_DB_SESSIONS_READ_UNITS,
                5
              ),
              writeCapacityUnits: tryConvertToNumber(
                process.env.DYNAMO_DB_SESSIONS_WRITE_UNITS,
                5
              ),
              skipThrowMissingSpecialKeys: true,
            },
          }
        : {}),
      ...sessionOptions,
    },
    // If there are no cloud options, we better don't pollute the project config for people not using the cloud
    ...(hasCloudOptions ? { cloud: mergedCloudOptions } : {}),
    ...restOfProjectConfig,
  } satisfies ConfigModule["projectConfig"]

  if (
    isCloud &&
    !mergedCloudOptions.oauthDisabled &&
    mergedCloudOptions.oauthAuthorizeEndpoint &&
    mergedCloudOptions.oauthTokenEndpoint
  ) {
    const userAuthMethods = config.http.authMethodsPerActor?.user ?? [
      "emailpass",
    ]
    config.http.authMethodsPerActor = {
      ...config.http.authMethodsPerActor,
      user: userAuthMethods.concat("cloud"),
    }
  }

  return config
}

function normalizeAdminConfig(
  adminConfig: InputConfig["admin"]
): ConfigModule["admin"] {
  /**
   * The defaults to use for the admin config.  They are shallow merged
   * with the user defined config
   */
  return {
    backendUrl: process.env.MEDUSA_BACKEND_URL || DEFAULT_ADMIN_URL,
    path: "/app",
    ...adminConfig,
  }
}

function applyCloudOptionsToModules(
  modules: Exclude<ConfigModule["modules"], undefined>,
  config?: AcmeKitCloudOptions,
  adminConfig?: AdminOptions
) {
  if (!config) {
    return
  }

  for (const name in modules) {
    const module = modules[name]
    if (typeof module !== "object") {
      continue
    }

    switch (name) {
      case Modules.NOTIFICATION:
        module.options = {
          cloud: {
            api_key: config.apiKey,
            endpoint: config.emailsEndpoint,
            environment_handle: config.environmentHandle,
            sandbox_handle: config.sandboxHandle,
          },
          ...(module.options ?? {}),
        }
        break
      case Modules.AUTH:
        let callbackUrl = config.oauthCallbackUrl
        if (!callbackUrl && adminConfig?.backendUrl) {
          callbackUrl = `${adminConfig?.backendUrl}${adminConfig?.path}/login?auth_provider=cloud`
        }
        module.options = {
          cloud: {
            oauth_authorize_endpoint: config.oauthAuthorizeEndpoint,
            oauth_token_endpoint: config.oauthTokenEndpoint,
            environment_handle: config.environmentHandle,
            sandbox_handle: config.sandboxHandle,
            api_key: config.apiKey,
            callback_url: callbackUrl,
            disabled: config.oauthDisabled,
          },
          ...(module.options ?? {}),
        }
        break
      default:
        break
    }
  }
}
