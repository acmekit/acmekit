import {
  deleteSalesChannelsWorkflow,
  updateSalesChannelsWorkflow,
} from "@acmekit/core-flows"
import { AcmeKitError } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchSalesChannel } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminSalesChannelResponse>
) => {
  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!salesChannel) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Sales channel with id: ${req.params.id} not found`
    )
  }

  res.json({ sales_channel: salesChannel })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateSalesChannel,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminSalesChannelResponse>
) => {
  const existingSalesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    ["id"]
  )

  if (!existingSalesChannel) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Sales channel with id "${req.params.id}" not found`
    )
  }

  await updateSalesChannelsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const salesChannel = await refetchSalesChannel(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ sales_channel: salesChannel })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminSalesChannelDeleteResponse>
) => {
  const id = req.params.id

  await deleteSalesChannelsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "sales-channel",
    deleted: true,
  })
}
