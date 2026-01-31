import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import {
  importProductsWorkflowId,
  waitConfirmationProductImportStepId,
} from "@acmekit/core-flows"
import { IWorkflowEngineService } from "@acmekit/framework/types"
import { Modules, TransactionHandlerType } from "@acmekit/framework/utils"
import { StepResponse } from "@acmekit/framework/workflows-sdk"

/**
 * @deprecated use `POST /admin/products/imports/:transaction_id/confirm` instead.
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
    Modules.WORKFLOW_ENGINE
  )
  const transactionId = req.params.transaction_id

  await workflowEngineService.setStepSuccess({
    idempotencyKey: {
      action: TransactionHandlerType.INVOKE,
      transactionId,
      stepId: waitConfirmationProductImportStepId,
      workflowId: importProductsWorkflowId,
    },
    stepResponse: new StepResponse(true),
  })

  res.status(202).json({})
}
