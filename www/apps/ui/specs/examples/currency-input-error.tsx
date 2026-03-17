import { useState } from "react"
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputError() {
  const [value, setValue] = useState<string | undefined>("0")
  const [touched, setTouched] = useState(false)
  const isError = touched && (!value || parseFloat(value) <= 0)
  return (
    <div className="max-w-[250px]">
      <CurrencyInput
        symbol="$"
        code="usd"
        value={value}
        onValueChange={(val) => setValue(val)}
        aria-label="Amount"
        aria-invalid={isError}
        onBlur={() => setTouched(true)}
        min={0.01}
      />
      {isError && (
        <div className="mt-2 text-xs text-ui-fg-error">
          Amount must be greater than 0
        </div>
      )}
    </div>
  )
}
