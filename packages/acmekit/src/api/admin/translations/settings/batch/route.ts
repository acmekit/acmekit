import { batchTranslationSettingsWorkflow } from "@acmekit/core-flows"
import { AuthenticatedAcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { defineFileConfig, FeatureFlag } from "@acmekit/framework/utils"
import { HttpTypes } from "@acmekit/types"
import TranslationFeatureFlag from "../../../../../feature-flags/translation"

/**
 * @since 2.13.0
 * @featureFlag translation
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminBatchTranslationSettings>,
  res: AcmeKitResponse<HttpTypes.AdminBatchTranslationSettingsResponse>
) => {
  const { create = [], update = [], delete: deleteIds = [] } = req.validatedBody

  const { result } = await batchTranslationSettingsWorkflow(req.scope).run({
    input: {
      create,
      update,
      delete: deleteIds,
    },
  })

  return res.status(200).json({
    created: result.created,
    updated: result.updated,
    deleted: {
      ids: deleteIds,
      object: "translation_settings",
      deleted: true,
    },
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})
