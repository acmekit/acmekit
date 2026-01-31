import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import {
  deleteStockLocationsWorkflow,
  updateStockLocationsWorkflow,
} from "@acmekit/core-flows"
import { AcmeKitError } from "@acmekit/framework/utils"
import { refetchStockLocation } from "../helpers"
import {
  AdminGetStockLocationParamsType,
} from "../validators"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateStockLocation,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { id } = req.params
  await updateStockLocationsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const stockLocation = await refetchStockLocation(
    id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    stock_location: stockLocation,
  })
}

export const GET = async (
  req: AuthenticatedAcmeKitRequest<AdminGetStockLocationParamsType>,
  res: AcmeKitResponse<HttpTypes.AdminStockLocationResponse>
) => {
  const { id } = req.params

  const stockLocation = await refetchStockLocation(
    id,
    req.scope,
    req.queryConfig.fields
  )

  if (!stockLocation) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Stock location with id: ${id} was not found`
    )
  }

  res.status(200).json({ stock_location: stockLocation })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminStockLocationDeleteResponse>
) => {
  const { id } = req.params

  await deleteStockLocationsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "stock_location",
    deleted: true,
  })
}
