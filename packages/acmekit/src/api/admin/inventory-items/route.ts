import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"

import { createInventoryItemsWorkflow } from "@acmekit/core-flows"
import { refetchInventoryItem } from "./helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminCreateInventoryItem,
    HttpTypes.SelectParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminInventoryItemResponse>
) => {
  const { result } = await createInventoryItemsWorkflow(req.scope).run({
    input: { items: [req.validatedBody] },
  })

  const inventoryItem = await refetchInventoryItem(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminInventoryItemsParams>,
  res: AcmeKitResponse<HttpTypes.AdminInventoryItemListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory_items",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: inventory_items, metadata } = await remoteQuery({
    ...query,
  })

  res.status(200).json({
    inventory_items,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
