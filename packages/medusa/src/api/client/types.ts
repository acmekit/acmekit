import { AcmeKitStoreRequest } from "@acmekit/framework/http"
import {
  AcmeKitPricingContext,
  TaxCalculationContext,
} from "@acmekit/framework/types"

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
