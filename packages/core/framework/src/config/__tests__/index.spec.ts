import { configLoader } from "../loader"
import { join } from "path"
import { container } from "../../container"
import { ContainerRegistrationKeys } from "@acmekit/utils"

describe("configLoader", () => {
  const entryDirectory = join(__dirname, "../__fixtures__")

  it("should load the config properly", async () => {
    let configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    expect(configModule).toBeUndefined()

    await configLoader(entryDirectory, "acmekit-config")

    configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBeUndefined()

    await configLoader(entryDirectory, "acmekit-config-2")

    configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBe("foo")
    expect(configModule.projectConfig.workerMode).toBe("shared")

    process.env.MEDUSA_WORKER_MODE = "worker"

    await configLoader(entryDirectory, "acmekit-config-2")

    configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBe("foo")
    expect(configModule.projectConfig.workerMode).toBe("worker")
  })

  it("should load config without throwing errors when throwOnError is false", async () => {
    await configLoader(entryDirectory, "acmekit-config", {
      throwOnError: false,
    })

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig).toBeDefined()
  })

  it("should pass throwOnError option through to buildHttpConfig", async () => {
    // When throwOnError is false, missing jwtSecret and cookieSecret should not cause errors
    await configLoader(entryDirectory, "acmekit-config-2", {
      throwOnError: false,
    })

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBe("foo")
    // http config should still be built with defaults even without throwing errors
    expect(configModule.projectConfig.http).toBeDefined()
    expect(configModule.projectConfig.http.jwtSecret).toBe("supersecret")
    expect(configModule.projectConfig.http.cookieSecret).toBe("supersecret")
  })
})
