import {
  deleteShippingProfileWorkflow,
  updateShippingProfilesWorkflow,
} from "@acmekit/core-flows"
import { HttpTypes, IFulfillmentModuleService } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchShippingProfile } from "../helpers"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminShippingProfileResponse>
) => {
  const shippingProfile = await refetchShippingProfile(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ shipping_profile: shippingProfile })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminShippingProfileDeleteResponse>
) => {
  const { id } = req.params

  const fulfillmentModuleService = req.scope.resolve<IFulfillmentModuleService>(
    Modules.FULFILLMENT
  )

  // Test if exists
  await fulfillmentModuleService.retrieveShippingProfile(id)

  await deleteShippingProfileWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "shipping_profile",
    deleted: true,
  })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateShippingProfile,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminShippingProfileResponse>
) => {
  const { id } = req.params

  await updateShippingProfilesWorkflow(req.scope).run({
    input: { selector: { id }, update: req.body },
  })

  const shippingProfile = await refetchShippingProfile(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    shipping_profile: shippingProfile,
  })
}
