import type { CartDTO } from "@medusajs/framework/types"
import { arrayDifference, MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the cart and its shipping options context.
 */
export interface ValidateCartShippingOptionsStepInput {
  /**
   * The cart to validate shipping options for.
   */
  cart?: CartDTO
  /**
   * The context to validate the shipping options.
   */
  shippingOptionsContext?: {
    /**
     * Validate whether the shipping options are enabled in the store.
     */
    enabled_in_store?: "true" | "false"
    /**
     * Validate whether the shipping options are used for returns.
     */
    is_return?: "true" | "false"
  }
  /**
   * The IDs of the shipping options to validate.
   */
  option_ids: string[]
  /**
   * Pre-fetched shipping options. If provided, validation will be done against these
   * instead of querying the database.
   */
  prefetched_shipping_options?: { id: string }[]
}

export const validateCartShippingOptionsStepId =
  "validate-cart-shipping-options"
/**
 * This step validates shipping options to ensure they can be applied on a cart.
 * If not valid, the step throws an error.
 *
 * @example
 * const data = validateCartShippingOptionsStep({
 *   // retrieve the details of the cart from another workflow
 *   // or in another step using the Cart Module's service
 *   cart,
 *   option_ids: ["so_123"],
 *   shippingOptionsContext: {}
 * })
 */
export const validateCartShippingOptionsStep = createStep(
  validateCartShippingOptionsStepId,
  async (data: ValidateCartShippingOptionsStepInput) => {
    const {
      option_ids: optionIds = [],
      prefetched_shipping_options: prefetchedShippingOptions,
    } = data

    if (!optionIds.length) {
      return new StepResponse(void 0)
    }

    let validShippingOptionIds: string[]
    if (!prefetchedShippingOptions) {
      // Fulfillment module has been removed; treat all option IDs as valid
      // when no prefetched options are provided.
      validShippingOptionIds = optionIds
    } else {
      validShippingOptionIds = prefetchedShippingOptions.map((o) => o.id)
    }

    const invalidOptionIds = arrayDifference(optionIds, validShippingOptionIds)

    if (invalidOptionIds.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Shipping Options are invalid for cart.`
      )
    }

    return new StepResponse(void 0)
  }
)
