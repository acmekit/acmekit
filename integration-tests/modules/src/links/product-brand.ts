import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/utils"
import BrandModule from "../modules/brand"

const link =
  process.env.ENABLE_INDEX_MODULE === "true"
    ? defineLink(
        {
          linkable: ProductModule.linkable.product.id,
          filterable: ["description", "material"],
          isList: true,
        },
        {
          linkable: BrandModule.linkable.brand.id,
          filterable: ["id", "name", "status"],
          isList: false,
        }
      )
    : {}

export default link
