import { IconButton } from "@medusajs/ui"
import { PlusMini } from "@medusajs/icons"

export default function IconButtonAllVariants() {
  return (
    <div className="flex gap-2">
      <IconButton variant="primary">
        <PlusMini />
      </IconButton>
      <IconButton variant="transparent">
        <PlusMini />
      </IconButton>
    </div>
  )
}
