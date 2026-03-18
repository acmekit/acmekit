import ProductModule from "@acmekit/medusa/product"
import { defineLink } from "@acmekit/utils"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.productVariant.id,
  Translation.linkable.translation.id
)
