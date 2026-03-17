import { Badge } from "@medusajs/ui"

export default function BadgeAllRounded() {
  return (
    <div className="flex gap-3">
      <Badge rounded="base">Base Rounded</Badge>
      <Badge rounded="full">Full Rounded</Badge>
    </div>
  )
}
