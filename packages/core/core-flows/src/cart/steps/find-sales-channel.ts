import {
  ISalesChannelModuleService,
  MedusaContainer,
  SalesChannelDTO,
} from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  useCache,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the sales channel to find.
 */
export interface FindSalesChannelStepInput {
  /**
   * The ID of the sales channel to find.
   */
  salesChannelId?: string | null
}

async function fetchSalesChannel(
  salesChannelId: string,
  container: MedusaContainer
) {
  const salesChannelService = container.resolve<ISalesChannelModuleService>(
    Modules.SALES_CHANNEL
  )

  return await useCache<
    Awaited<ReturnType<typeof salesChannelService.retrieveSalesChannel>>
  >(async () => salesChannelService.retrieveSalesChannel(salesChannelId), {
    container,
    key: ["find-sales-channel", salesChannelId],
  })
}

export const findSalesChannelStepId = "find-sales-channel"
/**
 * This step retrieves a sales channel using the ID provided as input.
 */
export const findSalesChannelStep = createStep(
  findSalesChannelStepId,
  async (data: FindSalesChannelStepInput, { container }) => {
    let salesChannel: SalesChannelDTO | undefined

    if (data.salesChannelId) {
      salesChannel = await fetchSalesChannel(data.salesChannelId, container)
    }

    if (!salesChannel) {
      return new StepResponse(null)
    }

    if (salesChannel?.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unable to assign cart to disabled Sales Channel: ${salesChannel.name}`
      )
    }

    return new StepResponse(salesChannel)
  }
)
