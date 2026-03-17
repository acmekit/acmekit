import { Checkbox, CheckboxCheckedState, Label } from "@medusajs/ui"
import { useState } from "react"

export default function CheckboxControlled() {
  const [checked, setChecked] = useState<CheckboxCheckedState>(false)

  const handleToggle = () => {
    switch (checked) {
      case "indeterminate":
        setChecked(true)
        return
      case true:
        setChecked(false)
        return
      default:
        setChecked("indeterminate")
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <span className="txt-small text-center w-3/4">
        The following checkbox will move from unchecked, to indeterminate, and
        finally checked each time you click it
      </span>
      <div className="flex items-center gap-2">
        <Checkbox
          id="controlled-checkbox"
          checked={checked}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="controlled-checkbox">
          Controlled Checkbox: (
          {checked === "indeterminate"
            ? "Indeterminate"
            : checked
              ? "Checked"
              : "Unchecked"}
          )
        </Label>
      </div>
    </div>
  )
}
