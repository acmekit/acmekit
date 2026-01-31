import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
} from "@acmekit/framework/utils"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.SelectParams>,
  res: AcmeKitResponse<HttpTypes.StoreCollectionResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: collections } = await query.graph(
    {
      entity: "product_collection",
      filters: { id: req.params.id },
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  const collection = collections[0]
  if (!collection) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Collection with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ collection: collection })
}
