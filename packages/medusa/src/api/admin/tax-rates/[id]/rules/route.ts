import { createTaxRateRulesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchTaxRate } from "../../helpers"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateTaxRateRule,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminTaxRateResponse>
) => {
  await createTaxRateRulesWorkflow(req.scope).run({
    input: {
      rules: [
        {
          ...req.validatedBody,
          tax_rate_id: req.params.id,
          created_by: req.auth_context.actor_id,
        },
      ],
    },
  })

  const taxRate = await refetchTaxRate(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )
  res.status(200).json({ tax_rate: taxRate })
}
