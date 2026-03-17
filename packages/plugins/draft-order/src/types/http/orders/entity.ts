import { HttpTypes } from "@medusajs/types"

export type AdminOrderPreviewLineItem = HttpTypes.AdminOrderLineItem & {
  actions?: HttpTypes.AdminOrderChangeAction[]
}
