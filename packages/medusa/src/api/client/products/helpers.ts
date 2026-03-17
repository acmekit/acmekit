import { refetchEntity } from "@medusajs/framework/http"
import {
  HttpTypes,
  MedusaContainer,
} from "@medusajs/framework/types"
import { StoreRequestWithContext } from "../types"

export type RequestWithContext<
  Body,
  QueryFields = Record<string, unknown>
> = StoreRequestWithContext<Body, QueryFields>

export const refetchProduct = async (
  idOrFilter: string | object,
  scope: MedusaContainer,
  fields: string[]
) => {
  return await refetchEntity({ entity: "product", idOrFilter, scope, fields })
}

export const filterOutInternalProductCategories = (
  products: HttpTypes.StoreProduct[]
) => {
  return products.forEach((product: HttpTypes.StoreProduct) => {
    if (!product.categories) {
      return
    }

    product.categories = product.categories.filter(
      (category) =>
        !(category as HttpTypes.StoreProductCategory & { is_internal: boolean })
          .is_internal
    )
  })
}

export const wrapProductsWithTaxPrices = async <T>(
  _req: RequestWithContext<T>,
  _products: HttpTypes.StoreProduct[]
) => {
  // Tax module removed
}
