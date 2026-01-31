import { asValue } from "@acmekit/framework/awilix"
import { logger } from "@acmekit/framework/logger"
import { Migrator } from "@acmekit/framework/migrations"
import { AcmeKitAppOutput } from "@acmekit/framework/modules-sdk"
import { AcmeKitContainer } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  createAcmeKitContainer,
  getResolvedPlugins,
  mergePluginModules,
} from "@acmekit/framework/utils"
import { dbTestUtilFactory, getDatabaseURL } from "./database"
import {
  applyEnvVarsToProcess,
  clearInstances,
  configLoaderOverride,
  initDb,
  migrateDatabase,
  startApp,
  syncLinks,
} from "./acmekit-test-runner-utils"
import { waitWorkflowExecutions } from "./acmekit-test-runner-utils/wait-workflow-executions"
import { ulid } from "ulid"
import { createDefaultsWorkflow } from "@acmekit/core-flows"

export interface AcmeKitSuiteOptions {
  dbConnection: any // knex instance
  getContainer: () => AcmeKitContainer
  api: any
  dbUtils: {
    create: (dbName: string) => Promise<void>
    teardown: (options: { schema?: string }) => Promise<void>
    shutdown: (dbName: string) => Promise<void>
  }
  dbConfig: {
    dbName: string
    schema: string
    clientUrl: string
  }
  getAcmeKitApp: () => AcmeKitAppOutput
  utils: {
    waitWorkflowExecutions: () => Promise<void>
  }
}

interface TestRunnerConfig {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  acmekitConfigFile?: string
  disableAutoTeardown?: boolean
  schema?: string
  debug?: boolean
  inApp?: boolean
  hooks?: {
    beforeServerStart?: (container: AcmeKitContainer) => Promise<void>
  }
  cwd?: string
}

class AcmeKitTestRunner {
  private dbName: string
  private schema: string
  private modulesConfigPath: string
  private disableAutoTeardown: boolean
  private cwd: string
  private env: Record<string, any>
  private debug: boolean
  // @ts-ignore
  private inApp: boolean

  private dbUtils: ReturnType<typeof dbTestUtilFactory>
  private dbConfig: {
    dbName: string
    clientUrl: string
    schema: string
    debug: boolean
  }

  private globalContainer: AcmeKitContainer | null = null
  private apiUtils: any = null
  private loadedApplication: any = null
  private shutdown: () => Promise<void> = async () => void 0
  private isFirstTime = true
  private hooks: TestRunnerConfig["hooks"] = {}

  constructor(config: TestRunnerConfig) {
    const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
    const moduleName = config.moduleName ?? ulid()
    this.dbName =
      config.dbName ??
      `acmekit-${moduleName.toLowerCase()}-integration-${tempName}`
    this.schema = config.schema ?? "public"
    this.cwd = config.cwd ?? config.acmekitConfigFile ?? process.cwd()
    this.modulesConfigPath = config.acmekitConfigFile ?? this.cwd
    this.env = config.env ?? {}
    this.debug = config.debug ?? false
    this.inApp = config.inApp ?? false
    this.disableAutoTeardown = config?.disableAutoTeardown ?? false

    this.dbUtils = dbTestUtilFactory()
    this.dbConfig = {
      dbName: this.dbName,
      clientUrl: getDatabaseURL(this.dbName),
      schema: this.schema,
      debug: this.debug,
    }
    this.hooks = config.hooks ?? {}

    this.setupProcessHandlers()
  }

  private setupProcessHandlers(): void {
    process.on("SIGTERM", async () => {
      await this.cleanup()
      process.exit(0)
    })

    process.on("SIGINT", async () => {
      await this.cleanup()
      process.exit(0)
    })
  }

  private createApiProxy(): any {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return this.apiUtils?.[prop]
        },
      }
    )
  }

  private createDbConnectionProxy(): any {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return this.dbUtils.pgConnection_?.[prop]
        },
      }
    )
  }

  private async initializeDatabase(): Promise<void> {
    try {
      logger.info(`Creating database ${this.dbName}`)
      await this.dbUtils.create(this.dbName)
      this.dbUtils.pgConnection_ = await initDb()
    } catch (error) {
      logger.error(`Error initializing database: ${error?.message}`)
      await this.cleanup()
      throw error
    }
  }

  private async setupApplication(): Promise<void> {
    const { container, AcmeKitAppLoader } = await import("@acmekit/framework")
    const appLoader = new AcmeKitAppLoader({
      acmekitConfigPath: this.modulesConfigPath,
      cwd: this.cwd,
    })

    // Load plugins modules
    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )
    const plugins = await getResolvedPlugins(this.cwd, configModule)
    mergePluginModules(configModule, plugins)

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
    })

    if (this.hooks?.beforeServerStart) {
      await this.hooks.beforeServerStart(container)
    }

    await this.initializeDatabase()

    const migrator = new Migrator({ container })
    await migrator.ensureMigrationsTable()

    logger.info(
      `Migrating database with core migrations and links ${this.dbName}`
    )
    await migrateDatabase(appLoader)
    await syncLinks(appLoader, this.modulesConfigPath, container, logger)
    await clearInstances()

    this.loadedApplication = await appLoader.load()

    try {
      const {
        shutdown,
        container: appContainer,
        port,
      } = await startApp({
        cwd: this.modulesConfigPath,
        env: this.env,
      })

      this.globalContainer = appContainer
      this.shutdown = async () => {
        await shutdown()
        if (this.apiUtils?.cancelToken?.source) {
          this.apiUtils.cancelToken.source.cancel(
            "Request canceled by shutdown"
          )
        }
      }

      const { default: axios } = (await import("axios")) as any
      const cancelTokenSource = axios.CancelToken.source()

      this.apiUtils = axios.create({
        baseURL: `http://localhost:${port}`,
        cancelToken: cancelTokenSource.token,
      })

      this.apiUtils.cancelToken = { source: cancelTokenSource }
    } catch (error) {
      logger.error(`Error starting the app: ${error?.message}`)
      await this.cleanup()
      throw error
    }
  }

  public async cleanup(): Promise<void> {
    try {
      process.removeAllListeners("SIGTERM")
      process.removeAllListeners("SIGINT")

      await this.dbUtils.shutdown(this.dbName)
      await this.shutdown()
      await clearInstances()

      if (this.apiUtils?.cancelToken?.source) {
        this.apiUtils.cancelToken.source.cancel("Cleanup")
      }

      if (this.globalContainer?.dispose) {
        await this.globalContainer.dispose()
      }

      this.apiUtils = null
      this.loadedApplication = null
      this.globalContainer = null

      if (global.gc) {
        global.gc()
      }
    } catch (error) {
      logger.error("Error during cleanup:", error?.message)
    }
  }

  public async beforeAll(): Promise<void> {
    try {
      this.setupProcessHandlers()
      await configLoaderOverride(this.cwd, this.dbConfig)
      applyEnvVarsToProcess(this.env)
      await this.setupApplication()
    } catch (error) {
      await this.cleanup()
      throw error
    }
  }

  public async beforeEach(): Promise<void> {
    if (this.isFirstTime) {
      this.isFirstTime = false
      return
    }

    await this.afterEach()

    const container = this.globalContainer as AcmeKitContainer
    const copiedContainer = createAcmeKitContainer({}, container)

    try {
      const { AcmeKitAppLoader } = await import("@acmekit/framework")
      const acmekitAppLoader = new AcmeKitAppLoader({
        container: copiedContainer,
        acmekitConfigPath: this.modulesConfigPath,
        cwd: this.cwd,
      })
      await acmekitAppLoader.runModulesLoader()

      await createDefaultsWorkflow(copiedContainer).run()
    } catch (error) {
      await copiedContainer.dispose?.()
      logger.error("Error running modules loaders:", error?.message)
      throw error
    }
  }

  public async afterEach(): Promise<void> {
    try {
      await waitWorkflowExecutions(this.globalContainer as AcmeKitContainer)

      if (!this.disableAutoTeardown) {
        // Perform automatic teardown
        await this.dbUtils.teardown({ schema: this.schema })
      }
    } catch (error) {
      logger.error("Error tearing down database:", error?.message)
      throw error
    }
  }

  public getOptions(): AcmeKitSuiteOptions {
    return {
      api: this.createApiProxy(),
      dbConnection: this.createDbConnectionProxy(),
      getAcmeKitApp: () => this.loadedApplication,
      getContainer: () => this.globalContainer as AcmeKitContainer,
      dbConfig: {
        dbName: this.dbName,
        schema: this.schema,
        clientUrl: this.dbConfig.clientUrl,
      },
      dbUtils: this.dbUtils,
      utils: {
        waitWorkflowExecutions: () =>
          waitWorkflowExecutions(this.globalContainer as AcmeKitContainer),
      },
    }
  }
}

export function acmekitIntegrationTestRunner({
  moduleName,
  dbName,
  acmekitConfigFile,
  schema = "public",
  env = {},
  debug = false,
  inApp = false,
  testSuite,
  hooks,
  cwd,
  disableAutoTeardown,
}: {
  moduleName?: string
  env?: Record<string, any>
  dbName?: string
  acmekitConfigFile?: string
  schema?: string
  debug?: boolean
  inApp?: boolean
  testSuite: (options: AcmeKitSuiteOptions) => void
  hooks?: TestRunnerConfig["hooks"]
  cwd?: string
  disableAutoTeardown?: boolean
}) {
  const runner = new AcmeKitTestRunner({
    moduleName,
    dbName,
    acmekitConfigFile,
    schema,
    env,
    debug,
    inApp,
    hooks,
    cwd,
    disableAutoTeardown,
  })

  return describe("", () => {
    let testOptions: AcmeKitSuiteOptions

    beforeAll(async () => {
      await runner.beforeAll()
      testOptions = runner.getOptions()
    })

    beforeEach(async () => {
      await runner.beforeEach()
    })

    afterEach(async () => {
      await runner.afterEach()
    })

    afterAll(async () => {
      // Run main cleanup
      await runner.cleanup()

      // Clean references to the test options
      for (const key in testOptions) {
        if (typeof testOptions[key] === "function") {
          testOptions[key] = null
        } else if (
          typeof testOptions[key] === "object" &&
          testOptions[key] !== null
        ) {
          Object.keys(testOptions[key]).forEach((k) => {
            testOptions[key][k] = null
          })
          testOptions[key] = null
        }
      }

      // Encourage garbage collection
      // @ts-ignore
      testOptions = null

      if (global.gc) {
        global.gc()
      }
    })

    // Run test suite with options
    testSuite(runner.getOptions())
  })
}
