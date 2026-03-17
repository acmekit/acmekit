import {
  AddItemAdjustmentAction,
  AddShippingMethodAdjustment,
  ComputeActions,
  PromotionDTO,
  RemoveItemAdjustmentAction,
  RemoveShippingMethodAdjustment,
} from "@medusajs/framework/types"
import {
  ComputedActions,
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the actions computed by the Promotion Module.
 */
export interface PrepareAdjustmentsFromPromotionActionsStepInput {
  /**
   * The actions computed by the Promotion Module.
   */
  actions: ComputeActions[]
}

/**
 * The details of the adjustments to create and remove.
 */
export interface PrepareAdjustmentsFromPromotionActionsStepOutput {
  /**
   * The line item adjustments to create.
   */
  lineItemAdjustmentsToCreate: {
    /**
     * The promotion code that computed the adjustment.
     */
    code: string
    /**
     * The amount of the adjustment.
     */
    amount: number
    /**
     * The ID of the line item to adjust.
     */
    item_id: string
    /**
     * The ID of the applied promotion.
     */
    promotion_id?: string
  }[]
  /**
   * The line item adjustment IDs to remove.
   */
  lineItemAdjustmentIdsToRemove: string[]
  /**
   * The shipping method adjustments to create.
   */
  shippingMethodAdjustmentsToCreate: {
    /**
     * The promotion code that computed the adjustment.
     */
    code: string
    /**
     * The amount of the adjustment.
     */
    amount: number
    /**
     * The ID of the shipping method to adjust.
     */
    shipping_method_id: string
    /**
     * The ID of the applied promotion.
     */
    promotion_id?: string
  }[]
  /**
   * The shipping method adjustment IDs to remove.
   */
  shippingMethodAdjustmentIdsToRemove: string[]
  /**
   * The promotion codes that were computed.
   */
  computedPromotionCodes: string[]
}

export const prepareAdjustmentsFromPromotionActionsStepId =
  "prepare-adjustments-from-promotion-actions"
/**
 * This step prepares the line item or shipping method adjustments using
 * actions computed by the Promotion Module.
 *
 * @example
 * const data = prepareAdjustmentsFromPromotionActionsStep({
 *   "actions": [{
 *     "action": "addItemAdjustment",
 *     "item_id": "litem_123",
 *     "amount": 10,
 *     "code": "10OFF",
 *   }]
 * })
 */
export const prepareAdjustmentsFromPromotionActionsStep = createStep(
  prepareAdjustmentsFromPromotionActionsStepId,
  async (
    data: PrepareAdjustmentsFromPromotionActionsStepInput,
    { container }
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { actions = [] } = data

    if (!actions.length) {
      return new StepResponse({
        lineItemAdjustmentsToCreate: [],
        lineItemAdjustmentIdsToRemove: [],
        shippingMethodAdjustmentsToCreate: [],
        shippingMethodAdjustmentIdsToRemove: [],
        computedPromotionCodes: [],
      } as PrepareAdjustmentsFromPromotionActionsStepOutput)
    }

    const { data: promotions } = await query.graph(
      {
        entity: "promotion",
        fields: ["id", "code"],
        filters: { code: actions.map((a) => a.code) },
      },
      { cache: { enable: true } }
    )

    const promotionsMap = new Map<string, PromotionDTO>(
      promotions.map((promotion) => [promotion.code!, promotion])
    )

    const lineItemAdjustmentsToCreate: PrepareAdjustmentsFromPromotionActionsStepOutput["lineItemAdjustmentsToCreate"] =
      []
    const lineItemAdjustmentIdsToRemove: string[] = []
    const shippingMethodAdjustmentsToCreate: PrepareAdjustmentsFromPromotionActionsStepOutput["shippingMethodAdjustmentsToCreate"] =
      []
    const shippingMethodAdjustmentIdsToRemove: string[] = []

    for (const action of actions) {
      switch (action.action) {
        case ComputedActions.ADD_ITEM_ADJUSTMENT:
          const itemAction = action as AddItemAdjustmentAction
          lineItemAdjustmentsToCreate.push({
            code: action.code,
            amount: itemAction.amount as number,
            is_tax_inclusive: itemAction.is_tax_inclusive, // TODO: there is a discrepeancy between the type and the actual data
            item_id: itemAction.item_id,
            promotion_id: promotionsMap.get(action.code)?.id,
          } as PrepareAdjustmentsFromPromotionActionsStepOutput["lineItemAdjustmentsToCreate"][number])
          break
        case ComputedActions.REMOVE_ITEM_ADJUSTMENT:
          lineItemAdjustmentIdsToRemove.push(
            (action as RemoveItemAdjustmentAction).adjustment_id
          )
          break
        case ComputedActions.ADD_SHIPPING_METHOD_ADJUSTMENT:
          const shippingAction = action as AddShippingMethodAdjustment
          shippingMethodAdjustmentsToCreate.push({
            code: action.code,
            amount: shippingAction.amount as number,
            shipping_method_id: shippingAction.shipping_method_id,
            promotion_id: promotionsMap.get(action.code)?.id,
          })
          break
        case ComputedActions.REMOVE_SHIPPING_METHOD_ADJUSTMENT:
          shippingMethodAdjustmentIdsToRemove.push(
            (action as RemoveShippingMethodAdjustment).adjustment_id
          )
          break
      }
    }

    const computedPromotionCodes = [
      ...lineItemAdjustmentsToCreate,
      ...shippingMethodAdjustmentsToCreate,
    ].map((adjustment) => adjustment.code)

    return new StepResponse({
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
      computedPromotionCodes,
    } as PrepareAdjustmentsFromPromotionActionsStepOutput)
  }
)
