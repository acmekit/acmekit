import { ConfigModule } from "@acmekit/framework/config"
import { ApiLoader } from "@acmekit/framework/http"
import { AcmeKitContainer, PluginDetails } from "@acmekit/framework/types"
import { FeatureFlag } from "@acmekit/framework/utils"
import { Express } from "express"
import { join } from "path"
import qs from "qs"

type Options = {
  app: Express
  plugins: PluginDetails[]
  container: AcmeKitContainer
}

export default async ({ app, container, plugins }: Options) => {
  // This is a workaround for the issue described here: https://github.com/expressjs/express/issues/3454
  // We parse the url and get the qs to be parsed and override the query prop from the request
  app.use(function (req, res, next) {
    const parsedUrl = req.url.split("?")
    parsedUrl.shift()
    const queryParamsStr = parsedUrl.join("?")
    if (queryParamsStr) {
      req.query = qs.parse(queryParamsStr, { arrayLimit: Infinity })
    }
    next()
  })

  // Store the initial router stack length before loading API resources for HMR
  if (FeatureFlag.isFeatureEnabled("backend_hmr")) {
    const initialStackLength = (app as any)._router?.stack?.length ?? 0
    ;(global as any).__MEDUSA_HMR_INITIAL_STACK_LENGTH__ = initialStackLength
  }

  const sourcePaths: string[] = []

  /**
   * Always load plugin routes before the AcmeKit core routes, since it
   * will allow the plugin to define routes with higher priority
   * than AcmeKit. Here are couple of examples.
   *
   * - Plugin registers a route called "/products/active"
   * - AcmeKit registers a route called "/products/:id"
   *
   * Now, if AcmeKit routes gets registered first, then the "/products/active"
   * route will never be resolved, because it will be handled by the
   * "/products/:id" route.
   */
  sourcePaths.push(
    join(__dirname, "../api"),
    ...plugins.map((pluginDetails) => {
      return join(pluginDetails.resolve, "api")
    })
  )

  const {
    projectConfig: {
      http: { restrictedFields },
    },
  } = container.resolve<ConfigModule>("configModule")

  // TODO: Figure out why this is causing issues with test when placed inside ./api.ts
  // Adding this here temporarily
  // Test: (packages/acmekit/src/api/routes/admin/currencies/update-currency.ts)
  try {
    await new ApiLoader({
      app: app,
      sourceDir: sourcePaths,
      baseRestrictedFields: restrictedFields?.store,
      container,
    }).load()
  } catch (err) {
    throw Error(
      `An error occurred while registering API Routes. Error: ${err.message}`
    )
  }

  return app
}
