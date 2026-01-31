import {
  CreatePriceSetDTO,
  IPricingModuleService,
} from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

/**
 * The price sets to create.
 */
export type CreatePriceSetWorkflowInput = CreatePriceSetDTO[]

export const createPriceSetsStepId = "create-price-sets"
/**
 * This step creates one or more price sets.
 * 
 * @example
 * const data = createPriceSetsStep([{
 *   prices: [
 *     {
 *       amount: 10,
 *       currency_code: "usd",
 *     }
 *   ]
 * }])
 */
export const createPriceSetsStep = createStep(
  createPriceSetsStepId,
  async (data: CreatePriceSetWorkflowInput, { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    const priceSets = await pricingModule.createPriceSets(data)

    return new StepResponse(
      priceSets,
      priceSets.map((priceSet) => priceSet.id)
    )
  },
  async (priceSets, { container }) => {
    if (!priceSets?.length) {
      return
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
    )

    await pricingModule.deletePriceSets(priceSets)
  }
)
