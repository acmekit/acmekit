import { defineMiddlewares } from "../utils/define-middlewares"
import { adminApiKeyRoutesMiddlewares } from "./admin/api-keys/middlewares"
import { adminClaimRoutesMiddlewares } from "./admin/claims/middlewares"
import { adminCollectionRoutesMiddlewares } from "./admin/collections/middlewares"
import { adminCurrencyRoutesMiddlewares } from "./admin/currencies/middlewares"
import { adminCustomerGroupRoutesMiddlewares } from "./admin/customer-groups/middlewares"
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares"
import { adminExchangeRoutesMiddlewares } from "./admin/exchanges/middlewares"
import { adminInventoryRoutesMiddlewares } from "./admin/inventory-items/middlewares"
import { adminInviteRoutesMiddlewares } from "./admin/invites/middlewares"
import { adminNotificationRoutesMiddlewares } from "./admin/notifications/middlewares"
import { adminOrderRoutesMiddlewares } from "./admin/orders/middlewares"
import { adminPriceListsRoutesMiddlewares } from "./admin/price-lists/middlewares"
import { adminPricePreferencesRoutesMiddlewares } from "./admin/price-preferences/middlewares"
import { adminProductCategoryRoutesMiddlewares } from "./admin/product-categories/middlewares"
import { adminProductTagRoutesMiddlewares } from "./admin/product-tags/middlewares"
import { adminProductTypeRoutesMiddlewares } from "./admin/product-types/middlewares"
import { adminProductVariantRoutesMiddlewares } from "./admin/product-variants/middlewares"
import { adminProductRoutesMiddlewares } from "./admin/products/middlewares"
import { adminRbacRoutesMiddlewares } from "./admin/rbac/middlewares"
import { adminRefundReasonsRoutesMiddlewares } from "./admin/refund-reasons/middlewares"
import { adminRegionRoutesMiddlewares } from "./admin/regions/middlewares"
import { adminReservationRoutesMiddlewares } from "./admin/reservations/middlewares"
import { adminReturnReasonRoutesMiddlewares } from "./admin/return-reasons/middlewares"
import { adminReturnRoutesMiddlewares } from "./admin/returns/middlewares"
import { adminSalesChannelRoutesMiddlewares } from "./admin/sales-channels/middlewares"
import { adminStoreRoutesMiddlewares } from "./admin/stores/middlewares"
import { adminTaxProviderRoutesMiddlewares } from "./admin/tax-providers/middlewares"
import { adminTaxRateRoutesMiddlewares } from "./admin/tax-rates/middlewares"
import { adminTaxRegionRoutesMiddlewares } from "./admin/tax-regions/middlewares"
import { adminUploadRoutesMiddlewares } from "./admin/uploads/middlewares"
import { adminUserRoutesMiddlewares } from "./admin/users/middlewares"
import { columnRoutesMiddlewares } from "./admin/views/[entity]/columns/middlewares"
import { viewConfigurationRoutesMiddlewares } from "./admin/views/[entity]/configurations/middlewares"
import { adminWorkflowsExecutionsMiddlewares } from "./admin/workflows-executions/middlewares"
import { authRoutesMiddlewares } from "./auth/middlewares"
import { cloudRoutesMiddlewares } from "./cloud/middlewares"
import { hooksRoutesMiddlewares } from "./hooks/middlewares"
import { storeCartRoutesMiddlewares } from "./client/carts/middlewares"
import { storeCollectionRoutesMiddlewares } from "./client/collections/middlewares"
import { storeCurrencyRoutesMiddlewares } from "./client/currencies/middlewares"
import { storeCustomerRoutesMiddlewares } from "./client/customers/middlewares"
import { storeRoutesMiddlewares } from "./client/middlewares"
import { storeOrderRoutesMiddlewares } from "./client/orders/middlewares"
import { storeProductCategoryRoutesMiddlewares } from "./client/product-categories/middlewares"
import { storeProductTagRoutesMiddlewares } from "./client/product-tags/middlewares"
import { storeProductTypeRoutesMiddlewares } from "./client/product-types/middlewares"
import { storeProductVariantRoutesMiddlewares } from "./client/product-variants/middlewares"
import { storeProductRoutesMiddlewares } from "./client/products/middlewares"
import { storeRegionRoutesMiddlewares } from "./client/regions/middlewares"
import { storeReturnReasonRoutesMiddlewares } from "./client/return-reasons/middlewares"
import { adminIndexRoutesMiddlewares } from "./admin/index/middlewares"
import { setSecretApiKeyContext } from "@medusajs/framework"
import { adminLocalesRoutesMiddlewares } from "./admin/locales/middlewares"
import { adminTranslationsRoutesMiddlewares } from "./admin/translations/middlewares"

export default defineMiddlewares([
  ...storeRoutesMiddlewares,
  {
    matcher: "/admin*",
    middlewares: [setSecretApiKeyContext],
  },
  ...adminCustomerGroupRoutesMiddlewares,
  ...adminCustomerRoutesMiddlewares,
  ...storeCartRoutesMiddlewares,
  ...storeCustomerRoutesMiddlewares,
  ...storeCartRoutesMiddlewares,
  ...storeCollectionRoutesMiddlewares,
  ...storeProductCategoryRoutesMiddlewares,
  ...storeProductTagRoutesMiddlewares,
  ...storeProductTypeRoutesMiddlewares,
  ...storeOrderRoutesMiddlewares,
  ...authRoutesMiddlewares,
  ...adminWorkflowsExecutionsMiddlewares,
  ...adminReturnRoutesMiddlewares,
  ...storeRegionRoutesMiddlewares,
  ...adminRegionRoutesMiddlewares,
  ...adminRbacRoutesMiddlewares,
  ...adminReturnRoutesMiddlewares,
  ...adminUserRoutesMiddlewares,
  ...adminInviteRoutesMiddlewares,
  ...adminTaxRateRoutesMiddlewares,
  ...adminTaxRegionRoutesMiddlewares,
  ...adminTranslationsRoutesMiddlewares,
  ...adminApiKeyRoutesMiddlewares,
  ...hooksRoutesMiddlewares,
  ...adminStoreRoutesMiddlewares,
  ...adminCurrencyRoutesMiddlewares,
  ...adminLocalesRoutesMiddlewares,
  ...storeCurrencyRoutesMiddlewares,
  ...adminProductRoutesMiddlewares,
  ...adminPriceListsRoutesMiddlewares,
  ...adminPricePreferencesRoutesMiddlewares,
  ...adminInventoryRoutesMiddlewares,
  ...adminCollectionRoutesMiddlewares,
  ...adminSalesChannelRoutesMiddlewares,
  ...adminProductTypeRoutesMiddlewares,
  ...adminProductTagRoutesMiddlewares,
  ...adminUploadRoutesMiddlewares,
  ...adminNotificationRoutesMiddlewares,
  ...adminOrderRoutesMiddlewares,
  ...adminReservationRoutesMiddlewares,
  ...adminProductCategoryRoutesMiddlewares,
  ...storeProductRoutesMiddlewares,
  ...storeProductVariantRoutesMiddlewares,
  ...storeReturnReasonRoutesMiddlewares,
  ...adminReturnReasonRoutesMiddlewares,
  ...adminClaimRoutesMiddlewares,
  ...adminRefundReasonsRoutesMiddlewares,
  ...adminExchangeRoutesMiddlewares,
  ...adminProductVariantRoutesMiddlewares,
  ...adminTaxProviderRoutesMiddlewares,
  ...viewConfigurationRoutesMiddlewares,
  ...columnRoutesMiddlewares,
  ...adminIndexRoutesMiddlewares,
  ...cloudRoutesMiddlewares,
])
