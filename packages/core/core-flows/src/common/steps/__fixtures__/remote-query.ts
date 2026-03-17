export interface SimpleProduct {
  id: string
  title: string
  description: string
  variants: Variant[]
}

export interface Variant {
  id: string
  title: string
  sku: string
  product_id: string
}

export interface FixtureEntryPoints {
  simple_product: SimpleProduct
  variant: Variant
}

declare module "@medusajs/types/dist/modules-sdk/remote-query-entry-points" {
  export interface RemoteQueryEntryPoints extends FixtureEntryPoints {}
}
