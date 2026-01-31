import type { IPromotionModuleService } from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

/**
 * The IDs of the campaigns to delete.
 */
export type DeleteCampaignsStepInput = string[]

export const deleteCampaignsStepId = "delete-campaigns"
/**
 * This step deletes one or more campaigns.
 */
export const deleteCampaignsStep = createStep(
  deleteCampaignsStepId,
  async (ids: DeleteCampaignsStepInput, { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.softDeleteCampaigns(ids)

    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) {
      return
    }

    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )

    await promotionModule.restoreCampaigns(idsToRestore)
  }
)
