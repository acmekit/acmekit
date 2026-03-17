import { IconBadge } from "@medusajs/ui"
import { BuildingTax } from "@medusajs/icons"

export default function IconBadgeAllColors() {
  return (
    <div className="flex gap-3">
      <IconBadge color="grey">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="purple">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="orange">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="red">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="blue">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="green">
        <BuildingTax />
      </IconBadge>
    </div>
  )
}
