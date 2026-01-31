import {
  deleteTaxRatesWorkflow,
  updateTaxRatesWorkflow,
} from "@acmekit/core-flows"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchTaxRate } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateTaxRate,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminTaxRateResponse>
) => {
  const existingTaxRate = await refetchTaxRate(req.params.id, req.scope, ["id"])

  if (!existingTaxRate) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Tax rate with id "${req.params.id}" not found`
    )
  }

  await updateTaxRatesWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: { ...req.validatedBody, updated_by: req.auth_context.actor_id },
    },
  })

  const taxRate = await refetchTaxRate(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ tax_rate: taxRate })
}

export const GET = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminTaxRateResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "tax_rate",
    variables,
    fields: req.queryConfig.fields,
  })

  const [taxRate] = await remoteQuery(queryObject)
  res.status(200).json({ tax_rate: taxRate })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminTaxRateDeleteResponse>
) => {
  const id = req.params.id
  await deleteTaxRatesWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "tax_rate",
    deleted: true,
  })
}
