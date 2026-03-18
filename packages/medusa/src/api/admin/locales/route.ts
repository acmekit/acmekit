import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
} from "/framework/utils"
import { MedusaRequest, MedusaResponse } from "/framework/http"
import { HttpTypes } from "/framework/types"
import TranslationFeatureFlag from "../../../feature-flags/translation"

/**
 * @since 2.12.3
 * @featureFlag translation
 */
export const GET = async (
  req: MedusaRequest<HttpTypes.AdminLocaleListParams>,
  res: MedusaResponse<HttpTypes.AdminLocaleListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: locales, metadata } = await query.graph(
    {
      entity: "locale",
      filters: req.filterableFields,
      fields: req.queryConfig.fields,
      pagination: req.queryConfig.pagination,
    },
    {
      cache: { enable: true },
    }
  )

  res.json({
    locales,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled(TranslationFeatureFlag.key),
})
