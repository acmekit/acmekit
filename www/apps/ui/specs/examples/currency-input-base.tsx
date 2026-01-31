import { CurrencyInput } from "@acmekit/ui"

export default function CurrencyInputBase() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput size="base" symbol="$" code="usd" />
    </div>
  )
}
