import type {
  IInventoryService,
  InventoryTypes,
} from "@acmekit/framework/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@acmekit/framework/utils"
import { StepResponse, createStep } from "@acmekit/framework/workflows-sdk"

import { Modules } from "@acmekit/framework/utils"

/**
 * The data to update reservation items.
 */
export type UpdateReservationsStepInput =
  InventoryTypes.UpdateReservationItemInput[]

export const updateReservationsStepId = "update-reservations-step"
/**
 * This step updates one or more reservations.
 *
 * @example
 * const data = updateReservationsStep([
 *   {
 *     id: "res_123",
 *     quantity: 1,
 *   }
 * ])
 */
export const updateReservationsStep = createStep(
  updateReservationsStepId,
  async (data: UpdateReservationsStepInput, { container }) => {
    const inventoryModuleService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    if (!data.length) {
      return new StepResponse([], {
        dataBeforeUpdate: [],
        selects: [],
        relations: [],
      })
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await inventoryModuleService.listReservationItems(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedReservations =
      await inventoryModuleService.updateReservationItems(data)

    return new StepResponse(updatedReservations, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const { dataBeforeUpdate = [], selects, relations } = revertInput

    const inventoryModuleService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    await inventoryModuleService.updateReservationItems(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
