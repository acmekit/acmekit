import { Badge } from "@medusajs/ui"

export default function BadgeAllSizes() {
  return (
    <div className="flex gap-3 items-center">
      <Badge size="2xsmall">2xsmall</Badge>
      <Badge size="xsmall">xsmall</Badge>
      <Badge size="small">small</Badge>
      <Badge size="base">base</Badge>
      <Badge size="large">large</Badge>
    </div>
  )
}
