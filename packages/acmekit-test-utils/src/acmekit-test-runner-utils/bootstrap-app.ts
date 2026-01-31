import { logger } from "@acmekit/framework/logger"
import { AcmeKitContainer } from "@acmekit/framework/types"
import { GracefulShutdownServer, promiseAll } from "@acmekit/framework/utils"
import express from "express"
import getPort from "get-port"
import { resolve } from "path"
import { applyEnvVarsToProcess, execOrTimeout } from "./utils"

async function bootstrapApp({
  cwd,
  env = {},
}: { cwd?: string; env?: Record<any, any> } = {}) {
  const app = express()
  applyEnvVarsToProcess(env)

  // Register a health check endpoint
  app.get("/health", (_, res) => {
    res.status(200).send("OK")
  })

  const loaders = require("@acmekit/acmekit/loaders/index").default

  try {
    const { container, shutdown } = await loaders({
      directory: resolve(cwd || process.cwd()),
      expressApp: app,
    })

    const PORT = process.env.PORT ? parseInt(process.env.PORT) : await getPort()

    return {
      shutdown,
      container,
      app,
      port: PORT,
    }
  } catch (error) {
    logger.error("Error bootstrapping app:", error)
    throw error
  }
}

export async function startApp({
  cwd,
  env = {},
}: { cwd?: string; env?: Record<any, any> } = {}): Promise<{
  shutdown: () => Promise<void>
  container: AcmeKitContainer
  port: number
}> {
  let expressServer: any
  let acmekitShutdown: () => Promise<void> = async () => void 0
  let container: AcmeKitContainer

  try {
    const {
      app,
      port,
      container: appContainer,
      shutdown: appShutdown,
    } = await bootstrapApp({
      cwd,
      env,
    })

    container = appContainer
    acmekitShutdown = appShutdown

    const shutdown = async () => {
      try {
        const shutdownPromise = promiseAll([
          expressServer?.shutdown(),
          acmekitShutdown(),
        ])

        await execOrTimeout(shutdownPromise)

        if (typeof global !== "undefined" && global?.gc) {
          global.gc()
        }
      } catch (error) {
        logger.error("Error during shutdown:", error)
        try {
          await expressServer?.shutdown()
          await acmekitShutdown()
        } catch (cleanupError) {
          logger.error("Error during forced cleanup:", cleanupError)
        }
        throw error
      }
    }

    return await new Promise((resolve, reject) => {
      const server = app
        .listen(port)
        .on("error", async (err) => {
          logger.error("Error starting server:", err)
          await shutdown()
          return reject(err)
        })
        .on("listening", () => {
          process.send?.(port)

          resolve({
            shutdown,
            container,
            port,
          })
        })

      expressServer = GracefulShutdownServer.create(server)
    })
  } catch (error) {
    logger.error("Error in startApp:", error)
    if (expressServer) {
      try {
        await expressServer.shutdown()
      } catch (cleanupError) {
        logger.error("Error cleaning up express server:", cleanupError)
      }
    }
    if (acmekitShutdown) {
      try {
        await acmekitShutdown()
      } catch (cleanupError) {
        logger.error("Error cleaning up acmekit:", cleanupError)
      }
    }
    throw error
  }
}
