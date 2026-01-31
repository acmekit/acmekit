import {
  deleteRegionsWorkflow,
  updateRegionsWorkflow,
} from "@acmekit/core-flows"
import { AcmeKitError } from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchRegion } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminRegionResponse>
) => {
  const region = await refetchRegion(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!region) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Region with id: ${req.params.id} not found`
    )
  }

  res.status(200).json({ region })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateRegion,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminRegionResponse>
) => {
  const existingRegion = await refetchRegion(req.params.id, req.scope, ["id"])
  if (!existingRegion) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Region with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateRegionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const region = await refetchRegion(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ region })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminRegionDeleteResponse>
) => {
  const id = req.params.id

  await deleteRegionsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "region",
    deleted: true,
  })
}
