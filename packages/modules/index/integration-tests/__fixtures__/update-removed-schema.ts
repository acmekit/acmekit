export const updateRemovedSchema = `
  type Product @Listeners(values: ["product.created", "product.updated", "product.deleted"]) {
    id: ID
    title: String
    handle: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["variant.created", "variant.updated", "variant.deleted"]) {
    id: ID
    product_id: String
    sku: String
    description: String
  }
`
