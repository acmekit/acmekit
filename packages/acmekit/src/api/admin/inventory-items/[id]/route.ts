import { AcmeKitError } from "@acmekit/framework/utils"
import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import {
  deleteInventoryItemWorkflow,
  updateInventoryItemsWorkflow,
} from "@acmekit/core-flows"
import { refetchInventoryItem } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.AdminInventoryItemResponse>
) => {
  const { id } = req.params
  const inventoryItem = await refetchInventoryItem(
    id,
    req.scope,
    req.queryConfig.fields
  )
  if (!inventoryItem) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Inventory item with id: ${id} was not found`
    )
  }

  res.status(200).json({
    inventory_item: inventoryItem,
  })
}

// Update inventory item
export const POST = async (
  req: AcmeKitRequest<
    HttpTypes.AdminUpdateInventoryItem,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminInventoryItemResponse>
) => {
  const { id } = req.params

  await updateInventoryItemsWorkflow(req.scope).run({
    input: {
      updates: [{ id, ...req.validatedBody }],
    },
  })

  const inventoryItem = await refetchInventoryItem(
    id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    inventory_item: inventoryItem,
  })
}

export const DELETE = async (
  req: AcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminInventoryItemDeleteResponse>
) => {
  const id = req.params.id
  const deleteInventoryItems = deleteInventoryItemWorkflow(req.scope)

  await deleteInventoryItems.run({
    input: [id],
  })

  res.status(200).json({
    id,
    object: "inventory_item",
    deleted: true,
  })
}
