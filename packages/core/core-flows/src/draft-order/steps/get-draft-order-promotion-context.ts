import { Modules } from "@acmekit/framework/utils"
import { createStep, StepResponse } from "@acmekit/framework/workflows-sdk"
import type { IOrderModuleService, OrderDTO } from "@acmekit/framework/types"

/**
 * The details of the draft order to get the promotion context for.
 */
export interface GetDraftOrderPromotionContextStepInput {
  /**
   * The draft order to get the promotion context for.
   */
  order: OrderDTO
}

/**
 * This step gets the promotion context for a draft order.
 *
 * :::note
 *
 * You can retrieve a draft order's details using [Query](https://docs.acmekit.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.acmekit.com/resources/references/acmekit-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = getDraftOrderPromotionContextStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   }
 * })
 */
export const getDraftOrderPromotionContextStep = createStep(
  "get-draft-order-promotion-context",
  async ({ order }: GetDraftOrderPromotionContextStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const preview = await service.previewOrderChange(order.id)

    const orderWithPreviewItemsAndAShipping: OrderDTO = {
      ...order,
      items: preview.items,
      shipping_methods: preview.shipping_methods,
    }

    return new StepResponse(orderWithPreviewItemsAndAShipping)
  }
)
