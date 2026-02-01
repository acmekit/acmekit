import type { StoreDTO } from "@acmekit/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@acmekit/framework/workflows-sdk"
import { createStoresStep } from "../steps"

/**
 * The data to create stores.
 */
export type CreateStoresWorkflowInput = {
  /**
   * The stores to create.
   */
  stores: Array<{
    name?: string
    supported_currencies?: Array<{ currency_code: string; is_default?: boolean }>
    supported_locales?: Array<{ locale_code: string }>
  }>
}

/**
 * The created stores.
 */
export type CreateStoresWorkflowOutput = StoreDTO[]

export const createStoresWorkflowId = "create-stores"
/**
 * This workflow creates one or more stores. By default, AcmeKit uses a single store. This is useful
 * if you're building a multi-tenant application or a marketplace where each tenant has its own store.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create stores within your custom flows.
 *
 * @example
 * const { result } = await createStoresWorkflow(container)
 * .run({
 *   input: {
 *     stores: [
 *       {
 *         name: "Acme",
 *         supported_currencies: [{
 *           currency_code: "usd",
 *           is_default: true
 *         }]
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more stores.
 */
export const createStoresWorkflow = createWorkflow(
  createStoresWorkflowId,
  (
    input: WorkflowData<CreateStoresWorkflowInput>
  ): WorkflowResponse<CreateStoresWorkflowOutput> => {
    const normalizedInput = transform({ input }, (data) => {
      return data.input.stores.map((store) => {
        return {
          ...store,
          supported_currencies: store.supported_currencies?.map((currency) => {
            return {
              currency_code: currency.currency_code,
              is_default: currency.is_default,
            }
          }),
        }
      })
    })

    const stores = createStoresStep(normalizedInput)
    return new WorkflowResponse(stores)
  }
)
