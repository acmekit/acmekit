import {
  CancelOrderExchangeDTO,
  IOrderModuleService,
} from "@acmekit/framework/types"
import { Modules } from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

export const cancelOrderExchangeStepId = "cancel-order-swap"
/**
 * This step cancels an exchange.
 */
export const cancelOrderExchangeStep = createStep(
  cancelOrderExchangeStepId,
  async (data: CancelOrderExchangeDTO, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.cancelExchange(data)
    return new StepResponse(void 0, data.order_id)
  },
  async (orderId, { container }) => {
    if (!orderId) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.revertLastVersion(orderId)
  }
)
