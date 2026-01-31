import { AcmeKitError } from "@acmekit/framework/utils"
import { createStep, StepResponse } from "@acmekit/framework/workflows-sdk"

import type { SalesChannelDTO } from "@acmekit/framework/types"

export const validateSalesChannelStep = createStep(
  "validate-sales-channel",
  async (data: { salesChannel: SalesChannelDTO }) => {
    const { salesChannel } = data

    if (!salesChannel?.id) {
      throw new AcmeKitError(
        AcmeKitError.Types.INVALID_DATA,
        "Sales channel is required when creating a cart. Either provide a sales channel ID or set the default sales channel for the store."
      )
    }

    return new StepResponse(void 0)
  }
)
