import {
  CartCreditLineDTO,
  CreateCartCreditLinesWorkflowInput,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createEntitiesStep } from "../../common/steps/create-entities"

export const createCartCreditLinesWorkflowId = "create-cart-credit-lines"
/**
 * This workflow creates one or more credit lines for a cart.
 * 
 * @example
 * const { result } = await createCartCreditLinesWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     amount: 10,
 *     reference: "payment",
 *     reference_id: "payment_123",
 *     metadata: {
 *       key: "value",
 *     },
 *   }
 * })
 */
export const createCartCreditLinesWorkflow = createWorkflow(
  createCartCreditLinesWorkflowId,
  (
    input: WorkflowData<CreateCartCreditLinesWorkflowInput>
  ): WorkflowResponse<CartCreditLineDTO[]> => {
    const creditLines = createEntitiesStep({
      moduleRegistrationName: Modules.CART,
      invokeMethod: "createCreditLines",
      compensateMethod: "deleteCreditLines",
      data: input,
    })

    return new WorkflowResponse(creditLines)
  }
)
