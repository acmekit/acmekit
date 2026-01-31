import { createPromotionsWorkflow } from "@acmekit/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchPromotion } from "./helpers"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetPromotionsParams>,
  res: AcmeKitResponse<HttpTypes.AdminPromotionListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "promotion",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: promotions, metadata } = await remoteQuery(queryObject)

  res.json({
    promotions,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreatePromotion & AdditionalData,
    HttpTypes.AdminGetPromotionParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPromotionResponse>
) => {
  const { additional_data, ...rest } = req.validatedBody
  const createPromotions = createPromotionsWorkflow(req.scope)
  const promotionsData = [rest] as any

  const { result } = await createPromotions.run({
    input: { promotionsData, additional_data },
  })

  const promotion = await refetchPromotion(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ promotion })
}
