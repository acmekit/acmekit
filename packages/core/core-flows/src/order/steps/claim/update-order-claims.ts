import {
  IOrderModuleService,
  UpdateOrderClaimDTO,
} from "@acmekit/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

export const updateOrderClaimsStepId = "update-order-claim"
/**
 * This step updates one or more claims.
 */
export const updateOrderClaimsStep = createStep(
  updateOrderClaimsStepId,
  async (data: UpdateOrderClaimDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = (await service.listOrderClaims(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )) as UpdateOrderClaimDTO[]

    const updated = await service.updateOrderClaims(
      data.map((dt) => {
        const { id, ...rest } = dt
        return {
          selector: { id },
          data: rest,
        }
      })
    )

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderClaims(
      dataBeforeUpdate.map((dt) => {
        const { id, ...rest } = dt
        return {
          selector: { id },
          data: rest,
        }
      })
    )
  }
)
