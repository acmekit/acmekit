import { defineLink } from "@acmekit/framework/utils"
import ProductModule from "@acmekit/acmekit/product"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.product.id,
  Translation.linkable.translation.id
)
