import { model } from "@acmekit/framework/utils"
import Refund from "./refund"

const RefundReason = model.define("RefundReason", {
  id: model.id({ prefix: "refr" }).primaryKey(),
  label: model.text().searchable(),
  code: model.text().searchable(),
  description: model.text().searchable().nullable(),
  metadata: model.json().nullable(),
  refunds: model.hasMany(() => Refund, {
    mappedBy: "refund_reason",
  }),
})

export default RefundReason
