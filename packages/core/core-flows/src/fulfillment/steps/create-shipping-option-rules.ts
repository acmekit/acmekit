import {
  AddFulfillmentShippingOptionRulesWorkflowDTO,
  IFulfillmentModuleService,
} from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

export const createShippingOptionRulesStepId = "create-shipping-option-rules"
/**
 * This step creates one or more shipping option rules.
 */
export const createShippingOptionRulesStep = createStep(
  createShippingOptionRulesStepId,
  async (
    input: AddFulfillmentShippingOptionRulesWorkflowDTO,
    { container }
  ) => {
    const { data } = input

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const createdShippingOptionRules =
      await fulfillmentModule.createShippingOptionRules(data)

    return new StepResponse(
      createdShippingOptionRules,
      createdShippingOptionRules.map((pr) => pr.id)
    )
  },
  async (ruleIds, { container }) => {
    if (!ruleIds?.length) {
      return
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await fulfillmentModule.deleteShippingOptionRules(ruleIds)
  }
)
