import { CurrencyInput } from "@acmekit/ui"

export default function CurrencyInputDemo() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput symbol="$" code="usd" />
    </div>
  )
}
