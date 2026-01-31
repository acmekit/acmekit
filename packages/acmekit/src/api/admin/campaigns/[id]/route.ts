import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  deleteCampaignsWorkflow,
  updateCampaignsWorkflow,
} from "@acmekit/core-flows"

import { refetchCampaign } from "../helpers"
import { AcmeKitError } from "@acmekit/framework/utils"
import { AdditionalData, HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminGetCampaignParams>,
  res: AcmeKitResponse<HttpTypes.AdminCampaignResponse>
) => {
  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!campaign) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Campaign with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ campaign })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateCampaign & AdditionalData,
    HttpTypes.AdminGetCampaignParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminCampaignResponse>
) => {
  const existingCampaign = await refetchCampaign(req.params.id, req.scope, [
    "id",
  ])
  if (!existingCampaign) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Campaign with id "${req.params.id}" not found`
    )
  }

  const { additional_data, ...rest } = req.validatedBody
  const updateCampaigns = updateCampaignsWorkflow(req.scope)
  const campaignsData = [
    {
      id: req.params.id,
      ...rest,
    },
  ]

  await updateCampaigns.run({
    input: { campaignsData, additional_data },
  })

  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ campaign })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminCampaignDeleteResponse>
) => {
  const id = req.params.id
  const deleteCampaigns = deleteCampaignsWorkflow(req.scope)

  await deleteCampaigns.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "campaign",
    deleted: true,
  })
}
