import { Checkbox, Label } from "@medusajs/ui"

export default function CheckboxAllStates() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-1">
        <Checkbox id="default" />
        <Label htmlFor="default">Default</Label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox id="checked" checked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox id="indeterminate" checked="indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
    </div>
  )
}
