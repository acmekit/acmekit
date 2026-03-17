import { Label, RadioGroup } from "@medusajs/ui"
import * as React from "react"

export default function RadioGroupControlled() {
  const [value, setValue] = React.useState("1")
  return (
    <div className="flex flex-col gap-2 items-center">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center gap-x-3">
          <RadioGroup.Item value="1" id="radio_1_controlled" />
          <Label htmlFor="radio_1_controlled" weight="plus">
            Radio 1
          </Label>
        </div>
        <div className="flex items-center gap-x-3">
          <RadioGroup.Item value="2" id="radio_2_controlled" />
          <Label htmlFor="radio_2_controlled" weight="plus">
            Radio 2
          </Label>
        </div>
        <div className="flex items-center gap-x-3">
          <RadioGroup.Item value="3" id="radio_3_controlled" />
          <Label htmlFor="radio_3_controlled" weight="plus">
            Radio 3
          </Label>
        </div>
      </RadioGroup>
      <div className="txt-small text-ui-fg-muted">Selected value: {value}</div>
    </div>
  )
}
