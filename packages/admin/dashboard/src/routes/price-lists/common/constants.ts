/**
 * Re-implementation of enum from `@acmekit/acmekit` as it cannot be imported
 */
export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

export enum PriceListDateStatus {
  SCHEDULED = "scheduled",
  EXPIRED = "expired",
}

/**
 * Re-implementation of enum from `@acmekit/acmekit` as it cannot be imported
 */
export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}
