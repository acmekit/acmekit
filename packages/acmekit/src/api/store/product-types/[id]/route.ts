import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { StoreProductTypeResponse } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
} from "@acmekit/framework/utils"

import { StoreProductTypeParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<StoreProductTypeParamsType>,
  res: AcmeKitResponse<StoreProductTypeResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "product_type",
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
      `Product type with id: ${req.params.id} was not found`
    )
  }

  const productType = data[0]

  res.json({ product_type: productType })
}
