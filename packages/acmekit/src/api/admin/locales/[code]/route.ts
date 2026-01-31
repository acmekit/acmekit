import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  AcmeKitError,
} from "@acmekit/framework/utils"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import TranslationFeatureFlag from "../../../../feature-flags/translation"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: AcmeKitRequest<HttpTypes.AdminLocaleParams>,
  res: AcmeKitResponse<HttpTypes.AdminLocaleResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [locale],
  } = await query.graph(
    {
      entity: "locale",
      filters: {
        code: req.params.code,
      },
      fields: req.queryConfig.fields,
    },
    {
      cache: { enable: true },
    }
  )

  if (!locale) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Locale with code: ${req.params.code} was not found`
    )
  }

  res.status(200).json({ locale })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})
