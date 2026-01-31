import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { StoreProductTagResponse } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
} from "@acmekit/framework/utils"

import { StoreProductTagParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<StoreProductTagParamsType>,
  res: AcmeKitResponse<StoreProductTagResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "product_tag",
      filters: {
        id: req.params.id,
      },
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  if (!data.length) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product tag with id: ${req.params.id} was not found`
    )
  }

  const productTag = data[0]

  res.json({ product_tag: productTag })
}
