import { Modules } from "../modules-sdk/definition"
import { composeLinkName } from "./compose-link-name"

export const LINKS = {
  ProductVariantInventoryItem: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.INVENTORY,
    "inventory_item_id"
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
