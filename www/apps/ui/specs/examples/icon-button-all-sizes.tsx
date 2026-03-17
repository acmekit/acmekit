import { IconButton } from "@medusajs/ui"
import { PlusMini } from "@medusajs/icons"

export default function IconButtonAllSizes() {
  return (
    <div className="flex gap-2 items-center">
      <IconButton size="2xsmall">
        <PlusMini />
      </IconButton>
      <IconButton size="xsmall">
        <PlusMini />
      </IconButton>
      <IconButton size="small">
        <PlusMini />
      </IconButton>
      <IconButton size="base">
        <PlusMini />
      </IconButton>
      <IconButton size="large">
        <PlusMini />
      </IconButton>
      <IconButton size="xlarge">
        <PlusMini />
      </IconButton>
    </div>
  )
}
