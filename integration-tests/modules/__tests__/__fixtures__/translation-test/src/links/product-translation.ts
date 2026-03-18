import { defineLink } from "@acmekit/framework/utils"
import ProductModule from "@acmekit/medusa/product"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.product.id,
  Translation.linkable.translation.id
)
