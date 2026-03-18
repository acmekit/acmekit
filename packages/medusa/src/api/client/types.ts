import { AcmeKitStoreRequest } from "/framework/http"
import {
  AcmeKitPricingContext,
  TaxCalculationContext,
} from "/framework/types"

export type StoreRequestWithContext<
  Body,
  QueryFields = Record<string, unknown>
> = AcmeKitStoreRequest<Body, QueryFields> & {
  pricingContext?: AcmeKitPricingContext
  taxContext?: {
    taxLineContext?: TaxCalculationContext
    taxInclusivityContext?: {
      automaticTaxes: boolean
    }
  }
}
