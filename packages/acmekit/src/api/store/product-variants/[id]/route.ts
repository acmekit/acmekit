import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes, QueryContextType } from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
  QueryContext,
} from "@acmekit/framework/utils"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "../../../utils/middlewares"
import { StoreRequestWithContext } from "../../types"
import { wrapVariantsWithTaxPrices } from "../helpers"
import { StoreProductVariantParamsType } from "../validators"

type StoreVariantRetrieveRequest =
  StoreRequestWithContext<HttpTypes.StoreProductVariantParams> &
    AuthenticatedAcmeKitRequest<StoreProductVariantParamsType>

/**
 * @since 2.11.2
 */
export const GET = async (
  req: StoreVariantRetrieveRequest,
  res: AcmeKitResponse<HttpTypes.StoreProductVariantResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const withInventoryQuantity =
    req.queryConfig.fields.includes("inventory_quantity")

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => field !== "inventory_quantity"
    )
  }

  const context: QueryContextType = {}

  if (req.pricingContext) {
    context["calculated_price"] = QueryContext(req.pricingContext)
  }

  const { data: variants = [] } = await query.graph(
    {
      entity: "variant",
      filters: {
        ...req.filterableFields,
        id: req.params.id,
      },
      fields: req.queryConfig.fields,
      context,
    },
    {
      locale: req.locale,
    }
  )

  const variant = variants[0]

  if (!variant) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Product variant with id: ${req.params.id} was not found`
    )
  }

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(req, [variant])
  }

  await wrapVariantsWithTaxPrices(req, [variant])

  res.json({ variant })
}
