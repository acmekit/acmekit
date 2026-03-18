import compression from "compression"
import type { ConfigModule } from "@acmekit/types"
import { ContainerRegistrationKeys } from "@acmekit/utils"

import { HttpCompressionOptions, ProjectConfigOptions } from "../../config"
import type { AcmeKitRequest, AcmeKitResponse } from "../types"

export function shouldCompressResponse(
  req: AcmeKitRequest,
  res: AcmeKitResponse
) {
  const { projectConfig } = req.scope.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE
  )
  const { enabled } = compressionOptions(projectConfig)

  if (!enabled) {
    return false
  }

  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req as any, res as any)
}

export function compressionOptions(
  config: ProjectConfigOptions
): HttpCompressionOptions {
  const responseCompressionOptions = config.http.compression ?? {}

  responseCompressionOptions.enabled =
    responseCompressionOptions.enabled ?? false
  responseCompressionOptions.level = responseCompressionOptions.level ?? 6
  responseCompressionOptions.memLevel = responseCompressionOptions.memLevel ?? 8
  responseCompressionOptions.threshold =
    responseCompressionOptions.threshold ?? 1024

  return responseCompressionOptions
}
