import {
  deletePricePreferencesWorkflow,
  updatePricePreferencesWorkflow,
} from "@acmekit/core-flows"

import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
  refetchEntity,
} from "@acmekit/framework/http"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminPricePreferenceParams>,
  res: AcmeKitResponse<HttpTypes.AdminPricePreferenceResponse>
) => {
  const price_preference = await refetchEntity({
    entity: "price_preference",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ price_preference })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdatePricePreference,
    HttpTypes.AdminPricePreferenceParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminPricePreferenceResponse>
) => {
  const id = req.params.id
  const workflow = updatePricePreferencesWorkflow(req.scope)

  await workflow.run({
    input: { selector: { id: [id] }, update: req.body },
  })

  const price_preference = await refetchEntity({
    entity: "price_preference",
    idOrFilter: id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ price_preference })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminPricePreferenceDeleteResponse>
) => {
  const id = req.params.id
  const workflow = deletePricePreferencesWorkflow(req.scope)

  await workflow.run({
    input: [id],
  })

  res.status(200).json({
    id,
    object: "price_preference",
    deleted: true,
  })
}
