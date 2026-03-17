import { Label } from "@medusajs/ui"

export default function LabelAllSizes() {
  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col gap-1">
        <Label size="xsmall" weight="regular">
          XSmall - Regular
        </Label>
        <Label size="xsmall" weight="plus">
          XSmall - Plus
        </Label>
      </div>
      <div className="flex flex-col gap-1">
        <Label size="small" weight="regular">
          Small - Regular
        </Label>
        <Label size="small" weight="plus">
          Small - Plus
        </Label>
      </div>
      <div className="flex flex-col gap-1">
        <Label size="base" weight="regular">
          Base - Regular
        </Label>
        <Label size="base" weight="plus">
          Base - Plus
        </Label>
      </div>
      <div className="flex flex-col gap-1">
        <Label size="large" weight="regular">
          Large - Regular
        </Label>
        <Label size="large" weight="plus">
          Large - Plus
        </Label>
      </div>
    </div>
  )
}
