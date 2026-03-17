import { Modules } from "../modules-sdk/definition"
import { composeLinkName } from "./compose-link-name"

export const LINKS = {
  ProductVariantInventoryItem: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.INVENTORY,
    "inventory_item_id"
  ),
  SalesChannelLocation: composeLinkName(
    Modules.SALES_CHANNEL,
    "sales_channel_id",
    Modules.STOCK_LOCATION,
    "location_id"
  ),
  LocationFulfillmentProvider: composeLinkName(
    Modules.STOCK_LOCATION,
    "stock_location_id",
    Modules.FULFILLMENT,
    "fulfillment_provider_id"
  ),
  LocationFulfillmentSet: composeLinkName(
    Modules.STOCK_LOCATION,
    "stock_location_id",
    Modules.FULFILLMENT,
    "fulfillment_set_id"
  ),
  OrderCart: composeLinkName(
    Modules.ORDER,
    "order_id",
    Modules.CART,
    "cart_id"
  ),
  OrderSalesChannel: composeLinkName(
    Modules.ORDER,
    "order_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
  PublishableApiKeySalesChannel: composeLinkName(
    Modules.API_KEY,
    "api_key_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
  ProductSalesChannel: composeLinkName(
    Modules.PRODUCT,
    "product_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
  OrderFulfillment: composeLinkName(
    Modules.ORDER,
    "order_id",
    Modules.FULFILLMENT,
    "fulfillment_id"
  ),
  ReturnFulfillment: composeLinkName(
    Modules.ORDER,
    "return_id",
    Modules.FULFILLMENT,
    "fulfillment_id"
  ),
  ProductShippingProfile: composeLinkName(
    Modules.PRODUCT,
    "product_id",
    Modules.FULFILLMENT,
    "shipping_profile_id"
  ),
  UserRbacRole: composeLinkName(
    Modules.USER,
    "user_id",
    Modules.RBAC,
    "rbac_role_id"
  ),
  InviteRbacRole: composeLinkName(
    Modules.USER,
    "invite_id",
    Modules.RBAC,
    "rbac_role_id"
  ),
}
