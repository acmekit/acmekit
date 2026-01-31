import { batchLinkProductsToCollectionWorkflow } from "@acmekit/core-flows"
import { HttpTypes } from "@acmekit/framework/types"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { refetchCollection } from "../../helpers"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.AdminCollectionParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminCollectionResponse>
) => {
  const id = req.params.id
  const { add = [], remove = [] } = req.validatedBody

  const workflow = batchLinkProductsToCollectionWorkflow(req.scope)
  await workflow.run({
    input: {
      id,
      add,
      remove,
    },
  })

  const collection = await refetchCollection(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    collection,
  })
}
