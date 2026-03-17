import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to validate if sales channels can be deleted.
 */
export type CanDeleteSalesChannelsOrThrowStepInput = {
  /**
   * The IDs of the sales channels to validate.
   */
  ids: string | string[]
}

export const canDeleteSalesChannelsOrThrowStepId =
  "can-delete-sales-channels-or-throw-step"

/**
 * This step validates that the specified sales channels can be deleted.
 *
 * @example
 * const data = canDeleteSalesChannelsOrThrowStep({
 *   ids: ["sc_123"]
 * })
 */
export const canDeleteSalesChannelsOrThrowStep = createStep(
  canDeleteSalesChannelsOrThrowStepId,
  async (_: CanDeleteSalesChannelsOrThrowStepInput) => {
    return new StepResponse(true)
  }
)
