import { Label, Switch } from "@medusajs/ui"

export default function SwitchAllSizes() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <Switch id="switch-small" size="small" />
        <Label htmlFor="switch-small" size="small">
          Small switch
        </Label>
      </div>
      <div className="flex items-center gap-x-2">
        <Switch id="switch-base" size="base" />
        <Label htmlFor="switch-base" size="base">
          Base switch
        </Label>
      </div>
    </div>
  )
}
