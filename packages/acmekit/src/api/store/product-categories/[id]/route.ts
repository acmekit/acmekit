import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { StoreProductCategoryResponse } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
} from "@acmekit/framework/utils"
import { StoreProductCategoryParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<StoreProductCategoryParamsType>,
  res: AcmeKitResponse<StoreProductCategoryResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: category } = await query.graph(
    {
      entity: "product_category",
      filters: { id: req.params.id, ...req.filterableFields },
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  if (!category) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product category with id: ${req.params.id} was not found`
    )
  }

  res.json({ product_category: category[0] })
}
