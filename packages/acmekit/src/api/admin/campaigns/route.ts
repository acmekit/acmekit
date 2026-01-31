import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { createCampaignsWorkflow } from "@acmekit/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import { refetchCampaign } from "./helpers"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetCampaignsParams>,
  res: AcmeKitResponse<HttpTypes.AdminCampaignListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "campaign",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: campaigns, metadata } = await remoteQuery(query)

  res.json({
    campaigns,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateCampaign & AdditionalData,
    HttpTypes.AdminGetCampaignParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminCampaignResponse>
) => {
  const { additional_data, ...rest } = req.validatedBody
  const createCampaigns = createCampaignsWorkflow(req.scope)
  const campaignsData = [rest]

  const { result } = await createCampaigns.run({
    input: { campaignsData, additional_data },
    context: {
      requestId: req.requestId,
    },
  })

  const campaign = await refetchCampaign(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ campaign })
}
