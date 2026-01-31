import { IconButton } from "@acmekit/ui"
import { PlusMini } from "@acmekit/icons"

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
