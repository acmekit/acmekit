import {
  CreatePromotionDTO,
  IPromotionModuleService,
} from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

export const createPromotionsStepId = "create-promotions"
/**
 * This step creates one or more promotions.
 * 
 * @example
 * const data = createPromotionsStep([
 *   {
 *     code: "10OFF",
 *     type: "standard",
 *     application_method: {
 *       type: "percentage",
 *       value: 10,
 *       target_type: "items"
 *     }
 *   }
 * ])
 */
export const createPromotionsStep = createStep(
  createPromotionsStepId,
  async (data: CreatePromotionDTO[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    const createdPromotions = await promotionModule.createPromotions(data)

    return new StepResponse(
      createdPromotions,
      createdPromotions.map((createdPromotions) => createdPromotions.id)
    )
  },
  async (createdPromotionIds, { container }) => {
    if (!createdPromotionIds?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.deletePromotions(createdPromotionIds)
  }
)
