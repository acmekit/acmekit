import { useState } from "react"
import { Label, Switch } from "@medusajs/ui"

export default function SwitchControlled() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-x-2">
        <Switch
          id="manage-inventory-controlled"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="manage-inventory-controlled">Manage Inventory</Label>
      </div>
      <div className="txt-small text-ui-fg-muted">
        {checked
          ? "You are managing inventory"
          : "You are not managing inventory"}
      </div>
    </div>
  )
}
