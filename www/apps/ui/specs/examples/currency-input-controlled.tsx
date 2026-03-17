import { useState } from "react"
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputControlled() {
  const [value, setValue] = useState<string | undefined>("")
  const formatValue = (val: string | undefined) => {
    if (!val) {
      return ""
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(val))
  }
  return (
    <div className="max-w-[250px]">
      <CurrencyInput
        symbol="$"
        code="usd"
        value={value}
        onValueChange={setValue}
        aria-label="Amount"
      />
      <div className="mt-2 text-xs text-ui-fg-muted">
        Value: {formatValue(value)}
      </div>
    </div>
  )
}
